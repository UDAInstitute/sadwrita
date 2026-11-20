"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Navbar from "../Navbar";
import RavenLogo from "../Ravenlogo";
import {
  getReaderCard,
  saveReaderCard,
  type ReaderCard,
} from "../../../lib/reader-card";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

const editorialLinkClass =
  "inline-flex min-h-11 items-center justify-center border-b border-archive-border-strong px-1 pb-3 text-center text-[10px] font-medium tracking-[0.22em] uppercase transition-opacity duration-200 hover:opacity-55 sm:text-[14px]";

export default function ReaderCardRequest() {
  const [issuedCard, setIssuedCard] = useState<ReaderCard | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        setIssuedCard(getReaderCard());
      } catch (readError) {
        console.error(
          "Unable to read the Reader's Card from this browser.",
          readError,
        );
        setError(
          "The Reader's Card could not be read in this browser. Check local storage access and try again.",
        );
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const requestCard = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let recordIssued = false;

    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/reader-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("readerName") ?? ""),
          email: String(formData.get("readerEmail") ?? ""),
        }),
      });

      const result: unknown = await response.json();
      if (!response.ok) {
        const message =
          isRecord(result) && typeof result.error === "string"
            ? result.error
            : "Your Reader's Card could not be issued. Please try again.";
        throw new Error(message);
      }

      if (
        !isRecord(result) ||
        typeof result.readerName !== "string" ||
        typeof result.readerEmail !== "string" ||
        typeof result.readerSince !== "string" ||
        typeof result.readerId !== "string"
      ) {
        throw new Error("The Reader's Card service returned invalid details.");
      }

      recordIssued = true;
      const card = saveReaderCard({
        readerName: result.readerName,
        readerEmail: result.readerEmail,
        readerSince: result.readerSince,
        readerId: result.readerId,
      });
      setIssuedCard(card);
    } catch (issueError) {
      console.error("Unable to issue the Reader's Card.", issueError);
      setError(recordIssued
        ? "Your Reader's Card was issued, but this browser could not save it. Submit again with the same email to retrieve it."
        : issueError instanceof Error
          ? issueError.message
          : "Your Reader's Card could not be issued. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-svh bg-background pt-24 text-foreground transition-colors duration-300">
        <section className="mx-auto flex min-h-[calc(100svh-6rem)] max-w-[900px] flex-col items-center px-5 pt-14 pb-16 text-center sm:px-10 sm:pt-16 sm:pb-20">
          <RavenLogo className="h-14 w-14 object-contain" />
          <p className="mt-14 text-[9px] font-medium tracking-[0.28em] text-archive-muted-strong uppercase sm:mt-[66px] sm:text-[10px]">
            SADWRITA / READER&apos;S SPACE
          </p>
          <h1 className="mt-7 text-5xl leading-[0.94] font-bold tracking-[-0.06em] sm:mt-9 sm:text-7xl lg:text-[5rem]">
            Reader&apos;s Space
          </h1>
          <p className="mt-8 font-serif text-xl leading-relaxed text-archive-muted-strong italic sm:text-2xl">
            A personal place within the archive.
          </p>

          {issuedCard ? (
            <div className="mt-16 flex flex-col items-center">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                Reader&apos;s Card Issued
              </h2>
              <p className="mt-5 font-serif text-lg text-archive-muted-strong sm:text-xl">
                Welcome to the Archive.
              </p>
              <div className="mt-10 flex flex-col items-center gap-8 sm:flex-row sm:gap-10">
                <Link
                  href="/readers-space/card"
                  className={editorialLinkClass}
                >
                  [ VIEW READER&apos;S CARD ]
                </Link>
                <Link
                  href="/readers-space/overview"
                  className={editorialLinkClass}
                >
                  [ ENTER READER&apos;S SPACE ]
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-16 font-serif text-base leading-relaxed sm:mt-[68px] sm:text-lg">
                Enter your email to receive your Reader&apos;s Card.
              </p>
              <form
                onSubmit={requestCard}
                className="mt-8 flex w-full max-w-[525px] flex-col items-center"
              >
                <label className="block w-full">
                  <span className="sr-only">Email</span>
                  <input
                    autoComplete="email"
                    className="h-12 w-full border-b border-archive-border-strong bg-transparent text-center font-serif text-base outline-none placeholder:text-archive-muted-soft focus:border-foreground sm:text-lg"
                    name="readerEmail"
                    placeholder="your@email"
                    required
                    type="email"
                  />
                </label>
                <details className="mt-1 w-full">
                  <summary className="flex min-h-11 cursor-pointer items-center justify-center list-none font-mono text-[10px] tracking-[0.16em] text-archive-muted transition-opacity hover:opacity-65">
                    Name (optional)
                  </summary>
                  <label className="mt-3 block w-full">
                    <span className="sr-only">Name, optional</span>
                    <input
                      autoComplete="name"
                      className="h-12 w-full border-b border-archive-border-strong bg-transparent text-center font-serif text-base outline-none placeholder:text-archive-muted-soft focus:border-foreground sm:text-lg"
                      name="readerName"
                      placeholder="Your name"
                      type="text"
                    />
                  </label>
                </details>
                <button
                  className={`${editorialLinkClass} mt-2`}
                  aria-busy={isSubmitting}
                  disabled={isSubmitting}
                  type="submit"
                >
                  [ REQUEST READER&apos;S CARD ]
                </button>
              </form>
              {error ? (
                <p
                  role="alert"
                  className="mt-5 max-w-lg font-mono text-[11px] leading-relaxed text-archive-muted"
                >
                  {error}
                </p>
              ) : (
                <p className="mt-5 font-mono text-[11px] text-archive-muted">
                  Library card not found.
                </p>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}

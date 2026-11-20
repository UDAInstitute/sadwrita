"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import Navbar from "../Navbar";
import { getReaderCard } from "../../../lib/reader-card";

const editorialLinkClass =
  "inline-flex min-h-11 items-center justify-center border-b border-archive-border-strong px-1 pb-3 text-center text-[10px] font-medium tracking-[0.22em] uppercase transition-opacity duration-200 hover:opacity-55 sm:text-[14px]";

export default function ReaderSpaceGateway() {
  const router = useRouter();
  const [hasReaderCard, setHasReaderCard] = useState(false);
  const [entryError, setEntryError] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        setHasReaderCard(Boolean(getReaderCard()));
      } catch (error) {
        console.error("Unable to read the Reader's Card from this browser.", error);
        setEntryError(
          "Your Reader's Card could not be read in this browser. Check local storage access and try again.",
        );
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const enterReaderSpace = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    try {
      const card = getReaderCard();
      setHasReaderCard(Boolean(card));
      router.push(
        card ? "/readers-space/overview" : "/readers-space/request-card",
      );
    } catch (error) {
      console.error("Unable to read the Reader's Card from this browser.", error);
      setEntryError(
        "Your Reader's Card could not be read in this browser. Check local storage access and try again.",
      );
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-svh bg-background pt-24 text-foreground transition-colors duration-300">
        <section className="mx-auto flex min-h-[calc(100svh-6rem)] max-w-[1100px] flex-col items-center px-5 pt-10 pb-16 text-center sm:px-10 sm:pt-12 sm:pb-20">
          <p className="text-[9px] font-medium tracking-[0.28em] text-archive-muted-strong uppercase sm:text-[10px]">
            SADWRITA / READER&apos;S SPACE
          </p>
          <h1 className="mt-7 text-5xl leading-[0.94] font-bold tracking-[-0.06em] sm:text-7xl lg:text-[5.5rem]">
            Reader&apos;s Space
          </h1>
          <p className="mt-6 font-serif text-xl leading-relaxed text-archive-muted-strong italic sm:text-2xl">
            A personal place within the archive.
          </p>
          <p className="mt-5 font-mono text-[10px] tracking-[0.12em] text-archive-muted">
            A Reader&apos;s Card grants entry to the archive.
          </p>

          <ul className="mt-8 space-y-4 font-serif text-lg leading-[1.6] sm:mt-10">
            <li>Save writings.</li>
            <li>Collect passages.</li>
            <li>Keep notes.</li>
            <li>Track your reading.</li>
            <li>Follow books as they develop.</li>
          </ul>

          <div className="mt-16 flex flex-col items-center gap-8 sm:mt-[72px] sm:flex-row sm:gap-10">
            <Link
              href="/readers-space/request-card"
              onClick={enterReaderSpace}
              className={editorialLinkClass}
            >
              [ ENTER READER&apos;S SPACE ]
            </Link>
            <Link
              href={
                hasReaderCard
                  ? "/readers-space/card"
                  : "/readers-space/request-card"
              }
              className={editorialLinkClass}
            >
              {hasReaderCard
                ? "[ VIEW READER'S CARD ]"
                : "[ REQUEST READER'S CARD ]"}
            </Link>
          </div>

          {entryError && (
            <p
              role="alert"
              className="mt-6 max-w-lg font-mono text-[11px] leading-relaxed text-archive-muted"
            >
              {entryError}
            </p>
          )}
        </section>
      </main>
    </>
  );
}

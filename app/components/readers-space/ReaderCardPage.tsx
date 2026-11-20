"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReaderCardDisplay from "./ReaderCard";
import { getReaderCard, type ReaderCard } from "../../../lib/reader-card";

export default function ReaderCardPage() {
  const router = useRouter();
  const [card, setCard] = useState<ReaderCard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const savedCard = getReaderCard();
        if (!savedCard) {
          router.replace("/readers-space/request-card");
          return;
        }
        setCard(savedCard);
      } catch (readError) {
        console.error("Unable to read the Reader's Card from this browser.", readError);
        setError(
          "Your Reader's Card could not be read in this browser. Return to the entry page and try again.",
        );
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [router]);

  return (
    <main className="reader-card-page flex min-h-svh items-center justify-center bg-background px-5 py-20 text-foreground transition-colors duration-300 sm:px-10">
      {card ? (
        <div className="w-full max-w-[760px]">
          <h1 className="sr-only">Reader&apos;s Card</h1>
          <ReaderCardDisplay card={card} />
          <div className="reader-card-actions mt-8 flex justify-center">
            <button
              className="inline-flex min-h-11 items-center border-b border-archive-border-strong px-2 pb-3 text-[10px] font-medium tracking-[0.22em] uppercase transition-opacity duration-200 hover:opacity-55 sm:text-xs"
              onClick={() => window.print()}
              type="button"
            >
              [ PRINT CARD ]
            </button>
          </div>
        </div>
      ) : error ? (
        <p
          role="alert"
          className="max-w-lg text-center font-mono text-[11px] leading-relaxed text-archive-muted"
        >
          {error}
        </p>
      ) : (
        <p
          aria-live="polite"
          className="font-mono text-[11px] text-archive-muted"
        >
          Preparing your Reader&apos;s Card…
        </p>
      )}
    </main>
  );
}

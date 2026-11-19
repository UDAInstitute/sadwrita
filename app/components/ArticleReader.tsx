"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RavenLogo from "./Ravenlogo";
import Marginalia from "./Marginalia";
import ReaderActions from "./ReaderActions";
import ThemeToggle from "./ThemeToggle";
import PersistentHeader from "./PersistentHeader";

const relatedWorks = [
  {
    category: "Essays",
    archiveId: "SAD-ESS-011",
    slug: "the-weight-of-stillness",
    title: "The Weight of Stillness",
    excerpt: "Stillness is not the absence of motion but the presence of attention.",
  },
  {
    category: "Philosophy",
    archiveId: "SAD-PHI-008",
    slug: "consciousness-as-archive",
    title: "Consciousness as Archive",
    excerpt: "What if consciousness is a library of experience, shelved and slowly read?",
  },
  {
    category: "Fragments",
    archiveId: "SAD-FRA-019",
    slug: "notes-toward-an-archive-of-silence",
    title: "Notes Toward an Archive of Silence",
    excerpt: "The page begins in absence. Between one mark and the next, a history continues.",
  },
];

export default function ArticleReader() {
  const articleTitle = "On Permanence in a Disposable Age";
  const archiveId = "SAD-ESS-002";
  const [progress, setProgress] = useState(0);
  const storageKey = "sadwrita-reading-position";

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollable > 0
        ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100))
        : 0;
      setProgress(nextProgress);
      window.localStorage.setItem(storageKey, String(window.scrollY));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  useEffect(() => {
    const savedPosition = Number(window.localStorage.getItem(storageKey));
    if (Number.isFinite(savedPosition) && savedPosition > 0) {
      window.requestAnimationFrame(() => window.scrollTo(0, savedPosition));
    }
  }, []);

  const muted = "text-archive-muted";
  const border = "border-archive-border";
  const actionClass = "text-[8px] tracking-[0.2em] text-foreground uppercase transition-opacity duration-200 hover:opacity-55";

  return (
    <main className="relative min-h-svh bg-background text-foreground transition-colors duration-300">
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 z-50 h-px bg-foreground"
        style={{ width: `${progress}%` }}
      />

      <PersistentHeader className={`border-b ${border} px-5 sm:px-10 lg:px-12`}>
        <nav className="mx-auto flex h-16 max-w-[1800px] items-center justify-between">
          <Link
            href="/works"
            className="text-[9px] font-medium tracking-[0.24em] uppercase transition-opacity duration-200 hover:opacity-55"
          >
            ← Works
          </Link>
          <ThemeToggle />
        </nav>
      </PersistentHeader>

      <article className="px-5 sm:px-10">
        <header className="mx-auto max-w-[760px] pt-20 text-center sm:pt-28 lg:pt-36">
          <RavenLogo className="mx-auto h-14 w-14 object-contain sm:h-16 sm:w-16" />
          <p className={`mt-10 text-[8px] font-medium tracking-[0.26em] uppercase sm:text-[9px] ${muted}`}>
            Essay — SAD-ESS-002
          </p>
          <h1 className="mt-8 text-4xl leading-[1.02] font-bold tracking-[-0.055em] sm:text-6xl lg:text-[4.5rem]">
            On Permanence in a Disposable Age
          </h1>
          <p className={`mx-auto mt-7 max-w-lg font-serif text-lg leading-relaxed italic sm:text-xl ${muted}`}>
            On objects, memory, and the quiet discipline of keeping.
          </p>
          <div className={`mt-10 flex justify-center gap-5 border-y ${border} py-4 text-[8px] tracking-[0.2em] uppercase sm:text-[9px] ${muted}`}>
            <time>September 2026</time>
            <span aria-hidden="true">/</span>
            <span>7 min read</span>
          </div>
        </header>

        <div className="ml-0 mr-auto mt-16 max-w-[1488px] items-start sm:mt-20 lg:mt-24 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(220px,260px)] lg:gap-8 xl:gap-[43px]">
          <div className="relative min-w-0">
            <aside className="fixed top-1/2 left-10 hidden -translate-y-1/2 flex-col items-start gap-5 2xl:flex">
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className={actionClass}
              >
                Share
              </button>
            </aside>

            <div id="article-prose" className="mx-auto max-w-[700px] font-serif text-[18px] leading-[1.85] sm:text-[20px] sm:leading-[1.82] lg:ml-auto lg:mr-0 lg:max-w-[840px]">
              <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-2 first-letter:text-6xl first-letter:leading-[0.72] first-letter:font-semibold">
                Everything around us is designed to be discarded. The object is asked to last only as long as its usefulness; the image, as long as it holds attention. Even memory has been made transient, stored in systems that promise access while slowly withdrawing the places in which it can reside.
              </p>
              <p className="mt-10">
                Permanence was once considered an accident of matter. Stone endured. Paper yellowed but remained. A book occupied the same place on a shelf until someone reached for it again. Today permanence is an arrangement, not a guarantee: a ritual performed against the grain of speed.
              </p>
              <p className="mt-10">
                To keep is therefore an act of attention. It is the decision to return, to preserve the connection between a work and the hand that received it. A marked page becomes a record of another version of the reader. A margin, once filled, can never be mistaken for a neutral surface.
              </p>
              <blockquote className={`my-14 border-l ${border} pl-6 text-xl leading-[1.5] italic sm:pl-8 sm:text-2xl ${muted}`}>
                “The archive begins where the appetite for forgetting becomes visible.”
              </blockquote>
              <p className="mt-10">
                This is why the archive resists the temporary logic of a feed. It does not ask the reader to continue past the point of understanding. It waits. Its entries remain where they were placed, bearing no urgency except the visitor’s own desire to find them.
              </p>
              <p className="mt-10">
                Perhaps permanence is not the refusal of change. Perhaps it is the practice of allowing change to leave a legible trace. The preserved work is never untouched by time; its survival is evidence of repeated attention.
              </p>
              <p className="mt-10">
                To build for permanence is now a quiet rebellion. It requires patience rather than novelty, exactness rather than volume. It asks us to make fewer promises and to keep those that are made.
              </p>
            </div>

            <ReaderActions archiveId={archiveId} articleTitle={articleTitle} />

            <Marginalia />
          </div>
          <Marginalia desktop />
        </div>
      </article>

      <section className={`px-5 py-20 border-t ${border} bg-background text-foreground transition-colors duration-300 sm:px-10 lg:px-12 lg:py-28`}>
        <div className="mx-auto max-w-[1800px]">
          <header className="mb-10 flex items-end justify-between">
            <h2 className="text-3xl leading-none font-bold tracking-[-0.055em] sm:text-5xl">
              From the Archive
            </h2>
            <Link href="/works" className={`hidden text-[10px] tracking-[0.22em] uppercase sm:block ${muted}`}>
              All Works →
            </Link>
          </header>
          <div className="grid grid-cols-1 border border-archive-border-strong md:grid-cols-3">
            {relatedWorks.map((work) => (
              <Link
                key={work.archiveId}
                href={`/works/${work.slug}`}
                className="archive-panel group flex min-h-[340px] flex-col border-b border-archive-border-strong px-7 py-8 md:border-r md:border-b-0 md:last:border-r-0"
              >
                <p className="archive-panel-muted text-[9px] tracking-[0.22em] text-archive-muted uppercase">
                  {work.category} — {work.archiveId}
                </p>
                <h3 className="mt-8 text-2xl leading-[1.05] font-bold tracking-[-0.04em] sm:text-3xl">
                  {work.title}
                </h3>
                <p className="archive-panel-muted mt-auto pt-10 font-serif text-[16px] leading-[1.6] text-archive-muted-strong">
                  {work.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-background px-5 text-foreground transition-colors duration-300 sm:px-10">
        <div className="ml-0 mr-auto max-w-[1488px] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(220px,260px)] lg:gap-8 xl:gap-[43px]">
          <footer className={`mx-auto mt-24 w-full max-w-[700px] border-t ${border} py-12 text-left sm:mt-28 sm:py-16 lg:ml-auto lg:mr-0 lg:max-w-[840px]`}>
            <span className="text-xl" aria-hidden="true">◈</span>
            <p className={`mt-7 text-[8px] tracking-[0.26em] uppercase ${muted}`}>
              End of Entry
            </p>
            <p className="mt-5 text-sm">Archive ID: SAD-ESS-002</p>
            <p className={`mt-2 text-xs ${muted}`}>Published by SADWRITA</p>
            <RavenLogo className="mt-8 h-12 w-12 object-contain" />
          </footer>
        </div>
      </div>
    </main>
  );
}

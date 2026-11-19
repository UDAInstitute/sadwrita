"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import RavenLogo from "./Ravenlogo";
import Marginalia from "./Marginalia";
import ReaderActions from "./ReaderActions";

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
  const [archiveMode, setArchiveMode] = useState(false);

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

  const palette = archiveMode
    ? "bg-[#f5f5f5] text-black"
    : "bg-black text-[#f5f5f5]";

  const muted = archiveMode ? "text-black/55" : "text-white/55";
  const border = archiveMode ? "border-black/20" : "border-white/20";

  const actionClass = useMemo(
    () =>
      `text-[9px] tracking-[0.16em] uppercase transition-opacity duration-200 hover:opacity-55 ${
        archiveMode ? "text-black" : "text-white"
      }`,
    [archiveMode],
  );

  return (
    <main className={`relative min-h-svh transition-colors duration-300 ${palette}`}>
      <div
        aria-hidden="true"
        className={`fixed top-0 left-0 z-50 h-px ${archiveMode ? "bg-black" : "bg-[#f5f5f5]"}`}
        style={{ width: `${progress}%` }}
      />

      <header className={`border-b ${border} px-5 sm:px-10 lg:px-12`}>
        <nav className="mx-auto flex h-20 max-w-[1800px] items-center justify-between">
          <Link
            href="/works"
            className="text-[10px] font-medium tracking-[0.22em] uppercase transition-opacity duration-200 hover:opacity-55"
          >
            ← Works
          </Link>
          <button
            type="button"
            onClick={() => setArchiveMode((current) => !current)}
            className="text-[9px] tracking-[0.22em] uppercase"
            aria-pressed={archiveMode}
          >
            {archiveMode ? "Nocturne" : "Archive"}
          </button>
        </nav>
      </header>

      <article className="px-5 sm:px-10">
        <header className="mx-auto max-w-[700px] pt-20 text-center sm:pt-28 lg:pt-36">
          <RavenLogo
            className={`mx-auto h-14 w-14 object-contain sm:h-16 sm:w-16 ${
              archiveMode ? "invert" : ""
            }`}
          />
          <p className={`mt-10 text-[9px] font-medium tracking-[0.24em] uppercase sm:text-[10px] ${muted}`}>
            Essay — SAD-ESS-002
          </p>
          <h1 className="mt-8 text-5xl leading-[0.98] font-bold tracking-[-0.055em] sm:text-7xl lg:text-[5.5rem]">
            On Permanence in a Disposable Age
          </h1>
          <p className={`mx-auto mt-7 max-w-lg font-serif text-xl leading-relaxed italic sm:text-2xl ${muted}`}>
            On objects, memory, and the quiet discipline of keeping.
          </p>
          <div className={`mt-10 flex justify-center gap-5 border-y ${border} py-4 text-[9px] tracking-[0.18em] uppercase sm:text-[10px] ${muted}`}>
            <time>September 2026</time>
            <span aria-hidden="true">/</span>
            <span>7 min read</span>
          </div>
        </header>

        <div className="mx-auto mt-16 max-w-[1400px] items-start sm:mt-20 lg:mt-24 lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(260px,3fr)] lg:gap-12 xl:gap-16">
          <div className="relative">
          <aside className="fixed top-1/2 left-10 hidden -translate-y-1/2 flex-col items-start gap-5 2xl:flex">
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
              className={actionClass}
            >
              Share
            </button>
          </aside>

          <div id="article-prose" className="mx-auto max-w-[700px] font-serif text-[19px] leading-[1.82] sm:text-[21px] sm:leading-[1.78]">
            <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-2 first-letter:text-7xl first-letter:leading-[0.72] first-letter:font-semibold">
              Everything around us is designed to be discarded. The object is asked to last only as long as its usefulness; the image, as long as it holds attention. Even memory has been made transient, stored in systems that promise access while slowly withdrawing the places in which it can reside.
            </p>
            <p className="mt-8">
              Permanence was once considered an accident of matter. Stone endured. Paper yellowed but remained. A book occupied the same place on a shelf until someone reached for it again. Today permanence is an arrangement, not a guarantee: a ritual performed against the grain of speed.
            </p>
            <p className="mt-8">
              To keep is therefore an act of attention. It is the decision to return, to preserve the connection between a work and the hand that received it. A marked page becomes a record of another version of the reader. A margin, once filled, can never be mistaken for a neutral surface.
            </p>
            <blockquote className={`my-12 border-l ${border} pl-6 text-2xl leading-[1.45] italic sm:pl-8 sm:text-3xl ${muted}`}>
              “The archive begins where the appetite for forgetting becomes visible.”
            </blockquote>
            <p className="mt-8">
              This is why the archive resists the temporary logic of a feed. It does not ask the reader to continue past the point of understanding. It waits. Its entries remain where they were placed, bearing no urgency except the visitor’s own desire to find them.
            </p>
            <p className="mt-8">
              Perhaps permanence is not the refusal of change. Perhaps it is the practice of allowing change to leave a legible trace. The preserved work is never untouched by time; its survival is evidence of repeated attention.
            </p>
            <p className="mt-8">
              To build for permanence is now a quiet rebellion. It requires patience rather than novelty, exactness rather than volume. It asks us to make fewer promises and to keep those that are made.
            </p>
          </div>

          </div>
          <Marginalia archiveMode={archiveMode} desktop />
        </div>

        <ReaderActions
          archiveMode={archiveMode}
          archiveId={archiveId}
          articleTitle={articleTitle}
        />

        <Marginalia archiveMode={archiveMode} />

      </article>

      <section className={`px-5 py-16 sm:px-10 lg:px-12 lg:py-24 ${archiveMode ? "border-t border-black/20 bg-[#f5f5f5]" : "border-t border-white/20 bg-black"}`}>
        <div className="mx-auto max-w-[1800px]">
          <header className="mb-10 flex items-end justify-between">
            <h2 className="text-4xl leading-none font-bold tracking-[-0.055em] sm:text-6xl">
              From the Archive
            </h2>
            <Link href="/works" className={`hidden text-[10px] tracking-[0.22em] uppercase sm:block ${muted}`}>
              All Works →
            </Link>
          </header>
          <div className={`grid grid-cols-1 border ${archiveMode ? "border-black/35" : "border-white/35"} md:grid-cols-3`}>
            {relatedWorks.map((work) => (
              <Link
                key={work.archiveId}
                href={`/works/${work.slug}`}
                className={`group flex min-h-[340px] flex-col px-7 py-8 transition-colors duration-200 ${
                  archiveMode
                    ? "border-b border-black/35 bg-[#f5f5f5] text-black hover:bg-black hover:text-[#f5f5f5] md:border-r md:border-b-0 md:last:border-r-0"
                    : "border-b border-white/35 bg-black text-[#f5f5f5] hover:bg-[#f5f5f5] hover:text-black md:border-r md:border-b-0 md:last:border-r-0"
                }`}
              >
                <p className={`text-[9px] tracking-[0.22em] uppercase ${archiveMode ? "text-black/55" : "text-white/55"} group-hover:!text-current`}>
                  {work.category} — {work.archiveId}
                </p>
                <h3 className="mt-8 text-3xl leading-[1.05] font-bold tracking-[-0.04em] sm:text-4xl">
                  {work.title}
                </h3>
                <p className={`mt-auto pt-10 font-serif text-[17px] leading-[1.55] ${archiveMode ? "text-black/70" : "text-white/70"} group-hover:!text-current`}>
                  {work.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className={`px-5 ${archiveMode ? "bg-[#f5f5f5]" : "bg-black"}`}>
        <footer className={`mx-auto mt-24 max-w-[700px] border-t ${border} py-16 text-center sm:mt-32 sm:py-20`}>
          <span className="text-xl" aria-hidden="true">◈</span>
          <p className={`mt-7 text-[9px] tracking-[0.24em] uppercase ${muted}`}>
            End of Entry
          </p>
          <p className="mt-5 text-sm">Archive ID: SAD-ESS-002</p>
          <p className={`mt-2 text-xs ${muted}`}>Published by SADWRITA</p>
          <RavenLogo
            className={`mx-auto mt-8 h-12 w-12 object-contain ${archiveMode ? "invert" : ""}`}
          />
        </footer>
      </div>
    </main>
  );
}

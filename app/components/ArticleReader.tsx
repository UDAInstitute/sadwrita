"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RavenLogo from "./Ravenlogo";
import Marginalia from "./Marginalia";
import ReaderActions from "./ReaderActions";
import ThemeToggle from "./ThemeToggle";
import PersistentHeader from "./PersistentHeader";
import ReactMarkdown, { type Components } from "react-markdown";
import type { Work, WorkSummary } from "../../lib/work-types";
import {
  getReadingHistory,
  saveReadingActivity,
  type ReadingActivityRecord,
} from "../../lib/reader-space-data";

const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="mt-8 first-of-type:mt-0">{children}</p>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-12 border-l border-archive-border pl-6 text-2xl leading-[1.45] italic text-archive-muted sm:pl-8 sm:text-3xl">
      {children}
    </blockquote>
  ),
  h2: ({ children }) => (
    <h2 className="mt-12 mb-5 text-3xl leading-tight font-bold tracking-[-0.035em] sm:text-4xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-10 mb-4 text-2xl leading-tight font-bold tracking-[-0.03em]">
      {children}
    </h3>
  ),
  ul: ({ children }) => (
    <ul className="my-8 ml-6 list-disc space-y-3">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-8 ml-6 list-decimal space-y-3">{children}</ol>
  ),
  a: ({ children, href }) => (
    <a className="underline underline-offset-4" href={href}>
      {children}
    </a>
  ),
};

function categoryName(category: WorkSummary["category"]) {
  return category[0] + category.slice(1).toLowerCase();
}

export default function ArticleReader({
  work,
  relatedWorks,
}: {
  work: Work;
  relatedWorks: WorkSummary[];
}) {
  const articleTitle = work.title;
  const archiveId = work.archiveId;
  const [progress, setProgress] = useState(0);
  const storageKey = `sadwrita-reading-position-${work.slug}`;
  const totalPages = Math.max(
    1,
    Math.ceil(work.content.trim().split(/\s+/).length / 250),
  );

  useEffect(() => {
    const openedAt = new Date().toISOString();
    const createInitialActivity = (): ReadingActivityRecord => ({
      slug: work.slug,
      archiveId,
      title: articleTitle,
      category: work.category,
      progress: 0,
      maxProgress: 0,
      pagesRead: 0,
      totalPages,
      secondsRead: 0,
      lastOpenedAt: openedAt,
      resumePosition: 0,
    });

    let activity = createInitialActivity();
    let storageErrorLogged = false;

    const reportStorageError = (error: unknown) => {
      if (storageErrorLogged) return;
      storageErrorLogged = true;
      console.error("Unable to update Reader's Space reading history.", error);
    };

    const readActivity = () => {
      try {
        return getReadingHistory().find((record) => record.slug === work.slug);
      } catch (error) {
        reportStorageError(error);
        return undefined;
      }
    };

    const updateActivity = (
      update: Partial<ReadingActivityRecord>,
    ) => {
      try {
        activity = saveReadingActivity({ ...activity, ...update });
      } catch (error) {
        reportStorageError(error);
      }
    };

    const previousActivity = readActivity();
    if (previousActivity) {
      activity = {
        ...previousActivity,
        archiveId,
        title: articleTitle,
        category: work.category,
        totalPages,
        lastOpenedAt: openedAt,
      };
    }
    updateActivity(activity);

    const readPositionKey = "sadwrita-reading-position";
    let savedPosition = 0;
    try {
      const position =
        window.localStorage.getItem(storageKey) ??
        (work.slug === "on-permanence-in-a-disposable-age"
          ? window.localStorage.getItem(readPositionKey)
          : null);
      savedPosition = Number(position);
    } catch (error) {
      reportStorageError(error);
    }
    if (Number.isFinite(savedPosition) && savedPosition > 0) {
      window.requestAnimationFrame(() => window.scrollTo(0, savedPosition));
    }

    let lastSavedProgress = -1;
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollable > 0
        ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100))
        : 100;
      const position = window.scrollY;
      setProgress(nextProgress);
      try {
        window.localStorage.setItem(storageKey, String(position));
      } catch (error) {
        reportStorageError(error);
      }

      const savedProgress = Math.floor(nextProgress);
      if (savedProgress !== lastSavedProgress) {
        lastSavedProgress = savedProgress;
        const maxProgress = Math.max(activity.maxProgress, nextProgress);
        updateActivity({
          progress: nextProgress,
          maxProgress,
          pagesRead: Math.max(
            activity.pagesRead,
            Math.floor((totalPages * maxProgress) / 100),
          ),
          totalPages,
          resumePosition: position,
          completedAt:
            activity.completedAt ??
            (maxProgress >= 100 ? new Date().toISOString() : undefined),
        });
      }
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    let lastReadAt = Date.now();
    let wasVisible = document.visibilityState === "visible";
    const recordReadingTime = () => {
      const now = Date.now();
      const secondsRead = wasVisible
        ? Math.floor((now - lastReadAt) / 1000)
        : 0;
      lastReadAt = now;
      wasVisible = document.visibilityState === "visible";
      if (secondsRead < 1) return;

      const current = readActivity() ?? activity;
      updateActivity({
        secondsRead: current.secondsRead + secondsRead,
      });
    };
    const readingTimer = window.setInterval(recordReadingTime, 15000);
    document.addEventListener("visibilitychange", recordReadingTime);
    window.addEventListener("pagehide", recordReadingTime);

    return () => {
      window.clearInterval(readingTimer);
      window.removeEventListener("scroll", updateProgress);
      document.removeEventListener("visibilitychange", recordReadingTime);
      window.removeEventListener("pagehide", recordReadingTime);
      recordReadingTime();
    };
  }, [archiveId, articleTitle, storageKey, totalPages, work.category, work.slug]);

  const muted = "text-archive-muted";
  const border = "border-archive-border";
  const actionClass = "text-[9px] tracking-[0.16em] text-foreground uppercase transition-opacity duration-200 hover:opacity-55";

  return (
    <main className="relative min-h-svh bg-background text-foreground transition-colors duration-300">
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 z-50 h-px bg-foreground"
        style={{ width: `${progress}%` }}
      />

      <PersistentHeader className={`border-b ${border} px-5 sm:px-10 lg:px-12`}>
        <nav className="mx-auto flex h-20 max-w-[1800px] items-center justify-between">
          <Link
            href="/works"
            className="inline-flex min-h-11 items-center py-2 text-[10px] font-medium tracking-[0.22em] uppercase transition-opacity duration-200 hover:opacity-55"
          >
            ← Works
          </Link>
          <ThemeToggle />
        </nav>
      </PersistentHeader>

      <article className="px-5 sm:px-10">
        <header className="mx-auto max-w-[700px] pt-20 text-center sm:pt-28 lg:pt-36">
          <RavenLogo className="mx-auto h-14 w-14 object-contain sm:h-16 sm:w-16" />
          <p className={`mt-10 text-[9px] font-medium tracking-[0.24em] uppercase sm:text-[10px] ${muted}`}>
            {work.categoryLabel} — {work.archiveId}
          </p>
          <h1 className="mt-8 text-5xl leading-[0.98] font-bold tracking-[-0.055em] sm:text-7xl lg:text-[5.5rem]">
            {work.title}
          </h1>
          {work.subtitle && (
            <p className={`mx-auto mt-7 max-w-lg font-serif text-xl leading-relaxed italic sm:text-2xl ${muted}`}>
              {work.subtitle}
            </p>
          )}
          <div className={`mt-10 flex justify-center gap-5 border-y ${border} py-4 text-[9px] tracking-[0.18em] uppercase sm:text-[10px] ${muted}`}>
            <time>{work.date}</time>
            <span aria-hidden="true">/</span>
            <span>{work.readingTime}</span>
          </div>
        </header>

        <div className="ml-0 mr-auto mt-16 max-w-[1200px] items-start sm:mt-20 lg:mt-24 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(220px,260px)] lg:gap-8 xl:gap-[43px]">
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

            <div id="article-prose" className="mx-auto max-w-[700px] font-serif text-[20px] leading-[1.82] sm:text-[22px] sm:leading-[1.78] lg:ml-auto lg:mr-0 lg:max-w-[620px]">
              <ReactMarkdown components={markdownComponents}>
                {work.content}
              </ReactMarkdown>
            </div>

            <ReaderActions
              archiveId={archiveId}
              legacyArchiveId={work.legacyArchiveId}
              articleTitle={articleTitle}
            />

            <Marginalia />
          </div>
          <Marginalia desktop />
        </div>
      </article>

      <section className={`px-5 py-16 border-t ${border} bg-background text-foreground transition-colors duration-300 sm:px-10 lg:px-12 lg:py-24`}>
        <div className="mx-auto max-w-[1800px]">
          <header className="mb-10 flex items-end justify-between">
            <h2 className="text-4xl leading-none font-bold tracking-[-0.055em] sm:text-6xl">
              From the Archive
            </h2>
            <Link href="/works" className={`hidden min-h-11 items-center px-2 text-[10px] tracking-[0.22em] uppercase sm:inline-flex ${muted}`}>
              All Works →
            </Link>
          </header>
          <div className="grid grid-cols-1 border border-archive-border-strong md:grid-cols-2 lg:grid-cols-3">
            {relatedWorks.map((work) => (
              <Link
                key={work.archiveId}
                href={`/works/${work.slug}`}
                className="archive-panel group flex min-h-[340px] min-w-0 flex-col border-b border-archive-border-strong px-7 py-8 md:[&:nth-child(odd)]:border-r md:[&:nth-child(even)]:border-r-0 lg:[&:nth-child(odd)]:border-r-0 lg:[&:nth-child(3n+1)]:border-r lg:[&:nth-child(3n+2)]:border-r lg:[&:nth-child(3n)]:border-r-0"
              >
                <p className="archive-panel-muted text-[9px] tracking-[0.22em] text-archive-muted uppercase">
                  {categoryName(work.category)} — {work.archiveId}
                </p>
                <h3 className="mt-8 text-3xl leading-[1.05] font-bold tracking-[-0.04em] sm:text-4xl">
                  {work.title}
                </h3>
                <p className="archive-panel-muted mt-auto pt-10 font-serif text-[17px] leading-[1.55] text-archive-muted-strong">
                  {work.relatedExcerpt ?? work.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-background px-5 text-foreground transition-colors duration-300 sm:px-10">
        <div className="ml-0 mr-auto max-w-[1200px] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(220px,260px)] lg:gap-8 xl:gap-[43px]">
          <footer className={`mx-auto mt-20 w-full max-w-[700px] border-t ${border} py-12 text-left sm:mt-24 sm:py-16 lg:ml-auto lg:mr-0 lg:max-w-[620px]`}>
            <span className="text-xl" aria-hidden="true">◈</span>
            <p className={`mt-7 text-[9px] tracking-[0.24em] uppercase ${muted}`}>
              End of Entry
            </p>
            <p className="mt-5 text-sm">Archive ID: {work.archiveId}</p>
            <p className={`mt-2 text-xs ${muted}`}>Published by SADWRITA</p>
            <RavenLogo className="mt-8 h-12 w-12 object-contain" />
          </footer>
        </div>
      </div>
    </main>
  );
}

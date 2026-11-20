"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Navbar";
import ThemeToggle from "../ThemeToggle";
import { getReaderCard, type ReaderCard } from "../../../lib/reader-card";
import {
  getBookOfMarks,
  getFollowedItems,
  getReaderShelf,
  getReadingHistory,
  readerNoteDateKey,
  saveBookOfMarks,
  type FollowedItem,
  type ReadingActivityRecord,
  type SavedMark,
} from "../../../lib/reader-space-data";
import type { WorkSummary } from "../../../lib/work-types";

type ShelfGroup = "Essays" | "Fragments" | "Poetry" | "Manifesto" | "Books";

type ShelfEntry = {
  id: string;
  title: string;
  archiveId: string;
  href: string;
};

type ReaderNote = {
  archiveId: string;
  storageIds: string[];
  title: string;
  text: string;
  dateSaved: string | null;
};

const shelfGroups: ShelfGroup[] = [
  "Essays",
  "Fragments",
  "Poetry",
  "Manifesto",
  "Books",
];

function formatDate(
  value: string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  },
) {
  if (!value) return "Date not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not recorded";
  return new Intl.DateTimeFormat("en", {
    ...options,
    timeZone: "UTC",
  }).format(date);
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
  return minutes > 0 ? `${minutes}m` : seconds > 0 ? `${seconds}s` : "0m";
}

function groupForCategory(category: WorkSummary["category"]): ShelfGroup {
  if (category === "FRAGMENTS") return "Fragments";
  if (category === "POETRY") return "Poetry";
  return "Essays";
}

function groupForArchiveId(archiveId: string): ShelfGroup {
  const id = archiveId.toUpperCase();
  if (id.includes("FRA")) return "Fragments";
  if (id.includes("POE")) return "Poetry";
  if (id.includes("MAN")) return "Manifesto";
  if (id.includes("BOO")) return "Books";
  return "Essays";
}

function readNotes(works: WorkSummary[]): ReaderNote[] {
  const notes: ReaderNote[] = [];

  for (const work of works) {
    const storageIds = [
      ...new Set(
        [work.archiveId, work.legacyArchiveId].filter(
          (id): id is string => Boolean(id),
        ),
      ),
    ];

    for (const storageId of storageIds) {
      const text = window.localStorage.getItem(`sadwrita-note-${storageId}`);
      if (!text?.trim()) continue;

      const dateSaved =
        window.localStorage.getItem(readerNoteDateKey(storageId)) ??
        storageIds
          .map((id) => window.localStorage.getItem(readerNoteDateKey(id)))
          .find((date): date is string => Boolean(date)) ??
        null;

      notes.push({
        archiveId: work.archiveId,
        storageIds,
        title: work.title,
        text,
        dateSaved,
      });
      break;
    }
  }

  return notes.sort(
    (first, second) =>
      new Date(second.dateSaved ?? 0).getTime() -
      new Date(first.dateSaved ?? 0).getTime(),
  );
}

function SectionHeading({
  title,
  count,
}: {
  title: string;
  count?: number;
}) {
  return (
    <header className="mb-7 flex items-end justify-between gap-5 border-b border-archive-border pb-5">
      <h2 className="text-3xl leading-tight font-semibold tracking-[-0.045em] sm:text-4xl">
        {title}
      </h2>
      {count !== undefined && (
        <span className="pb-1 font-mono text-[10px] tracking-[0.16em] text-archive-muted">
          {String(count).padStart(2, "0")}
        </span>
      )}
    </header>
  );
}

function ReadingRecordRow({
  record,
  showProgress = true,
}: {
  record: ReadingActivityRecord;
  showProgress?: boolean;
}) {
  return (
    <article className="grid gap-5 border-b border-archive-border py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="min-w-0">
        <p className="text-[9px] tracking-[0.18em] text-archive-muted uppercase">
          {record.category} <span aria-hidden="true">/</span>{" "}
          {record.archiveId}
        </p>
        <Link
          href={`/works/${record.slug}`}
          className="mt-3 inline-block max-w-full text-2xl leading-tight font-medium tracking-[-0.035em] hover:opacity-60 sm:text-3xl"
        >
          {record.title}
        </Link>
        <p className="mt-3 text-[10px] tracking-[0.12em] text-archive-muted uppercase">
          Last opened {formatDate(record.lastOpenedAt)}
        </p>
      </div>
      <div className="flex items-center justify-between gap-8 sm:justify-end">
        {showProgress && (
          <p className="font-mono text-sm tabular-nums">
            {Math.round(record.progress)}%
          </p>
        )}
        <Link
          href={`/works/${record.slug}`}
          className="inline-flex min-h-11 items-center border-b border-archive-border px-2 text-[9px] font-medium tracking-[0.18em] uppercase transition-opacity hover:opacity-55 sm:text-[10px]"
        >
          {showProgress ? "Resume Reading" : "Revisit"}
        </Link>
      </div>
    </article>
  );
}

export default function ReaderSpaceOverview({
  works,
}: {
  works: WorkSummary[];
}) {
  const router = useRouter();
  const [card, setCard] = useState<ReaderCard | null>(null);
  const [shelfIds, setShelfIds] = useState<string[]>([]);
  const [marks, setMarks] = useState<SavedMark[]>([]);
  const [history, setHistory] = useState<ReadingActivityRecord[]>([]);
  const [followedItems, setFollowedItems] = useState<FollowedItem[]>([]);
  const [notes, setNotes] = useState<ReaderNote[]>([]);
  const [lastVisit, setLastVisit] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      let savedCard: ReaderCard | null;
      try {
        savedCard = getReaderCard();
      } catch (error) {
        console.error("Unable to read the Reader's Card from this browser.", error);
        setPageError(
          "Your Reader's Card could not be read in this browser. Return to the entry page and try again.",
        );
        setIsLoading(false);
        return;
      }

      if (!savedCard) {
        router.replace("/readers-space/request-card");
        return;
      }
      setCard(savedCard);

      try {
        setShelfIds(getReaderShelf());
        setMarks(getBookOfMarks());
        setHistory(getReadingHistory());
        setFollowedItems(getFollowedItems());
        setNotes(readNotes(works));

        const now = new Date().toISOString();
        const previousVisit = window.localStorage.getItem("readerLastVisit");
        window.localStorage.setItem("readerLastVisit", now);
        setLastVisit(previousVisit ?? now);
      } catch (error) {
        console.error("Unable to read Reader's Space archive data.", error);
        setDataError(
          "Some saved archive records could not be read. Your original Reader's Card remains unchanged.",
        );
      } finally {
        setIsLoading(false);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [router, works]);

  const shelfEntries: ShelfEntry[] = shelfIds.map((id) => {
    const work = works.find(
      (item) => item.archiveId === id || item.legacyArchiveId === id,
    );
    return work
      ? {
          id,
          title: work.title,
          archiveId: work.archiveId,
          href: `/works/${work.slug}`,
        }
      : {
          id,
          title: `Archive entry ${id}`,
          archiveId: id,
          href: "/works",
        };
  });

  const activeReadings = history
    .filter((record) => record.progress < 100)
    .sort(
      (first, second) =>
        new Date(second.lastOpenedAt).getTime() -
        new Date(first.lastOpenedAt).getTime(),
    );
  const sortedHistory = [...history].sort(
    (first, second) =>
      new Date(second.lastOpenedAt).getTime() -
      new Date(first.lastOpenedAt).getTime(),
  );
  const completedWorks = sortedHistory.filter(
    (record) => record.completedAt || record.progress >= 100,
  );
  const pagesRead = history.reduce((total, record) => total + record.pagesRead, 0);
  const secondsRead = history.reduce(
    (total, record) => total + record.secondsRead,
    0,
  );
  const fragmentIds = new Set(
    works
      .filter((work) => work.category === "FRAGMENTS")
      .flatMap((work) =>
        [work.archiveId, work.legacyArchiveId].filter(
          (id): id is string => Boolean(id),
        ),
      ),
  );
  const hasSavedFragment = shelfIds.some((id) => fragmentIds.has(id));
  const milestones = [
    {
      title: "First Entry Read",
      achieved: history.some(
        (record) =>
          record.maxProgress > 0 || record.pagesRead > 0 || Boolean(record.completedAt),
      ),
    },
    { title: "Keeper of Fragments", achieved: hasSavedFragment },
    { title: "Witness of One Hundred Pages", achieved: pagesRead >= 100 },
    {
      title: "Completed First Book",
      achieved: followedItems.some(
        (item) => item.type === "book" && item.completed,
      ),
    },
    { title: "Member of the Archive", achieved: Boolean(card) },
  ];

  const entriesByGroup = Object.fromEntries(
    shelfGroups.map((group) => [
      group,
      shelfEntries.filter((entry) => {
        const work = works.find(
          (item) =>
            item.archiveId === entry.id || item.legacyArchiveId === entry.id,
        );
        return work
          ? groupForCategory(work.category) === group
          : groupForArchiveId(entry.archiveId) === group;
      }),
    ]),
  ) as Record<ShelfGroup, ShelfEntry[]>;

  const saveEditedNote = (note: ReaderNote) => {
    try {
      const canonicalKey = `sadwrita-note-${note.archiveId}`;
      localStorage.setItem(canonicalKey, noteDraft.trim());
      localStorage.setItem(readerNoteDateKey(note.archiveId), new Date().toISOString());
      for (const id of note.storageIds) {
        if (id === note.archiveId) continue;
        localStorage.removeItem(`sadwrita-note-${id}`);
        localStorage.removeItem(readerNoteDateKey(id));
      }
      setNotes(readNotes(works));
      setEditingNoteId(null);
      setNoteDraft("");
    } catch (error) {
      console.error("Unable to save this Reader's Space note.", error);
      setDataError("This note could not be saved. Please try again.");
    }
  };

  const deleteNote = (note: ReaderNote) => {
    try {
      for (const id of note.storageIds) {
        localStorage.removeItem(`sadwrita-note-${id}`);
        localStorage.removeItem(readerNoteDateKey(id));
      }
      setNotes((current) =>
        current.filter((entry) => entry.archiveId !== note.archiveId),
      );
      setEditingNoteId(null);
      setNoteDraft("");
    } catch (error) {
      console.error("Unable to delete this Reader's Space note.", error);
      setDataError("This note could not be deleted. Please try again.");
    }
  };

  const deleteMark = (markIndex: number) => {
    try {
      const nextMarks = marks.filter((_, index) => index !== markIndex);
      saveBookOfMarks(nextMarks);
      setMarks(nextMarks);
    } catch (error) {
      console.error("Unable to delete this passage from the Book of Marks.", error);
      setDataError("This passage could not be deleted. Please try again.");
    }
  };

  const memberSince = card
    ? formatDate(card.readerSince, { month: "long", year: "numeric" })
    : "—";
  const stats = [
    { label: "Member Since", value: memberSince },
    {
      label: "Entries Read",
      value: String(
        history.filter(
          (record) =>
            record.maxProgress > 0 ||
            record.pagesRead > 0 ||
            Boolean(record.completedAt),
        ).length,
      ),
    },
    {
      label: "Books Followed",
      value: String(followedItems.filter((item) => item.type === "book").length),
    },
    { label: "Pages Read", value: String(pagesRead) },
    { label: "Hours Reading", value: formatDuration(secondsRead) },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-svh bg-background pt-20 text-foreground transition-colors duration-300">
        {isLoading ? (
          <p
            aria-live="polite"
            className="px-5 py-20 text-center font-mono text-[11px] text-archive-muted sm:px-10"
          >
            Opening your Reader&apos;s Space…
          </p>
        ) : pageError ? (
          <p
            role="alert"
            className="mx-auto max-w-xl px-5 py-20 text-center font-mono text-[11px] leading-relaxed text-archive-muted sm:px-10"
          >
            {pageError}
          </p>
        ) : card ? (
          <>
            <header className="px-5 pt-12 pb-12 sm:px-10 sm:pt-16 lg:px-12 lg:pt-20">
              <div className="mx-auto max-w-[1800px]">
                <p className="text-[9px] font-medium tracking-[0.26em] text-archive-muted uppercase sm:text-[10px]">
                  SADWRITA / READER&apos;S SPACE — PRIVATE
                </p>
                <h1 className="mt-7 text-5xl leading-[0.94] font-bold tracking-[-0.06em] sm:text-7xl lg:text-[5.5rem]">
                  Reader&apos;s Space
                </h1>
                <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4 border-y border-archive-border py-5 text-xs sm:text-sm">
                  <span className="font-serif">{card.readerEmail}</span>
                  <span className="text-archive-muted">
                    Reader ID <span className="font-mono">{card.readerId}</span>
                  </span>
                  <span className="text-archive-muted">
                    Last visit — {formatDate(lastVisit, { month: "long", year: "numeric" })}
                  </span>
                  <Link
                    href="/readers-space/card"
                    className="inline-flex min-h-11 items-center border-b border-archive-border px-1 text-[9px] font-medium tracking-[0.18em] uppercase transition-opacity hover:opacity-55 sm:ml-auto sm:text-[10px]"
                  >
                    View Reader&apos;s Card
                  </Link>
                </div>
              </div>
            </header>

            <nav
              aria-label="Reader's Space sections"
              className="sticky top-20 z-40 overflow-x-auto border-y border-archive-border bg-background/90 backdrop-blur-md"
            >
              <div className="mx-auto flex min-w-max max-w-[1800px] gap-7 px-5 py-4 sm:gap-9 sm:px-10 lg:px-12">
                {[
                  ["Overview", "#overview"],
                  ["Active Readings", "#active-readings"],
                  ["Reader's Shelf", "#reader-shelf"],
                  ["Book of Marks", "#book-of-marks"],
                  ["Notes", "#notes"],
                  ["Reading History", "#reading-history"],
                  ["Following", "#following"],
                  ["Milestones", "#milestones"],
                  ["Preferences", "#preferences"],
                ].map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    className="shrink-0 text-[9px] font-medium tracking-[0.16em] uppercase transition-opacity hover:opacity-55 sm:text-[10px]"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </nav>

            <div className="mx-auto max-w-[1800px] px-5 sm:px-10 lg:px-12">
              {dataError && (
                <p
                  role="alert"
                  className="mt-8 border-l border-archive-border-strong pl-4 font-mono text-[10px] leading-relaxed text-archive-muted"
                >
                  {dataError}
                </p>
              )}

              <section
                id="overview"
                className="scroll-mt-36 pt-14 pb-16 sm:pt-20 sm:pb-20"
              >
                <div className="mx-auto max-w-3xl text-center">
                  <p className="text-[9px] font-medium tracking-[0.22em] text-archive-muted uppercase">
                    A PRIVATE ARCHIVE WITHIN THE ARCHIVE
                  </p>
                  <h2 className="mt-5 font-serif text-3xl leading-tight italic sm:text-4xl">
                    Welcome{card.readerName ? `, ${card.readerName}` : " back"}.
                  </h2>
                  <p className="mt-4 font-serif text-lg leading-relaxed text-archive-muted-strong">
                    Your readings, passages, and notes are kept here.
                  </p>
                </div>

                <div className="mt-12 grid grid-cols-2 border border-archive-border bg-foreground/10 md:grid-cols-5">
                  {stats.map((stat, index) => (
                    <div
                      key={stat.label}
                      className={`min-w-0 border-b border-archive-border px-5 py-7 sm:px-7 sm:py-9 ${
                        index === stats.length - 1
                          ? "col-span-2 border-b-0 md:col-span-1"
                          : ""
                      } md:border-r md:border-b-0 md:last:border-r-0`}
                    >
                      <p className="text-[9px] tracking-[0.14em] text-archive-muted uppercase">
                        {stat.label}
                      </p>
                      <p className="mt-5 break-words font-serif text-3xl leading-tight tabular-nums sm:text-4xl">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section
                id="active-readings"
                className="scroll-mt-36 border-t border-archive-border py-14 sm:py-20"
              >
                <SectionHeading title="Active Readings" count={activeReadings.length} />
                {activeReadings.length ? (
                  <div>
                    {activeReadings.map((record) => (
                      <ReadingRecordRow key={record.slug} record={record} />
                    ))}
                  </div>
                ) : (
                  <p className="max-w-2xl py-4 font-serif text-xl leading-relaxed text-archive-muted-strong">
                    No works are currently in progress. Begin with a writing from{" "}
                    <Link href="/works" className="underline underline-offset-4">
                      the archive
                    </Link>
                    .
                  </p>
                )}
              </section>

              <section
                id="reader-shelf"
                className="scroll-mt-36 border-t border-archive-border py-14 sm:py-20"
              >
                <SectionHeading title="Reader's Shelf" count={shelfEntries.length} />
                <div className="grid gap-x-10 md:grid-cols-2 xl:grid-cols-5">
                  {shelfGroups.map((group) => {
                    const entries = entriesByGroup[group];
                    return (
                      <div key={group} className="border-b border-archive-border py-7 xl:border-b-0">
                        <h3 className="text-[10px] font-medium tracking-[0.18em] uppercase">
                          {group}
                        </h3>
                        {entries.length ? (
                          <ul className="mt-5">
                            {entries.map((entry) => (
                              <li
                                key={`${entry.id}-${group}`}
                                className="border-t border-archive-border py-4"
                              >
                                <Link
                                  href={entry.href}
                                  className="inline-flex min-h-11 items-center text-lg leading-snug font-serif hover:opacity-60"
                                >
                                  {entry.title}
                                </Link>
                                <p className="mt-2 font-mono text-[9px] tracking-[0.12em] text-archive-muted">
                                  {entry.archiveId}
                                </p>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-5 border-t border-archive-border pt-4 font-serif text-base italic text-archive-muted">
                            Nothing kept here yet.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              <section
                id="book-of-marks"
                className="scroll-mt-36 border-t border-archive-border py-14 sm:py-20"
              >
                <SectionHeading title="Book of Marks" count={marks.length} />
                {marks.length ? (
                  <div>
                    {marks.map((mark, index) => {
                      const sourceWork = works.find(
                        (work) =>
                          work.archiveId === mark.archiveId ||
                          work.legacyArchiveId === mark.archiveId,
                      );
                      const revisitHref =
                        mark.sourceHref?.startsWith("/works/") && !mark.sourceHref.startsWith("//")
                          ? mark.sourceHref
                          : sourceWork
                            ? `/works/${sourceWork.slug}`
                            : "/works";
                      return (
                        <blockquote
                          key={mark.id ?? `${mark.archiveId}-${mark.dateMarked}-${index}`}
                          className="border-b border-archive-border py-7 sm:py-9"
                        >
                          <p className="max-w-4xl font-serif text-xl leading-[1.65] italic sm:text-2xl">
                            “{mark.text}”
                          </p>
                          <footer className="mt-6 flex flex-wrap items-center justify-between gap-4 text-[9px] tracking-[0.14em] text-archive-muted uppercase">
                            <span>
                              {mark.articleTitle} <span aria-hidden="true">/</span>{" "}
                              {mark.dateMarked}
                            </span>
                            <span className="flex flex-wrap gap-3">
                              <Link
                                href={revisitHref}
                                className="inline-flex min-h-11 items-center px-2 transition-opacity hover:opacity-55"
                              >
                                Revisit
                              </Link>
                              <button
                                type="button"
                                onClick={() => deleteMark(index)}
                                className="inline-flex min-h-11 items-center px-2 transition-opacity hover:opacity-55"
                              >
                                Delete
                              </button>
                            </span>
                          </footer>
                        </blockquote>
                      );
                    })}
                  </div>
                ) : (
                  <p className="font-serif text-xl text-archive-muted-strong">
                    Passages you mark while reading will be kept here.
                  </p>
                )}
              </section>

              <section
                id="notes"
                className="scroll-mt-36 border-t border-archive-border py-14 sm:py-20"
              >
                <SectionHeading title="Personal Notes" count={notes.length} />
                {notes.length ? (
                  <div>
                    {notes.map((note) => (
                      <article
                        key={note.archiveId}
                        className="border-b border-archive-border py-7 sm:py-9"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <Link
                              href={`/works/${works.find((work) => work.archiveId === note.archiveId)?.slug ?? ""}`}
                              className="inline-flex min-h-11 items-center font-serif text-xl leading-tight hover:opacity-60 sm:text-2xl"
                            >
                              {note.title}
                            </Link>
                            <p className="mt-3 text-[9px] tracking-[0.14em] text-archive-muted uppercase">
                              {note.dateSaved
                                ? `Date saved — ${formatDate(note.dateSaved)}`
                                : "Date not recorded"}
                            </p>
                          </div>
                          {editingNoteId !== note.archiveId && (
                            <div className="flex flex-wrap gap-x-3 text-[9px] tracking-[0.14em] uppercase">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingNoteId(note.archiveId);
                                  setNoteDraft(note.text);
                                }}
                                className="inline-flex min-h-11 items-center px-2 transition-opacity hover:opacity-55"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteNote(note)}
                                className="inline-flex min-h-11 items-center px-2 text-archive-muted transition-opacity hover:opacity-55"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                        {editingNoteId === note.archiveId ? (
                          <div className="mt-5">
                            <textarea
                              aria-label={`Edit note on ${note.title}`}
                              value={noteDraft}
                              onChange={(event) => setNoteDraft(event.target.value)}
                              className="min-h-32 w-full resize-y border border-archive-border bg-transparent p-4 font-serif text-lg leading-relaxed outline-none"
                            />
                            <div className="mt-4 flex flex-wrap gap-3 text-[9px] tracking-[0.14em] uppercase">
                              <button
                                type="button"
                                onClick={() => saveEditedNote(note)}
                                className="inline-flex min-h-11 items-center border-b border-archive-border px-2"
                              >
                                Save Note
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingNoteId(null);
                                  setNoteDraft("");
                                }}
                                className="inline-flex min-h-11 items-center px-2 text-archive-muted"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-5 max-w-4xl whitespace-pre-wrap font-serif text-lg leading-[1.7] text-archive-muted-strong">
                            {note.text}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="font-serif text-xl text-archive-muted-strong">
                    Personal notes kept alongside your readings will appear here.
                  </p>
                )}
              </section>

              <section
                id="reading-history"
                className="scroll-mt-36 border-t border-archive-border py-14 sm:py-20"
              >
                <SectionHeading title="Reading History" count={history.length} />
                <div className="grid gap-12 lg:grid-cols-3 lg:gap-10">
                  {[
                    ["Continue Reading", activeReadings],
                    ["Recently Read", sortedHistory],
                    ["Completed Works", completedWorks],
                  ].map(([title, records]) => (
                    <div key={title as string} className="min-w-0">
                      <h3 className="mb-4 text-[10px] font-medium tracking-[0.16em] uppercase">
                        {title as string}
                      </h3>
                      {(records as ReadingActivityRecord[]).length ? (
                        <ul className="border-t border-archive-border">
                          {(records as ReadingActivityRecord[]).map((record) => (
                            <li
                              key={`${title as string}-${record.slug}`}
                              className="border-b border-archive-border py-5"
                            >
                              <Link
                                href={`/works/${record.slug}`}
                                className="font-serif text-lg leading-snug hover:opacity-60"
                              >
                                {record.title}
                              </Link>
                              <p className="mt-2 text-[9px] tracking-[0.1em] text-archive-muted uppercase">
                                {title === "Completed Works"
                                  ? `Completed ${formatDate(record.completedAt ?? record.lastOpenedAt)}`
                                  : `${Math.round(record.progress)}% — ${formatDate(record.lastOpenedAt)}`}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="border-t border-archive-border pt-5 font-serif text-base italic text-archive-muted">
                          No entries yet.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section
                id="following"
                className="scroll-mt-36 border-t border-archive-border py-14 sm:py-20"
              >
                <SectionHeading title="Following" />
                <div className="grid gap-x-10 md:grid-cols-3">
                  {(["book", "topic", "series"] as const).map((type) => {
                    const items = followedItems.filter((item) => item.type === type);
                    const label = `${type[0].toUpperCase()}${type.slice(1)}${type === "series" ? "" : "s"}`;
                    const pluralType = type === "series" ? "series" : `${type}s`;
                    return (
                      <div key={type} className="border-b border-archive-border py-6 md:border-b-0">
                        <h3 className="text-[10px] font-medium tracking-[0.16em] uppercase">
                          {label}
                        </h3>
                        {items.length ? (
                          <ul className="mt-5 border-t border-archive-border">
                            {items.map((item) => {
                              const href =
                                item.href?.startsWith("/") &&
                                !item.href.startsWith("//")
                                  ? item.href
                                  : undefined;
                              return (
                                <li
                                  key={item.id}
                                  className="border-b border-archive-border py-4 font-serif text-lg"
                                >
                                  {href ? (
                                    <Link
                                      href={href}
                                      className="inline-flex min-h-11 items-center hover:opacity-60"
                                    >
                                      {item.title}
                                    </Link>
                                  ) : (
                                    item.title
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className="mt-5 border-t border-archive-border pt-4 font-serif text-base italic text-archive-muted">
                            No {pluralType} followed yet.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              <section
                id="milestones"
                className="scroll-mt-36 border-t border-archive-border py-14 sm:py-20"
              >
                <SectionHeading title="Milestones" count={milestones.filter((item) => item.achieved).length} />
                <ul className="border-t border-archive-border">
                  {milestones.map((milestone) => (
                    <li
                      key={milestone.title}
                      className="flex items-center justify-between gap-6 border-b border-archive-border py-5"
                    >
                      <span className="font-serif text-lg sm:text-xl">
                        {milestone.title}
                      </span>
                      <span
                        className={`shrink-0 text-[9px] font-medium tracking-[0.16em] uppercase ${
                          milestone.achieved
                            ? "text-foreground"
                            : "text-archive-muted"
                        }`}
                      >
                        {milestone.achieved ? "Achieved" : "In Progress"}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section
                id="preferences"
                className="scroll-mt-36 border-t border-archive-border py-14 sm:py-20"
              >
                <SectionHeading title="Preferences" />
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-[10px] font-medium tracking-[0.16em] uppercase">
                      Archive State
                    </h3>
                    <p className="mt-3 max-w-xl font-serif text-lg leading-relaxed text-archive-muted-strong">
                      Choose the archive&apos;s Yin or Yang interpretation.
                    </p>
                  </div>
                  <ThemeToggle />
                </div>
              </section>
            </div>
          </>
        ) : null}
      </main>
    </>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readerNoteDateKey } from "../../lib/reader-space-data";

type Mark = {
  id: string;
  text: string;
  articleTitle: string;
  archiveId: string;
  dateMarked: string;
  sourceHref?: string;
};

function readArray<T>(key: string): T[] {
  const value = localStorage.getItem(key);
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

type ReaderActionsProps = {
  archiveId: string;
  legacyArchiveId?: string;
  articleTitle: string;
};

export default function ReaderActions({
  archiveId,
  legacyArchiveId,
  articleTitle,
}: ReaderActionsProps) {
  const shelfKey = "sadwrita-reader-shelf";
  const noteKey = `sadwrita-note-${archiveId}`;
  const legacyNoteKey = legacyArchiveId
    ? `sadwrita-note-${legacyArchiveId}`
    : undefined;
  const marksKey = "sadwrita-book-of-marks";
  const border = "border-archive-border";
  const muted = "text-archive-muted";

  const [saved, setSaved] = useState(false);
  const [note, setNote] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [selectionPosition, setSelectionPosition] = useState({ left: 0, top: 0 });
  const [noteOpen, setNoteOpen] = useState(false);
  const [marks, setMarks] = useState<Mark[]>([]);

  useEffect(() => {
    const restoreSavedState = () => {
      setSaved(
        readArray<string>(shelfKey).some(
          (id) => id === archiveId || id === legacyArchiveId,
        ),
      );
      setNote(
        localStorage.getItem(noteKey) ??
          (legacyNoteKey ? localStorage.getItem(legacyNoteKey) : null) ??
          "",
      );
      setMarks(
        readArray<Mark>(marksKey).filter(
          (mark) =>
            mark.archiveId === archiveId ||
            mark.archiveId === legacyArchiveId,
        ),
      );
    };

    const frame = window.requestAnimationFrame(restoreSavedState);
    const captureSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() ?? "";
      if (!text) {
        setSelectedText("");
        return;
      }

      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
      const common = range?.commonAncestorContainer;
      const element =
        common instanceof Element ? common : common?.parentElement;
      if (!element?.closest("#article-prose")) {
        setSelectedText("");
        return;
      }

      const rect = range?.getBoundingClientRect();
      setSelectedText(text);
      const requestedLeft = rect ? rect.left + rect.width / 2 : 0;
      const horizontalInset = 84;
      setSelectionPosition({
        left: Math.min(
          Math.max(horizontalInset, requestedLeft),
          window.innerWidth - horizontalInset,
        ),
        top: rect ? rect.top - 44 : 0,
      });
    };

    document.addEventListener("mouseup", captureSelection);
    document.addEventListener("selectionchange", captureSelection);
    document.addEventListener("touchend", captureSelection);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("mouseup", captureSelection);
      document.removeEventListener("selectionchange", captureSelection);
      document.removeEventListener("touchend", captureSelection);
    };
  }, [archiveId, legacyArchiveId, legacyNoteKey, marksKey, noteKey, shelfKey]);

  const toggleShelf = () => {
    const shelf = readArray<string>(shelfKey);
    const isThisWork = (id: string) =>
      id === archiveId || id === legacyArchiveId;
    const nextShelf = saved
      ? shelf.filter((id) => !isThisWork(id))
      : [...new Set([...shelf.filter((id) => !isThisWork(id)), archiveId])];

    localStorage.setItem(shelfKey, JSON.stringify(nextShelf));
    setSaved(!saved);
  };

  const saveNote = () => {
    localStorage.setItem(noteKey, note.trim());
    localStorage.setItem(readerNoteDateKey(archiveId), new Date().toISOString());
    if (legacyNoteKey) {
      localStorage.removeItem(legacyNoteKey);
      if (legacyArchiveId) {
        localStorage.removeItem(readerNoteDateKey(legacyArchiveId));
      }
    }
  };

  const markSelectedPassage = () => {
    if (!selectedText) return;

    const mark: Mark = {
      text: selectedText,
      id: crypto.randomUUID(),
      articleTitle,
      archiveId,
      sourceHref: window.location.pathname,
      dateMarked: new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date()),
    };

    const allMarks = readArray<Mark>(marksKey);
    const nextMarks = [mark, ...allMarks];
    localStorage.setItem(marksKey, JSON.stringify(nextMarks));
    setMarks((current) => [mark, ...current]);
    setSelectedText("");
    window.getSelection()?.removeAllRanges();
  };

  const deleteMark = (index: number) => {
    const allMarks = readArray<Mark>(marksKey);
    const markToDelete = marks[index];
    const allIndex = allMarks.findIndex((mark) =>
      markToDelete.id
        ? mark.id === markToDelete.id
        : mark.archiveId === markToDelete.archiveId &&
          mark.text === markToDelete.text &&
          mark.dateMarked === markToDelete.dateMarked,
    );
    if (allIndex >= 0) allMarks.splice(allIndex, 1);
    localStorage.setItem(marksKey, JSON.stringify(allMarks));
    setMarks((current) => current.filter((_, currentIndex) => currentIndex !== index));
  };

  return (
    <div className="mx-auto max-w-[700px] lg:ml-auto lg:mr-0 lg:max-w-[620px]">
      {selectedText && (
        <button
          type="button"
          onClick={markSelectedPassage}
          className="fixed z-[60] inline-flex min-h-11 -translate-x-1/2 items-center bg-foreground px-4 py-3 text-[9px] tracking-[0.18em] text-background uppercase touch-manipulation"
          style={{
            left: selectionPosition.left,
            top: Math.max(12, selectionPosition.top),
          }}
          onMouseDown={(event) => event.preventDefault()}
        >
          Mark Passage
        </button>
      )}

      <section className={`border-t ${border} py-14 sm:py-20`}>
        <div className="flex items-center gap-3">
          <RavenLogoLabel />
          <button
            type="button"
            onClick={toggleShelf}
            className="inline-flex min-h-11 items-center py-3 pr-2 text-left text-sm font-medium tracking-[0.22em] uppercase transition-opacity duration-200 hover:opacity-55 sm:text-base"
          >
            {saved ? "KEPT" : "KEEP THIS WRITING"}
          </button>
        </div>
      </section>

      <section className={`border-t ${border} py-14 sm:py-20`}>
        <div className="flex items-center gap-3">
          <RavenLogoLabel />
          <button
            type="button"
            onClick={() => setNoteOpen((current) => !current)}
            aria-expanded={noteOpen}
            className="inline-flex min-h-11 items-center py-3 pr-2 text-left text-sm font-medium tracking-[0.22em] uppercase sm:text-base"
          >
            Add a Personal Note
          </button>
        </div>
        {noteOpen && (
          <div className="mt-9">
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="This essay connects to…"
              className={`min-h-44 w-full resize-none border bg-transparent px-5 py-5 font-serif text-xl leading-relaxed outline-none ${muted} ${border}`}
            />
            <button
              type="button"
              onClick={saveNote}
              className="mt-5 inline-flex min-h-11 items-center px-2 text-[10px] tracking-[0.24em] uppercase transition-opacity duration-200 hover:opacity-55 sm:mt-7 sm:text-xs"
            >
              Keep Note
            </button>
          </div>
        )}
      </section>

      <section className={`border-t ${border} py-14 sm:py-20`}>
        <div className="flex items-center gap-3">
          <RavenLogoLabel />
          <h2 className="text-sm font-medium tracking-[0.22em] uppercase sm:text-base">
            Book of Marks
          </h2>
        </div>
        <p className={`mt-7 max-w-xl font-serif text-lg leading-[1.7] ${muted}`}>
          Select a passage in the essay, then mark it to keep the excerpt in your Book of Marks.
        </p>
        <button
          type="button"
          onClick={markSelectedPassage}
          disabled={!selectedText}
          className="mt-5 inline-flex min-h-11 items-center px-2 text-[10px] tracking-[0.24em] uppercase transition-opacity duration-200 disabled:cursor-default disabled:opacity-35 sm:mt-8 sm:text-xs"
        >
          Mark Selected Passage
        </button>

        {marks.length > 0 && (
          <div className={`mt-10 border-t ${border}`}>
            {marks.map((mark, index) => (
              <blockquote
                key={`${mark.text}-${index}`}
                className={`border-b ${border} py-8 font-serif text-lg leading-[1.7] italic`}
              >
                “{mark.text}”
                <footer className={`mt-5 flex flex-wrap items-center justify-between gap-4 text-[9px] not-italic tracking-[0.16em] uppercase ${muted}`}>
                  <span>{mark.archiveId} — {mark.dateMarked}</span>
                  <span className="flex gap-5">
                    <Link
                      href={
                        mark.archiveId === legacyArchiveId
                          ? "/works/on-permanence-in-a-disposable-age"
                          : mark.sourceHref ??
                            "/works/on-permanence-in-a-disposable-age"
                      }
                      className="inline-flex min-h-11 items-center px-2 transition-opacity duration-200 hover:opacity-55"
                    >
                      Revisit
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteMark(index)}
                      className="inline-flex min-h-11 items-center px-2 uppercase transition-opacity duration-200 hover:opacity-55"
                    >
                      Delete
                    </button>
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function RavenLogoLabel() {
  return (
    <span
      aria-hidden="true"
      className="inline-block text-sm text-archive-muted"
    >
      ✦
    </span>
  );
}

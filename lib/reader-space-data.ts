export type SavedMark = {
  id?: string;
  text: string;
  articleTitle: string;
  archiveId: string;
  dateMarked: string;
  sourceHref?: string;
};

export type ReadingActivityRecord = {
  slug: string;
  archiveId: string;
  title: string;
  category: string;
  progress: number;
  maxProgress: number;
  pagesRead: number;
  totalPages: number;
  secondsRead: number;
  lastOpenedAt: string;
  resumePosition: number;
  completedAt?: string;
};

export type FollowedItem = {
  id: string;
  type: "book" | "topic" | "series";
  title: string;
  href?: string;
  completed?: boolean;
};

export const readerShelfKey = "sadwrita-reader-shelf";
export const bookOfMarksKey = "sadwrita-book-of-marks";
export const readingHistoryKey = "sadwrita-reading-history";
export const followingKey = "sadwrita-following";

export function readerNoteDateKey(archiveId: string) {
  return `sadwrita-note-date-${archiveId}`;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readArray<T>(
  key: string,
  isItem: (value: unknown) => value is T,
): T[] {
  const storedValue = window.localStorage.getItem(key);
  if (!storedValue) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(storedValue);
  } catch {
    throw new Error(`Stored Reader's Space data for "${key}" is invalid JSON.`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`Stored Reader's Space data for "${key}" is not a list.`);
  }

  const validItems = parsed.filter(isItem);
  if (validItems.length !== parsed.length) {
    throw new Error(`Stored Reader's Space data for "${key}" has invalid entries.`);
  }

  return validItems;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isSavedMark(value: unknown): value is SavedMark {
  if (!isObject(value)) return false;
  return (
    typeof value.text === "string" &&
    typeof value.articleTitle === "string" &&
    typeof value.archiveId === "string" &&
    typeof value.dateMarked === "string" &&
    (value.id === undefined || typeof value.id === "string") &&
    (value.sourceHref === undefined || typeof value.sourceHref === "string")
  );
}

function isReadingActivityRecord(
  value: unknown,
): value is ReadingActivityRecord {
  if (!isObject(value)) return false;
  return (
    typeof value.slug === "string" &&
    typeof value.archiveId === "string" &&
    typeof value.title === "string" &&
    typeof value.category === "string" &&
    typeof value.progress === "number" &&
    Number.isFinite(value.progress) &&
    typeof value.maxProgress === "number" &&
    Number.isFinite(value.maxProgress) &&
    typeof value.pagesRead === "number" &&
    Number.isFinite(value.pagesRead) &&
    typeof value.totalPages === "number" &&
    Number.isFinite(value.totalPages) &&
    typeof value.secondsRead === "number" &&
    Number.isFinite(value.secondsRead) &&
    typeof value.lastOpenedAt === "string" &&
    typeof value.resumePosition === "number" &&
    Number.isFinite(value.resumePosition) &&
    (value.completedAt === undefined || typeof value.completedAt === "string")
  );
}

function isFollowedItem(value: unknown): value is FollowedItem {
  if (!isObject(value)) return false;
  return (
    typeof value.id === "string" &&
    (value.type === "book" || value.type === "topic" || value.type === "series") &&
    typeof value.title === "string" &&
    (value.href === undefined || typeof value.href === "string") &&
    (value.completed === undefined || typeof value.completed === "boolean")
  );
}

export function getReaderShelf(): string[] {
  return readArray(readerShelfKey, isString);
}

export function getBookOfMarks(): SavedMark[] {
  return readArray(bookOfMarksKey, isSavedMark);
}

export function saveBookOfMarks(marks: SavedMark[]) {
  window.localStorage.setItem(bookOfMarksKey, JSON.stringify(marks));
}

export function getReadingHistory(): ReadingActivityRecord[] {
  return readArray(readingHistoryKey, isReadingActivityRecord);
}

export function saveReadingActivity(
  activity: ReadingActivityRecord,
): ReadingActivityRecord {
  const history = getReadingHistory();
  const previous = history.find((record) => record.slug === activity.slug);
  const next: ReadingActivityRecord = {
    ...previous,
    ...activity,
    maxProgress: Math.max(previous?.maxProgress ?? 0, activity.maxProgress),
    pagesRead: Math.max(previous?.pagesRead ?? 0, activity.pagesRead),
    secondsRead: Math.max(previous?.secondsRead ?? 0, activity.secondsRead),
    completedAt: activity.completedAt ?? previous?.completedAt,
  };

  if (!next.completedAt && next.maxProgress >= 100) {
    next.completedAt = new Date().toISOString();
  }

  window.localStorage.setItem(
    readingHistoryKey,
    JSON.stringify([next, ...history.filter((record) => record.slug !== next.slug)]),
  );

  return next;
}

export function getFollowedItems(): FollowedItem[] {
  return readArray(followingKey, isFollowedItem);
}

import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Work, WorkCategory, WorkSummary } from "./work-types";

const worksDirectory = path.join(process.cwd(), "content", "works");
const categories: WorkCategory[] = [
  "ESSAYS",
  "PHILOSOPHY",
  "FRAGMENTS",
  "POETRY",
  "NOTES",
];
const categoryLabels: Record<WorkCategory, string> = {
  ESSAYS: "ESSAY",
  PHILOSOPHY: "PHILOSOPHY",
  FRAGMENTS: "FRAGMENT",
  POETRY: "POETRY",
  NOTES: "NOTE",
};

function requiredString(
  data: Record<string, unknown>,
  field: string,
  fileName: string,
) {
  const value = data[field];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing or invalid "${field}" in ${fileName}.`);
  }
  return value.trim();
}

function optionalString(
  data: Record<string, unknown>,
  field: string,
  fileName: string,
) {
  const value = data[field];
  if (value === undefined) return undefined;
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Invalid "${field}" in ${fileName}.`);
  }
  return value.trim();
}

function optionalBoolean(
  data: Record<string, unknown>,
  field: string,
  fileName: string,
) {
  const value = data[field];
  if (value === undefined) return false;
  if (typeof value !== "boolean") {
    throw new Error(`Invalid "${field}" in ${fileName}; expected true or false.`);
  }
  return value;
}

function optionalPositiveInteger(
  data: Record<string, unknown>,
  field: string,
  fileName: string,
) {
  const value = data[field];
  if (value === undefined) return undefined;
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    throw new Error(`Invalid "${field}" in ${fileName}; expected a positive integer.`);
  }
  return value;
}

function parseWork(fileName: string): Work {
  const slug = path.basename(fileName, ".md");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Invalid work filename "${fileName}"; use a lowercase slug.`);
  }

  const source = fs.readFileSync(path.join(worksDirectory, fileName), "utf8");
  const parsed = matter(source);
  const data = parsed.data as Record<string, unknown>;
  const categoryValue = requiredString(data, "category", fileName).toUpperCase();
  if (!categories.includes(categoryValue as WorkCategory)) {
    throw new Error(`Unsupported category "${categoryValue}" in ${fileName}.`);
  }

  const date = requiredString(data, "date", fileName);
  if (Number.isNaN(Date.parse(`${date} 1`))) {
    throw new Error(`Invalid date "${date}" in ${fileName}.`);
  }

  const content = parsed.content.trim();
  if (!content) {
    throw new Error(`Missing Markdown article body in ${fileName}.`);
  }

  return {
    slug,
    title: requiredString(data, "title", fileName),
    category: categoryValue as WorkCategory,
    categoryLabel: categoryLabels[categoryValue as WorkCategory],
    archiveId: requiredString(data, "archiveId", fileName),
    legacyArchiveId: optionalString(data, "legacyArchiveId", fileName),
    excerpt: requiredString(data, "excerpt", fileName),
    featuredExcerpt: optionalString(data, "featuredExcerpt", fileName),
    relatedExcerpt: optionalString(data, "relatedExcerpt", fileName),
    date,
    readingTime: requiredString(data, "readingTime", fileName),
    subtitle: optionalString(data, "subtitle", fileName),
    featured: optionalBoolean(data, "featured", fileName),
    featuredOrder: optionalPositiveInteger(data, "featuredOrder", fileName),
    related: optionalBoolean(data, "related", fileName),
    content,
  };
}

export function getWorks(): Work[] {
  const works = fs
    .readdirSync(worksDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map(parseWork);
  const archiveIds = new Set<string>();

  for (const work of works) {
    if (archiveIds.has(work.archiveId)) {
      throw new Error(`Duplicate archive ID "${work.archiveId}".`);
    }
    archiveIds.add(work.archiveId);
  }

  return works.sort(
    (first, second) =>
      Date.parse(`${second.date} 1`) - Date.parse(`${first.date} 1`),
  );
}

export function getWorkBySlug(slug: string): Work | undefined {
  return getWorks().find((work) => work.slug === slug);
}

export function toWorkSummary(work: Work): WorkSummary {
  return {
    slug: work.slug,
    title: work.title,
    category: work.category,
    categoryLabel: work.categoryLabel,
    archiveId: work.archiveId,
    legacyArchiveId: work.legacyArchiveId,
    excerpt: work.excerpt,
    featuredExcerpt: work.featuredExcerpt,
    relatedExcerpt: work.relatedExcerpt,
    date: work.date,
    readingTime: work.readingTime,
    subtitle: work.subtitle,
    featured: work.featured,
    featuredOrder: work.featuredOrder,
    related: work.related,
  };
}

export function getFeaturedWorks(): WorkSummary[] {
  return getWorks()
    .filter((work) => work.featured)
    .sort(
      (first, second) =>
        (first.featuredOrder ?? Number.MAX_SAFE_INTEGER) -
        (second.featuredOrder ?? Number.MAX_SAFE_INTEGER),
    )
    .slice(0, 3)
    .map(toWorkSummary);
}

export function getRelatedWorks(slug: string): WorkSummary[] {
  const works = getWorks().filter((work) => work.slug !== slug);
  const preferred = works.filter((work) => work.related);
  const remaining = works.filter((work) => !work.related);

  return [...preferred, ...remaining].slice(0, 3).map(toWorkSummary);
}

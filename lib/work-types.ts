export type WorkCategory =
  | "ESSAYS"
  | "PHILOSOPHY"
  | "FRAGMENTS"
  | "POETRY"
  | "NOTES";

export type WorkSummary = {
  slug: string;
  title: string;
  category: WorkCategory;
  categoryLabel: string;
  archiveId: string;
  legacyArchiveId?: string;
  excerpt: string;
  featuredExcerpt?: string;
  relatedExcerpt?: string;
  date: string;
  readingTime: string;
  subtitle?: string;
  featured: boolean;
  featuredOrder?: number;
  related: boolean;
};

export type Work = WorkSummary & {
  content: string;
};

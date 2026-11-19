"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const filters = ["ALL", "ESSAYS", "PHILOSOPHY", "FRAGMENTS", "POETRY", "NOTES"];

const works = [
  {
    category: "ESSAYS",
    categoryLabel: "ESSAY",
    archiveId: "SAD-ESS-012",
    slug: "on-permanence-in-a-disposable-age",
    title: "On Permanence in a Disposable Age",
    excerpt: "Everything around us is designed to be discarded. To build for permanence is now an act of quiet rebellion.",
    date: "September 2026",
    readingTime: "7 min read",
  },
  {
    category: "ESSAYS",
    categoryLabel: "ESSAY",
    archiveId: "SAD-ESS-011",
    slug: "the-weight-of-stillness",
    title: "The Weight of Stillness",
    excerpt: "Stillness is not the absence of motion but the presence of attention. To be still is to carry the full weight of what is.",
    date: "August 2026",
    readingTime: "5 min read",
  },
  {
    category: "PHILOSOPHY",
    categoryLabel: "PHILOSOPHY",
    archiveId: "SAD-PHI-008",
    slug: "consciousness-as-archive",
    title: "Consciousness as Archive",
    excerpt: "What if consciousness is not a generator of experience but a library of it, shelved and slowly read?",
    date: "July 2026",
    readingTime: "9 min read",
  },
  {
    category: "FRAGMENTS",
    categoryLabel: "FRAGMENT",
    archiveId: "SAD-FRA-019",
    slug: "notes-toward-an-archive-of-silence",
    title: "Notes Toward an Archive of Silence",
    excerpt: "The page begins in absence. Between one mark and the next, a private history continues.",
    date: "June 2026",
    readingTime: "4 min read",
  },
  {
    category: "POETRY",
    categoryLabel: "POETRY",
    archiveId: "SAD-POE-006",
    slug: "the-raven-at-the-threshold",
    title: "The Raven at the Threshold",
    excerpt: "At dusk the witness arrives, carrying neither judgment nor inheritance, only the sharpness of attention.",
    date: "May 2026",
    readingTime: "3 min read",
  },
  {
    category: "NOTES",
    categoryLabel: "NOTE",
    archiveId: "SAD-NOT-023",
    slug: "against-the-forgetting-of-words",
    title: "Against the Forgetting of Words",
    excerpt: "Language remembers what its speakers have forgotten. These marginal notes return to that proposition.",
    date: "April 2026",
    readingTime: "6 min read",
  },
];

export default function WorksCatalogue() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [query, setQuery] = useState("");

  const filteredWorks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return works.filter((work) => {
      const matchesFilter =
        activeFilter === "ALL" || work.category === activeFilter;
      const matchesQuery =
        !normalizedQuery ||
        `${work.category} ${work.archiveId} ${work.title} ${work.excerpt}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query]);

  return (
    <main className="min-h-svh bg-black text-[#f5f5f5]">
      <header className="px-5 pt-8 sm:px-10 lg:px-12 lg:pt-12">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex items-center justify-between border-b border-white/35 pb-6">
            <Link
              href="/"
              aria-label="Return to Sadwrita home"
              className="text-xs font-medium tracking-[0.24em] uppercase transition-opacity duration-200 hover:opacity-65"
            >
              SADWRITA
            </Link>
            <span className="font-mono text-xs tracking-[0.24em] text-white/55">
              01
            </span>
          </div>

          <div className="pt-16 pb-12 sm:pt-20 lg:pt-24 lg:pb-16">
            <h1 className="text-[21vw] leading-[0.78] font-bold tracking-[-0.085em] sm:text-[16vw] lg:text-[10rem] xl:text-[12rem]">
              WORKS
            </h1>
            <p className="mt-10 max-w-2xl text-base leading-relaxed text-white/68 sm:text-xl lg:mt-14 lg:text-2xl">
              The archive of essays, fragments, poetry, and philosophical inquiries.
            </p>
          </div>

          <dl className="grid grid-cols-2 border-t border-white/35 md:grid-cols-4">
            {[
              ["148", "Archive Entries"],
              ["62", "Essays"],
              ["14", "Books in Progress"],
              ["29", "Fragments"],
            ].map(([value, label], index) => (
              <div
                key={label}
                className={`py-7 pr-4 md:pr-8 ${index > 0 ? "border-l border-white/35 pl-4 md:pl-8" : ""} ${index > 1 ? "border-t border-white/35 md:border-t-0" : ""}`}
              >
                <dd className="text-5xl leading-none font-bold tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                  {value}
                </dd>
                <dt className="mt-4 text-[9px] tracking-[0.22em] text-white/55 uppercase sm:text-[10px]">
                  {label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <section className="px-5 pt-14 pb-20 sm:px-10 lg:px-12 lg:pt-20">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex flex-col gap-8 border-b border-white/35 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div role="group" aria-label="Filter works" className="flex flex-wrap gap-x-6 gap-y-3 sm:gap-x-8">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`border-b border-transparent pb-2 text-[10px] tracking-[0.2em] uppercase transition-opacity duration-200 sm:text-xs ${
                    activeFilter === filter
                      ? "border-white text-white"
                      : "text-white/50 hover:text-white"
                  }`}
                  aria-pressed={activeFilter === filter}
                >
                  {filter}
                </button>
              ))}
            </div>

            <label className="block w-full border-b border-white/55 lg:w-[300px]">
              <span className="sr-only">Search the archive</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the Archive"
                className="h-11 w-full bg-transparent text-sm text-[#f5f5f5] outline-none placeholder:text-white/45"
              />
            </label>
          </div>

          {filteredWorks.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 border border-white/45 sm:grid-cols-2 lg:grid-cols-3">
              {filteredWorks.map((work) => (
                <Link
                  key={work.archiveId}
                  href={`/works/${work.slug}`}
                  className="group flex min-h-[390px] flex-col border-b border-white/45 px-7 py-8 transition-colors duration-200 hover:bg-[#f5f5f5] hover:text-black sm:min-h-[420px] sm:px-8 lg:min-h-[440px] lg:px-10 lg:py-10 [&:nth-child(odd)]:border-r [&:nth-child(odd)]:lg:border-r-0 lg:[&:nth-child(3n+1)]:border-r lg:[&:nth-child(3n+2)]:border-r"
                >
                  <p className="text-[10px] font-medium tracking-[0.22em] text-white/65 uppercase transition-colors duration-200 group-hover:text-black/55 sm:text-xs">
                    {work.categoryLabel} — {work.archiveId}
                  </p>
                  <h2 className="mt-8 max-w-[340px] text-3xl leading-[1.05] font-bold tracking-[-0.04em] sm:text-4xl">
                    {work.title}
                  </h2>
                  <p className="mt-8 font-serif text-[17px] leading-[1.55] text-white/72 transition-colors duration-200 group-hover:text-black/75 lg:text-lg">
                    {work.excerpt}
                  </p>
                  <div className="mt-auto flex justify-between gap-4 border-t border-white/25 pt-5 text-[9px] tracking-[0.18em] text-white/55 uppercase transition-colors duration-200 group-hover:border-black/20 group-hover:text-black/55 sm:text-[10px]">
                    <time>{work.date}</time>
                    <span>{work.readingTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-10 border-b border-white/35 pb-10 text-sm tracking-[0.12em] text-white/55 uppercase">
              No archive entries found
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

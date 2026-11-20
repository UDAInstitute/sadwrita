import Link from "next/link";

const archiveEntries = [
  { number: "01", label: "Works", href: "/works" },
  { number: "02", label: "Books", href: "/books" },
  { number: "03", label: "Archive", href: "/archive" },
  { number: "04", label: "Reader's Space", href: "/readers-space" },
  { number: "05", label: "Manifesto", href: "/manifesto" },
];

export default function ArchiveGrid() {
  return (
    <section
      aria-label="Archive contents"
      className="bg-background px-5 py-14 text-foreground transition-colors duration-300 sm:px-10 sm:py-16 lg:px-12 lg:py-20"
    >
      <div className="mx-auto grid max-w-[1800px] grid-cols-1 border border-archive-border-strong sm:grid-cols-2 lg:grid-cols-5">
        {archiveEntries.map((entry) => (
          <Link
            key={entry.number}
            href={entry.href}
            className="archive-panel group flex min-h-52 flex-col justify-between border-b border-archive-border-strong px-7 py-7 last:border-b-0 sm:min-h-60 sm:border-r sm:last:border-r-0 lg:aspect-square lg:min-h-0 lg:px-7 lg:py-7 xl:px-8 xl:py-8"
          >
            <span className="archive-panel-muted font-mono text-[10px] tracking-[0.3em] text-archive-muted-strong">
              {entry.number}
            </span>
            <span className="max-w-[8ch] text-[clamp(2.5rem,12vw,3rem)] leading-none font-black tracking-[-0.055em] sm:text-[clamp(2.75rem,7vw,3.5rem)] lg:text-[clamp(1.25rem,2vw,2rem)] xl:text-[clamp(1.5rem,2vw,2.25rem)]">
              {entry.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

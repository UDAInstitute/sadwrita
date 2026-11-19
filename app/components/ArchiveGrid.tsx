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
      className="bg-black px-5 py-12 text-[#f5f5f5] sm:px-10 lg:px-12 lg:py-16"
    >
      <div className="mx-auto grid max-w-[1800px] grid-cols-1 border border-white/45 sm:grid-cols-2 lg:grid-cols-5">
        {archiveEntries.map((entry) => (
          <Link
            key={entry.number}
            href={entry.href}
            className="group flex min-h-52 flex-col justify-between border-b border-white/45 px-7 py-7 transition-colors duration-200 last:border-b-0 hover:bg-[#f5f5f5] hover:text-black sm:min-h-60 sm:border-r sm:last:border-r-0 lg:min-h-[260px] lg:px-8 lg:py-8"
          >
            <span className="font-mono text-xs tracking-[0.28em] text-white/70 transition-colors duration-200 group-hover:text-black/65">
              {entry.number}
            </span>
            <span className="max-w-[8ch] text-4xl leading-none font-bold tracking-[-0.055em] sm:text-5xl lg:text-[3.25rem] xl:text-6xl">
              {entry.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

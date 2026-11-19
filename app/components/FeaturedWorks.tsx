const works = [
  {
    category: "Essays",
    archiveId: "SAD-ESS-001",
    title: "The Weight of Stillness",
    excerpt:
      "Stillness is not the absence of motion but the presence of attention. To be still is to carry the full weight of what is.",
  },
  {
    category: "Essays",
    archiveId: "SAD-ESS-002",
    title: "On Permanence in a Disposable Age",
    excerpt:
      "Everything around us is designed to be discarded. To build for permanence is now an act of quiet rebellion, and perhaps of faith.",
  },
  {
    category: "Philosophy",
    archiveId: "SAD-PHI-001",
    title: "Consciousness as Archive",
    excerpt:
      "What if consciousness is not a generator of experience but a library of it — a place where the world is shelved, cross-referenced, and slowly read?",
  },
];

export default function FeaturedWorks() {
  return (
    <section
      id="works"
      aria-labelledby="featured-works-heading"
      className="bg-background px-5 py-16 text-foreground transition-colors duration-300 sm:px-10 lg:min-h-svh lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-[1800px]">
        <header className="flex items-start justify-between">
          <h2
            id="featured-works-heading"
            className="text-[18vw] leading-[0.74] font-black tracking-[-0.085em] sm:text-[12vw] lg:text-[8.2rem] xl:text-[9.5rem]"
          >
            <span className="block">Featured</span>
            <span className="block">Works</span>
          </h2>

          <a
            href="#archive"
            className="mt-32 shrink-0 text-[10px] font-medium tracking-[0.28em] text-archive-muted uppercase transition-opacity duration-200 hover:opacity-100 sm:mt-40 sm:text-xs lg:mt-44"
          >
            All Works <span className="ml-3" aria-hidden="true">→</span>
          </a>
        </header>

        <div className="mt-14 grid grid-cols-1 border border-archive-border-strong bg-background sm:mt-16 md:grid-cols-3 lg:mt-20">
          {works.map((work) => (
            <article
              key={work.archiveId}
              className="archive-panel group flex min-h-[390px] flex-col border-b border-archive-border-strong px-7 py-8 last:border-b-0 md:border-r md:border-b-0 md:px-8 md:last:border-r-0 lg:min-h-[385px] lg:px-10 lg:py-10"
            >
              <p className="archive-panel-muted text-[10px] font-medium tracking-[0.28em] uppercase text-archive-muted sm:text-xs">
                {work.category}
                <span className="mx-3" aria-hidden="true">—</span>
                {work.archiveId}
              </p>

              <h3 className="mt-9 max-w-[340px] text-3xl leading-[1.05] font-bold tracking-[-0.04em] sm:text-4xl">
                {work.title}
              </h3>

              <p className="archive-panel-muted mt-auto pt-12 font-serif text-[17px] leading-[1.55] text-archive-muted-strong lg:max-w-[330px] lg:text-lg">
                {work.excerpt}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import { getFeaturedWorks } from "../../lib/works";

export default function FeaturedWorks() {
  const works = getFeaturedWorks();

  return (
    <section
      id="works"
      aria-labelledby="featured-works-heading"
      className="featured-works-section px-5 py-20 transition-colors duration-300 sm:px-10 sm:py-24 lg:min-h-svh lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1800px]">
        <header className="flex flex-col items-start gap-8 sm:flex-row sm:justify-between">
          <h2
            id="featured-works-heading"
            className="text-[18vw] leading-[0.74] font-black tracking-[-0.085em] sm:text-[12vw] lg:text-[8.2rem] xl:text-[9.5rem]"
          >
            <span className="block">Featured</span>
            <span className="block">Works</span>
          </h2>

          <a
            href="#archive"
            className="shrink-0 text-[9px] font-medium tracking-[0.3em] text-black/60 uppercase transition-opacity duration-200 hover:text-black hover:opacity-100 sm:mt-36 sm:text-[10px] lg:mt-40"
          >
            All Works <span className="ml-3" aria-hidden="true">→</span>
          </a>
        </header>

        <div className="mt-16 grid grid-cols-1 border border-black/35 bg-transparent sm:mt-20 md:grid-cols-3 lg:mt-24">
          {works.map((work) => (
            <article
              key={work.archiveId}
              className="group flex min-h-[350px] min-w-0 flex-col border-b border-white/30 bg-black px-7 py-8 text-white transition-colors duration-300 hover:border-black/25 hover:bg-white hover:text-black last:border-b-0 md:min-h-[330px] md:border-r md:border-b-0 md:px-7 md:last:border-r-0 lg:min-h-[350px] lg:px-8 lg:py-9"
            >
              <p className="text-[9px] font-medium tracking-[0.28em] text-white/70 uppercase transition-colors duration-300 group-hover:text-black/60 sm:text-[10px]">
                {work.category[0] + work.category.slice(1).toLowerCase()}
                <span className="mx-3" aria-hidden="true">—</span>
                {work.archiveId}
              </p>

              <h3 className="mt-8 min-w-0 max-w-[340px] text-3xl leading-[1.05] font-black tracking-[-0.04em] sm:text-4xl md:text-[clamp(1.25rem,2.5vw,2.25rem)]">
                {work.title}
              </h3>

              <p className="mt-auto pt-10 font-serif text-base leading-[1.65] text-white/70 transition-colors duration-300 group-hover:text-black/60 lg:max-w-[330px]">
                {work.featuredExcerpt ?? work.excerpt}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

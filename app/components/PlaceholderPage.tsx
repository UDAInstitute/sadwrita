import Navbar from "./Navbar";

type PlaceholderPageProps = {
  title: string;
  description: string;
  number: string;
};

export default function PlaceholderPage({
  title,
  description,
  number,
}: PlaceholderPageProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-svh bg-background px-5 pt-24 pb-8 text-foreground transition-colors duration-300 sm:px-10 lg:px-12">
        <section className="mx-auto flex max-w-[1800px] flex-col justify-between pt-16 sm:pt-24 lg:min-h-[72svh] lg:pt-28">
          <div>
            <p className="mb-6 font-mono text-xs tracking-[0.24em] text-archive-muted">
              {number}
            </p>
            <h1 className="max-w-5xl text-[18vw] leading-[0.78] font-bold tracking-[-0.075em] sm:text-[13vw] lg:text-[9rem] xl:text-[11rem]">
              {title}
            </h1>
            <p className="mt-10 max-w-xl text-base leading-relaxed text-archive-muted-strong sm:text-lg lg:mt-14">
              {description}
            </p>
          </div>

          <p className="mt-20 border-t border-archive-divider pt-5 text-[10px] tracking-[0.28em] text-archive-muted uppercase sm:text-xs">
            Under Construction
          </p>
        </section>
      </main>
    </>
  );
}

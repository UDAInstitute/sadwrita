import Link from "next/link";
import PersistentHeader from "./PersistentHeader";
import ThemeToggle from "./ThemeToggle";

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
    <main className="min-h-svh bg-background px-5 py-8 text-foreground transition-colors duration-300 sm:px-10 lg:px-12">
      <PersistentHeader className="mx-auto flex max-w-[1800px] items-center justify-between border-b border-archive-divider pb-6">
        <Link
          href="/"
          aria-label="Return to Sadwrita home"
          className="text-xs font-medium tracking-[0.24em] uppercase transition-opacity duration-200 hover:opacity-65"
        >
          SADWRITA
        </Link>
        <div className="flex items-center gap-8">
          <span className="font-mono text-xs tracking-[0.24em] text-archive-muted">
            {number}
          </span>
          <ThemeToggle />
        </div>
      </PersistentHeader>

      <section className="mx-auto flex max-w-[1800px] flex-col justify-between pt-16 sm:pt-24 lg:min-h-[72svh] lg:pt-28">
        <div>
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
  );
}

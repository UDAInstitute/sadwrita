import RavenLogo from "./Ravenlogo";

export default function Hero() {
  return (
    <section
      aria-label="Sadwrita literary archive"
      className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background px-5 pt-24 pb-10 text-foreground transition-colors duration-300 sm:px-10"
    >
      <div className="flex w-full max-w-[1800px] flex-col items-center text-center">
        <RavenLogo className="mb-8 h-24 w-24 object-contain sm:mb-10 sm:h-32 sm:w-32 lg:mb-12 lg:h-40 lg:w-40" />

        <h1 className="text-[16vw] leading-[0.82] font-medium tracking-[-0.075em] sm:text-[14vw] lg:text-[12rem] xl:text-[13rem]">
          SADWRITA
        </h1>

        <p className="mt-10 text-[9px] leading-relaxed font-normal tracking-[0.28em] text-archive-muted-strong uppercase sm:mt-12 sm:text-[11px] sm:tracking-[0.34em] lg:mt-14">
          A Permanent Literary Archive &amp; Publishing Imprint
        </p>
      </div>
    </section>
  );
}
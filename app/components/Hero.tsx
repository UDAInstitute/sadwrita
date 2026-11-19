import RavenLogo from "./Ravenlogo";
import Navbar from "./Navbar";

export default function Hero() {
  return (
    <section
      aria-label="Sadwrita literary archive"
      className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-black px-5 py-10 text-[#f5f5f5] sm:px-10"
    >
      <Navbar />
      <div className="flex w-full max-w-[1800px] flex-col items-center text-center">
        <RavenLogo className="h-28 w-28 object-contain sm:h-36 sm:w-36 lg:h-44 lg:w-44" />

        <h1 className="-mt-2 text-[18vw] leading-[0.78] font-medium tracking-[-0.075em] sm:text-[16vw] lg:text-[13rem] xl:text-[15rem]">
          SADWRITA
        </h1>

        <p className="mt-8 text-[10px] leading-none font-normal tracking-[0.26em] text-white/72 uppercase sm:mt-10 sm:text-xs sm:tracking-[0.32em]">
          A Permanent Literary Archive &amp; Publishing Imprint
        </p>
      </div>
    </section>
  );
}
import Hero from "./components/Hero";
import ArchiveGrid from "./components/ArchiveGrid";
import FeaturedWorks from "./components/FeaturedWorks";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ArchiveGrid />
        <FeaturedWorks />
      </main>
    </>
  );
}
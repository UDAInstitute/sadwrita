import Hero from "./components/Hero";
import ArchiveGrid from "./components/ArchiveGrid";
import FeaturedWorks from "./components/FeaturedWorks";

export default function Home() {
  return (
    <main>
      <Hero />
      <ArchiveGrid />
      <FeaturedWorks />
    </main>
  );
}
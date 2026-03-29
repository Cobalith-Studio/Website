import HeroSection from "../components/home/HeroSection";
import HighlightGrid from "../components/home/HighlightGrid";
import ShowcaseSection from "../components/home/ShowcaseSection";
import SimulatorOverview from "../components/home/SimulatorOverview";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HighlightGrid />
      <ShowcaseSection />
      <SimulatorOverview />
    </>
  );
}

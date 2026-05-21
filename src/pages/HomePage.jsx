import { motion } from "framer-motion";
import HeroSection from "../components/home/HeroSection";
import HighlightGrid from "../components/home/HighlightGrid";
import ShowcaseSection from "../components/home/ShowcaseSection";
import SimulatorOverview from "../components/home/SimulatorOverview";

const homePageVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.36,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 1,
    transition: {
      duration: 0
    }
  }
};

export default function HomePage() {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={homePageVariants}>
      <HeroSection />
      <HighlightGrid />
      <ShowcaseSection />
      <SimulatorOverview />
    </motion.div>
  );
}

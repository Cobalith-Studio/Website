import { motion } from "framer-motion";
import BeerSimulator from "../components/simulators/BeerSimulator";
import SectionHeading from "../components/ui/SectionHeading";
import { pageVariants, revealVariants, viewportOnce } from "../lib/animations";

export default function BeerSimulatorPage() {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <section className="section page-intro">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
          <SectionHeading
            kicker="Bière"
            title="Module de brassage restructuré"
            text="La logique reste orientée recette et dérive de style, mais dans un composant lisible et maintenable."
          />
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
          <BeerSimulator />
        </motion.div>
      </section>
    </motion.div>
  );
}

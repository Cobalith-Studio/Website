import { motion } from "framer-motion";
import SpiritsSimulator from "../components/simulators/SpiritsSimulator";
import SectionHeading from "../components/ui/SectionHeading";
import { pageVariants, revealVariants, viewportOnce } from "../lib/animations";

export default function SpiritsSimulatorPage() {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <section className="section page-intro">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
          <SectionHeading
            kicker="Spiritueux"
            title="Distillation, aromatisation et élevage"
            text="Le simulateur de spiritueux suit le même principe: moins de bruit de code, plus de structure et de clarté."
          />
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
          <SpiritsSimulator />
        </motion.div>
      </section>
    </motion.div>
  );
}

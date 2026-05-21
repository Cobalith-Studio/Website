import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import WineDesignSimulator from "../components/simulators/WineDesignSimulator";
import SectionHeading from "../components/ui/SectionHeading";
import { pageVariants, revealVariants, viewportOnce } from "../lib/animations";

export default function WineDesignPage() {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <section className="section page-intro">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
          <SectionHeading
            kicker="Vin"
            title="Concevoir un vin"
            text="Simulation directe d'une recette unique de vinification, avec toutes les étapes dans leur ordre logique et un résultat final complet."
          />
        </motion.div>
        <motion.div className="section-actions wine-page-actions" initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
          <Link className="button button-secondary" to="/simulateur/vin">Retour au graphe</Link>
          <Link className="button button-secondary" to="/simulateur/vin/trouver">Trouver la recette</Link>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
          <WineDesignSimulator />
        </motion.div>
      </section>
    </motion.div>
  );
}

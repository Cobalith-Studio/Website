import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import WineSimulator from "../components/simulators/WineSimulator";
import SectionHeading from "../components/ui/SectionHeading";
import { pageVariants, revealVariants, viewportOnce } from "../lib/animations";

export default function WineSimulatorPage() {
  const [shouldLoadGraph, setShouldLoadGraph] = useState(false);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      onAnimationComplete={(definition) => {
        if (definition === "animate") {
          setShouldLoadGraph(true);
        }
      }}
    >
      <section className="section page-intro">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
          <SectionHeading
            kicker="Vin"
            title="Simulateur de vinification en graphe décisionnel"
            text="Le graphe reste l'entrée principale pour lire toute la logique. Deux systèmes complémentaires permettent ensuite soit de construire une recette unique, soit de chercher des recettes à partir d'un profil final cible."
          />
        </motion.div>
        <motion.div className="section-actions wine-page-actions" initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
          <Link className="button button-secondary" to="/simulateur/vin/concevoir">Concevoir un vin</Link>
          <Link className="button button-secondary" to="/simulateur/vin/trouver">Trouver la recette</Link>
        </motion.div>
        <WineSimulator shouldLoadGraph={shouldLoadGraph} />
      </section>
    </motion.div>
  );
}

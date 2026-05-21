import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import WineRecipeFinder from "../components/simulators/WineRecipeFinder";
import SectionHeading from "../components/ui/SectionHeading";
import { pageVariants, revealVariants, viewportOnce } from "../lib/animations";

export default function WineRecipeFinderPage() {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <section className="section page-intro">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
          <SectionHeading
            kicker="Vin"
            title="Trouver la recette"
            text="Partir du vin final souhaité, laisser certains critères ouverts, puis laisser le moteur proposer les chemins de vinification les plus proches."
          />
        </motion.div>
        <motion.div className="section-actions wine-page-actions" initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
          <Link className="button button-secondary" to="/simulateur/vin">Retour au graphe</Link>
          <Link className="button button-secondary" to="/simulateur/vin/concevoir">Concevoir un vin</Link>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
          <WineRecipeFinder />
        </motion.div>
      </section>
    </motion.div>
  );
}

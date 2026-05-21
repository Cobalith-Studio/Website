import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { simulatorCards } from "../data/siteContent";
import SectionHeading from "../components/ui/SectionHeading";
import { pageVariants, revealVariants, staggerContainer, viewportOnce } from "../lib/animations";

export default function SimulatorHubPage() {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <section className="section page-intro">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
          <SectionHeading
            kicker="Hub"
            title="Choisis un module de simulation"
            text="Chaque simulateur a maintenant sa page, sa logique métier et son rendu propre."
          />
        </motion.div>
        <motion.div className="card-grid three-up" initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer}>
          {simulatorCards.map((item) => (
            <motion.div key={item.href} variants={revealVariants}>
              <Link to={item.href} className={`simulator-card accent-${item.accent}`}>
                <span className="simulator-badge">Accéder</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
}

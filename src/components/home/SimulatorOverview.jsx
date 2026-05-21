import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { simulatorCards } from "../../data/siteContent";
import { revealVariants, staggerContainer, viewportOnce } from "../../lib/animations";
import SectionHeading from "../ui/SectionHeading";

export default function SimulatorOverview() {
  return (
    <section className="section">
      <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
        <SectionHeading
          kicker="Simulateurs"
          title="Des prototypes jouables pour montrer les logiques qui nourrissent le projet"
          text="Ces modules ne représentent pas encore le jeu final, mais ils permettent déjà d'explorer une partie des systèmes, des choix et du travail de recherche derrière l'univers."
        />
      </motion.div>
      <motion.div className="card-grid three-up" initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer}>
        {simulatorCards.map((item) => (
          <motion.div key={item.href} variants={revealVariants}>
            <Link className={`simulator-card accent-${item.accent}`} to={item.href}>
              <span className="simulator-badge">Prototype</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

import { motion } from "framer-motion";
import { gamePillars } from "../data/siteContent";
import SectionHeading from "../components/ui/SectionHeading";
import { pageVariants, revealVariants, staggerContainer, viewportOnce } from "../lib/animations";

export default function GamePage() {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <section className="section page-intro">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
          <SectionHeading
            kicker="Le jeu"
            title="Un jeu de gestion coop où le joueur construit, vend et fait grandir son activité"
            text="Le projet mélange progression, expérimentation, business et notoriété dans un cadre plus léger qu'une simulation pure. Le but est de laisser une vraie marge de manoeuvre au joueur tout en récompensant les choix les plus solides."
          />
        </motion.div>
        <motion.div className="card-grid three-up" initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer}>
          {gamePillars.map((item) => (
            <motion.article className="info-card" key={item.title} variants={revealVariants}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
}

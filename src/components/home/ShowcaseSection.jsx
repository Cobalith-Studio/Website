import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { showcaseCards } from "../../data/siteContent";
import { revealVariants, staggerContainer, viewportOnce } from "../../lib/animations";
import SectionHeading from "../ui/SectionHeading";

export default function ShowcaseSection() {
  return (
    <section className="section section-muted">
      <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
        <SectionHeading
          kicker="Le jeu"
          title="Un projet pensé comme une vraie boucle de production et de notoriété"
          text="Le joueur développe son activité, découvre de nouvelles possibilités, construit ses recettes et cherche à vendre mieux, plus loin et à une clientèle choisie."
        />
      </motion.div>
      <motion.div className="showcase-grid" initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer}>
        {showcaseCards.map((card) => (
          <motion.article className="showcase-card" key={card.title} variants={revealVariants}>
            <img src={card.image} alt={card.title} />
            <div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          </motion.article>
        ))}
      </motion.div>
      <motion.div className="section-actions showcase-actions" initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
        <Link className="button button-primary" to="/le-jeu">
          Approfondir la vision du jeu
        </Link>
      </motion.div>
    </section>
  );
}

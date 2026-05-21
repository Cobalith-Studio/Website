import { motion } from "framer-motion";
import { homeHighlights } from "../../data/siteContent";
import { revealVariants, staggerContainer, viewportOnce } from "../../lib/animations";
import SectionHeading from "../ui/SectionHeading";

export default function HighlightGrid() {
  return (
    <section className="section section--first" id="home-vision">
      <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
        <SectionHeading
          kicker="Vision"
          title="Un jeu de gestion qui mise sur la liberté, la progression et le plaisir de jouer ensemble"
          text="Le projet cherche un bon équilibre entre profondeur, accessibilité et rejouabilité. Le but n'est pas de copier la réalité à la lettre, mais de construire un système crédible, lisible et fun."
        />
      </motion.div>
      <motion.div className="card-grid three-up" initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer}>
        {homeHighlights.map((item) => (
          <motion.article className="info-card" key={item.title} variants={revealVariants}>
            <p className="card-kicker">{item.eyebrow}</p>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

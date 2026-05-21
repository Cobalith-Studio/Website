import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { revealVariants, staggerContainer, viewportOnce } from "../../lib/animations";

export default function HeroSection() {
  const heroTitleLines = [
    "Un tycoon coop",
    "plus vivant, ",
    "plus libre,",
    "plus riche."
  ];

  return (
    <section className="hero hero-immersive">
      <div className="hero-immersive-media" aria-hidden="true">
        <img src="/banniere-hero.png?v=2026-04-16-1253" alt="" />
      </div>

      <div className="hero-immersive-content">
        <motion.div
          className="hero-immersive-copy hero-immersive-copy--surface"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          <motion.p className="hero-kicker hero-kicker--hero" variants={revealVariants}>Jeune studio independant</motion.p>
          <h1>
            {heroTitleLines.map((line, index) => (
              <motion.span key={line} variants={revealVariants}>
                {line}
                {index < heroTitleLines.length - 1 ? <br /> : null}
              </motion.span>
            ))}
          </h1>
          <motion.p className="hero-lead" variants={revealVariants}>
            Production, experimentation et progression dans une entree de site plus epuree, avec le contenu detaille reporte apres le scroll.
          </motion.p>

          <motion.div className="hero-actions" variants={revealVariants}>
            <a className="button button-primary" href="https://discord.gg/yKXXXunr" target="_blank" rel="noreferrer">
              Suivre le projet
            </a>
            <Link className="button button-secondary" to="/le-jeu">
              Decouvrir le jeu
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

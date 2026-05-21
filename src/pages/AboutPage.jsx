import { motion } from "framer-motion";
import RoadmapSection from "../components/about/RoadmapSection";
import SectionHeading from "../components/ui/SectionHeading";
import { pageVariants, revealVariants, viewportOnce } from "../lib/animations";

export default function AboutPage() {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <section className="section page-intro about-story">
        <div className="about-story-layout">
          <motion.div className="about-story-copy" initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
            <SectionHeading
              kicker="Studio"
              title="Cobalith Studio est un jeune studio independant qui construit un jeu de gestion coop ambitieux"
              text="Le projet avance avec une logique simple : poser des bases claires, travailler serieusement le fond, et faire monter le niveau du jeu sans perdre son accessibilite ni son potentiel de fun a plusieurs."
            />
            <p>
              Une partie importante du travail passe par la documentation, la recherche terrain et des echanges avec des professionnels afin de garder des systemes lisibles, inspires du reel et suffisamment solides pour soutenir la boucle de jeu.
            </p>
            <p>
              L'objectif n'est pas seulement d'empiler des fonctionnalites, mais de construire un projet qui gagne en credibilite, en identite et en impact a mesure qu'il avance.
            </p>
          </motion.div>

          <motion.div className="about-story-panel" initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
            <p className="panel-kicker">Cap actuel</p>
            <h2>Une vision long terme, avec des etapes visibles a court terme</h2>
            <p>
              La roadmap melange donc historique du projet, points de structuration deja poses et projection previsionnelle jusqu'a la sortie.
            </p>
          </motion.div>
        </div>
      </section>

      <motion.section className="section" initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
        <RoadmapSection />
      </motion.section>
    </motion.div>
  );
}

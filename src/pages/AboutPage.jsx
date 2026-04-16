import RoadmapSection from "../components/about/RoadmapSection";
import SectionHeading from "../components/ui/SectionHeading";

export default function AboutPage() {
  return (
    <>
      <section className="section page-intro about-story">
        <div className="about-story-layout">
          <div className="about-story-copy">
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
          </div>

          <div className="about-story-panel">
            <p className="panel-kicker">Cap actuel</p>
            <h2>Une vision long terme, avec des etapes visibles a court terme</h2>
            <p>
              La roadmap melange donc historique du projet, points de structuration deja poses et projection previsionnelle jusqu'a la sortie.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <RoadmapSection />
      </section>
    </>
  );
}

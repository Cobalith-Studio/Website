import SectionHeading from "../components/ui/SectionHeading";

export default function AboutPage() {
  return (
    <section className="section page-intro narrow-copy">
      <SectionHeading
        kicker="Studio"
        title="Cobalith Studio est un jeune studio indépendant qui construit un jeu de gestion coop ambitieux"
        text="Le projet avance avec une logique simple : poser des bases claires, travailler sérieusement le fond, et faire monter le niveau du jeu sans perdre son accessibilité ni son potentiel de fun à plusieurs."
      />
      <p>
        Une partie importante du travail passe par la documentation, la recherche terrain et des échanges avec des professionnels afin de garder des systèmes lisibles, inspirés du réel et suffisamment solides pour soutenir la boucle de jeu.
      </p>
      <p>
        La feuille de route actuelle vise une page Steam début 2027, une démo publique fin 2027 puis une sortie officielle au printemps 2028.
      </p>
    </section>
  );
}

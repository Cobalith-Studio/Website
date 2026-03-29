import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="section page-intro narrow-copy">
      <p className="section-kicker">404</p>
      <h1>La page demandée n'existe pas.</h1>
      <p>Vérifier l'URL renseigné en barre de recherche.</p>
      <Link className="button button-primary" to="/">
        Retour à l'accueil
      </Link>
    </section>
  );
}

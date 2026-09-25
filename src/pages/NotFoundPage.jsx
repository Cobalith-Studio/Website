import { Link } from "react-router-dom";
import { EditorialLayout } from "../components/editorial/EditorialSite";
export default function NotFoundPage() {
 return <EditorialLayout><section className="ce-lost ce-wrap">
  <div className="ce-lost-copy"><p className="ce-label">404 / HORS DU DOMAINE</p><h1>Un chemin<br /><em>de traverse.</em></h1><p>Cette page est introuvable. Revenons au domaine.</p><div className="ce-lost-actions"><Link className="ce-solid-link" to="/">Retour à l’accueil <span aria-hidden="true">↗</span></Link><Link className="ce-text-link" to="/simulateur">Les simulateurs <span aria-hidden="true">↗</span></Link></div></div>
  <div className="ce-lost-art" aria-hidden="true"><span>404</span><img src={import.meta.env.BASE_URL + "assets/editorial/domaine.svg"} alt="" /><small>COBALITH STUDIO / RETOUR AU DOMAINE</small></div>
 </section></EditorialLayout>;
}

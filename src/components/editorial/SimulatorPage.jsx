import { Link, NavLink } from "react-router-dom";
const assets = import.meta.env.BASE_URL + "assets/editorial/";
export default function SimulatorPage({ title, description, chapter, object = "bottle", children }) {
 return <div className="ce-lab ce-wrap">
  <header className="ce-lab-hero">
   <div><Link className="ce-label ce-lab-back" to="/simulateur">← TOUS LES SIMULATEURS</Link><p className="ce-label">ATELIER / {chapter}</p><h1>{title}</h1><p className="ce-lab-description">{description}</p></div>
   <div className="ce-lab-art" aria-hidden="true"><span> C.</span><svg viewBox={object === "bottle" ? "0 0 180 380" : "0 0 190 230"}><use href={assets + "objects.svg#" + object} /></svg><small>COBALITH / L’ATELIER</small></div>
  </header>
  <nav className="ce-lab-nav" aria-label="Outils de simulation">
   <NavLink to="/simulateur/vin" end>01 / Graphe du vin</NavLink><NavLink to="/simulateur/vin/concevoir">02 / Concevoir un vin</NavLink><NavLink to="/simulateur/vin/trouver">03 / Trouver la recette</NavLink><NavLink to="/simulateur/biere">04 / Bière</NavLink><NavLink to="/simulateur/spiritueux">05 / Spiritueux</NavLink>
  </nav>
  <div className="ce-lab-workspace">{children}</div>
 </div>;
}

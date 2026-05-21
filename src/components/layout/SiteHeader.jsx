import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { navigationItems } from "../../data/siteContent";

export default function SiteHeader() {
  const location = useLocation();
  const { isTeamMember, user } = useAuth();
  const isHomePage = location.pathname === "/";

  return (
    <header className={`site-header-shell${isHomePage ? " site-header-shell--overlay" : ""}`}>
      <div className="site-header">
        <NavLink className="brand" to="/">
          <img src="/logo.png" alt="Cobalith Studio" />
          <span>Cobalith Studio</span>
        </NavLink>
        <nav className="site-nav" aria-label="Navigation principale">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to={isTeamMember ? "/equipe" : "/connexion"}
            className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
          >
            {isTeamMember ? "Équipe" : user ? "Compte" : "Connexion"}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

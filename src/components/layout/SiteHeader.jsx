import { NavLink } from "react-router-dom";
import { navigationItems } from "../../data/siteContent";

export default function SiteHeader() {
  return (
    <header className="site-header-shell">
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
        </nav>
      </div>
    </header>
  );
}

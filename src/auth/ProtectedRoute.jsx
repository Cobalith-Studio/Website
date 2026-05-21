import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, allowedRoles = ["team", "admin"] }) {
  const location = useLocation();
  const { isConfigured, isLoading, user, profile, isApproved, role, refreshProfile } = useAuth();

  if (!isConfigured) {
    return (
      <section className="section page-intro narrow-copy">
        <div className="panel auth-panel">
          <p className="section-kicker">Configuration</p>
          <h1>Supabase n'est pas encore configuré.</h1>
          <p>Ajoute les variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans ton fichier .env.local.</p>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="section page-intro narrow-copy">
        <div className="panel auth-panel">
          <p>Vérification de la session...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/connexion" replace state={{ from: location }} />;
  }

  if (!profile || !isApproved) {
    return (
      <section className="section page-intro narrow-copy">
        <div className="panel auth-panel">
          <p className="section-kicker">Compte en attente</p>
          <h1>Ton accès équipe n'est pas encore validé.</h1>
          <p>Le compte est connecté, mais il doit être approuvé manuellement dans Supabase avant d'accéder à cet espace.</p>

          <div className="auth-meta-grid">
            <div>
              <span>Email connecté</span>
              <strong>{user.email}</strong>
            </div>
            <div>
              <span>Profil trouvé</span>
              <strong>{profile ? "Oui" : "Non"}</strong>
            </div>
            <div>
              <span>Rôle</span>
              <strong>{profile?.role ?? "-"}</strong>
            </div>
            <div>
              <span>Statut</span>
              <strong>{profile?.status ?? "-"}</strong>
            </div>
          </div>

          <button className="button button-secondary" type="button" onClick={refreshProfile}>
            Rafraîchir le statut
          </button>
        </div>
      </section>
    );
  }

  if (!allowedRoles.includes(role)) {
    return (
      <section className="section page-intro narrow-copy">
        <div className="panel auth-panel">
          <p className="section-kicker">Accès refusé</p>
          <h1>Ce compte n'a pas les droits nécessaires.</h1>
        </div>
      </section>
    );
  }

  return children;
}

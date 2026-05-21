import { useAuth } from "../auth/AuthContext";

export default function TeamPage() {
  const { profile, user, isAdmin, signOut } = useAuth();

  return (
    <section className="section page-intro">
      <div className="panel auth-panel">
        <p className="section-kicker">Espace équipe</p>
        <h1>Bienvenue dans l'espace privé Cobalith.</h1>
        <p>Cette page est uniquement visible par les comptes validés.</p>

        <div className="auth-meta-grid">
          <div>
            <span>Email</span>
            <strong>{profile?.email ?? user?.email}</strong>
          </div>
          <div>
            <span>Rôle</span>
            <strong>{profile?.role}</strong>
          </div>
          <div>
            <span>Statut</span>
            <strong>{profile?.status}</strong>
          </div>
          <div>
            <span>Admin</span>
            <strong>{isAdmin ? "Oui" : "Non"}</strong>
          </div>
        </div>

        <div className="auth-private-placeholder">
          <h2>Zone privée</h2>
          <p>On pourra ajouter ici tes outils internes : notes, dashboard, prototypes cachés, checklist de production ou gestion de contenu.</p>
        </div>

        <button className="button button-secondary" type="button" onClick={signOut}>
          Se déconnecter
        </button>
      </div>
    </section>
  );
}

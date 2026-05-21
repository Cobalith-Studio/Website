import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname ?? "/equipe";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!supabase) {
      setError("Supabase n'est pas encore configuré.");
      return;
    }

    setIsSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setIsSubmitting(false);

    if (signInError) {
      setError("Connexion impossible. Vérifie l'email et le mot de passe.");
      return;
    }

    setMessage("Connexion réussie.");
    navigate(redirectTo, { replace: true });
  }

  return (
    <section className="section page-intro auth-page">
      <div className="panel auth-panel">
        <p className="section-kicker">Espace équipe</p>
        <h1>Connexion</h1>
        <p>Accès réservé aux comptes validés par Cobalith Studio.</p>

        {!isSupabaseConfigured ? (
          <p className="auth-alert auth-alert--error">Supabase n'est pas encore configuré dans .env.local.</p>
        ) : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label>
            <span>Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <p className="auth-alert auth-alert--error">{error}</p> : null}
          {message ? <p className="auth-alert auth-alert--success">{message}</p> : null}

          <button className="button button-primary" type="submit" disabled={isSubmitting || !isSupabaseConfigured}>
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="auth-switch">
          Pas encore de compte équipe ? <Link to="/inscription">Demander un accès</Link>
        </p>
      </div>
    </section>
  );
}

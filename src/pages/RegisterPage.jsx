import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuthRedirectUrl, isSupabaseConfigured, supabase } from "../lib/supabaseClient";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!supabase) {
      setError("Supabase n'est pas encore configuré.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getAuthRedirectUrl("/connexion")
      }
    });
    setIsSubmitting(false);

    if (signUpError) {
      setError("Inscription impossible pour le moment.");
      return;
    }

    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setMessage("Compte créé. Vérifie tes emails puis attends la validation manuelle de l'accès équipe.");
  }

  return (
    <section className="section page-intro auth-page">
      <div className="panel auth-panel">
        <p className="section-kicker">Accès équipe</p>
        <h1>Demander un accès</h1>
        <p>L'inscription crée un compte en attente. L'accès aux pages privées reste bloqué tant que le compte n'est pas approuvé.</p>

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
              autoComplete="new-password"
              minLength={10}
              required
            />
          </label>
          <label>
            <span>Confirmer le mot de passe</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              minLength={10}
              required
            />
          </label>

          {error ? <p className="auth-alert auth-alert--error">{error}</p> : null}
          {message ? <p className="auth-alert auth-alert--success">{message}</p> : null}

          <button className="button button-primary" type="submit" disabled={isSubmitting || !isSupabaseConfigured}>
            {isSubmitting ? "Création..." : "Créer le compte"}
          </button>
        </form>

        <p className="auth-switch">
          Déjà un compte ? <Link to="/connexion">Se connecter</Link>
        </p>
      </div>
    </section>
  );
}

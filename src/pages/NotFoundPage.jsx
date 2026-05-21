import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { pageVariants } from "../lib/animations";

export default function NotFoundPage() {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <section className="section page-intro narrow-copy">
        <p className="section-kicker">404</p>
        <h1>La page demandée n'existe pas.</h1>
        <p>Vérifier l'URL renseigné en barre de recherche.</p>
        <Link className="button button-primary" to="/">
          Retour à l'accueil
        </Link>
      </section>
    </motion.div>
  );
}

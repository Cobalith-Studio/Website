import { motion } from "framer-motion";
import { contactDetails, legalDetails } from "../data/siteContent";
import SectionHeading from "../components/ui/SectionHeading";
import { pageVariants, revealVariants, staggerContainer, viewportOnce } from "../lib/animations";

export default function ContactPage() {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <section className="section page-intro">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={revealVariants}>
          <SectionHeading
            kicker="Contact"
            title="Suivre le projet, poser une question ou entrer en contact avec le studio"
            text="Le projet est encore en développement. Pour suivre son évolution, prendre contact ou vérifier les informations légales, tout est regroupé ici."
          />
        </motion.div>
        <motion.div className="card-grid two-up" initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer}>
          <motion.article className="info-card" variants={revealVariants}>
            <h3>Coordonnées</h3>
            {contactDetails.map((item) => (
              <p key={item.label}>
                <strong>{item.label} :</strong>{" "}
                <a href={item.href} target="_blank" rel="noreferrer">
                  {item.value}
                </a>
              </p>
            ))}
          </motion.article>
          <motion.article className="info-card" variants={revealVariants}>
            <h3>Informations légales</h3>
            {legalDetails.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </motion.article>
        </motion.div>
      </section>
    </motion.div>
  );
}

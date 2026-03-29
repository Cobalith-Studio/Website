import { contactDetails, legalDetails } from "../data/siteContent";
import SectionHeading from "../components/ui/SectionHeading";

export default function ContactPage() {
  return (
    <section className="section page-intro">
      <SectionHeading
        kicker="Contact"
        title="Suivre le projet, poser une question ou entrer en contact avec le studio"
        text="Le projet est encore en développement. Pour suivre son évolution, prendre contact ou vérifier les informations légales, tout est regroupé ici."
      />
      <div className="card-grid two-up">
        <article className="info-card">
          <h3>Coordonnées</h3>
          {contactDetails.map((item) => (
            <p key={item.label}>
              <strong>{item.label} :</strong>{" "}
              <a href={item.href} target="_blank" rel="noreferrer">
                {item.value}
              </a>
            </p>
          ))}
        </article>
        <article className="info-card">
          <h3>Informations légales</h3>
          {legalDetails.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </article>
      </div>
    </section>
  );
}

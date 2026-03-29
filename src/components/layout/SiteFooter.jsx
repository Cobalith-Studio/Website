import { contactDetails, legalDetails } from "../../data/siteContent";

export default function SiteFooter() {
  return (
    <footer className="site-footer-shell">
      <div className="site-footer">
        <div>
          <p className="footer-title">Contact</p>
          {contactDetails.slice(0, 2).map((item) => (
            <a key={item.label} href={item.href} className="footer-link" target="_blank" rel="noreferrer">
              {item.value}
            </a>
          ))}
        </div>
        <div>
          <p className="footer-title">Légal</p>
          {legalDetails.map((line) => (
            <p key={line} className="footer-copy">
              {line}
            </p>
          ))}
        </div>
      </div>
    </footer>
  );
}

import { useCookieConsent } from "../../privacy/CookieConsent";
export default function CookiePreferences() {
 const consent = useCookieConsent();
 return <button type="button" className="ce-cookie-trigger" onClick={() => consent?.open()}>Cookies</button>;
}

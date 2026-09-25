import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AUDIENCE_AVAILABLE, CONSENT_KEY, makeChoice, readChoice, validChoice } from './consent';
import AnalyticsTracker from '../analytics/AnalyticsTracker';
import { clearAudienceIdentity } from '../analytics/analytics';
import './cookies.css';
const Context = createContext(null);
export function useCookieConsent() { return useContext(Context); }
function currentChoice() { try { return readChoice(window.localStorage); } catch { return null; } }
export default function CookieConsent({ children }) {
 const { pathname } = useLocation();
 const [choice, setChoice] = useState(currentChoice);
 const [visible, setVisible] = useState(() => !currentChoice());
 const [details, setDetails] = useState(false);
 const [audience, setAudience] = useState(false);
 const [notice, setNotice] = useState('');
 const heading = useRef(null);
 const opener = useRef(null);
 const memoryOnly = useRef(false);
 const internal = /^\/(equipe|admin)(\/|$)/.test(pathname);
 useEffect(() => {
   function sync(event) {
     if(event?.type === 'storage' && event.key !== CONSENT_KEY && event.key !== null) return;
     if(memoryOnly.current && event?.type !== 'storage') return;
     const next = currentChoice(); setChoice(next); setAudience(next?.audience ?? false); setVisible(!next); setDetails(false);
   }
   window.addEventListener('storage', sync); window.addEventListener('focus', sync);
   return () => { window.removeEventListener('storage', sync); window.removeEventListener('focus', sync); };
 }, []);
 useEffect(() => {
   if(!choice) return;
   let timer;
   function checkExpiry() {
     if (!validChoice(choice)) { setChoice(null); setAudience(false); setVisible(true); setDetails(false); return; }
     timer = window.setTimeout(checkExpiry, Math.min(Math.max(0, choice.expiresAt-Date.now())+20, 2147483647));
   }
   checkExpiry();
   return () => window.clearTimeout(timer);
 }, [choice]);
 function open() {
   opener.current = document.activeElement;
   setAudience(choice?.audience ?? false); setVisible(true); setDetails(true);
   requestAnimationFrame(() => heading.current?.focus());
 }
 function close() { setVisible(false); opener.current?.focus(); }
 function save(action, value) {
   const next = makeChoice(action,value); setChoice(next); setVisible(false); setDetails(false);
   try { window.localStorage.setItem(CONSENT_KEY, JSON.stringify(next)); memoryOnly.current=false; setNotice('Vos préférences cookies ont été enregistrées.'); }
   catch { memoryOnly.current=true; setNotice('Choix appliqué pour cette visite. Le navigateur empêche sa mémorisation.'); }
   window.dispatchEvent(new CustomEvent('cobalith:consent-change',{detail:next}));
   if (!next.audience) clearAudienceIdentity();
   opener.current?.focus();
 }
 return <Context.Provider value={{ open, choice }}>
   {children}
   <AnalyticsTracker choice={choice} />
   {!internal && <div className="cb-consent-root">
     <span className="cb-cookie-status" role="status">{notice}</span>
     {!visible && <button className="cb-cookie-reopen" onClick={open} type="button">Cookies</button>}
     {visible && <section className="cb-cookie-panel" role="region" aria-labelledby="cb-cookie-title" onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();close();}}}>
       <div className="cb-cookie-heading"><p>COBALITH / VOTRE NAVIGATION</p><button type="button" className="cb-cookie-close" aria-label="Fermer sans modifier mes choix" onClick={close}>×</button></div>
       <h2 id="cb-cookie-title" ref={heading} tabIndex={-1}>{details ? 'Vos préférences.' : 'À vous de choisir.'}</h2>
       <p>Avec votre accord, une mesure d’audience interne nous aide à comprendre les pages consultées, les parcours, les appareils et les performances du site.</p>
       <p className="cb-cookie-note">Aucune publicité, aucun partage commercial et aucune adresse IP enregistrée. Vous pourrez changer ce choix à tout moment via « Cookies ».</p>
       {details && <div className="cb-cookie-categories">
         <div><h3>Strictement nécessaires</h3><span className="cb-cookie-required">Toujours actifs</span><p>Session Supabase, si vous vous connectez, et préférence locale conservée six mois. Aucun suivi publicitaire.</p></div>
         <div><label><span>Mesure d’audience interne</span><input type="checkbox" checked={audience} disabled={!AUDIENCE_AVAILABLE} onChange={e=>setAudience(e.target.checked)} /></label><p>Pages vues, sessions pseudonymes, durée active, profondeur, provenance, campagnes, appareil, navigateur, système, langue, fuseau et performances. Conservation maximale : 25 mois.</p></div>
       </div>}
       <Link className="cb-cookie-policy" to="/confidentialite" onClick={close}>Confidentialité, données & cookies ↗</Link>
       <div className="cb-cookie-actions"><button type="button" onClick={()=>save('reject',false)}>Tout refuser</button><button type="button" onClick={()=>save('accept',AUDIENCE_AVAILABLE)}>Tout accepter</button></div>
       {details ? <button className="cb-cookie-custom" type="button" onClick={()=>save('custom',audience)}>Enregistrer mes choix</button> : <button className="cb-cookie-custom" type="button" onClick={()=>{setDetails(true);requestAnimationFrame(()=>heading.current?.focus());}}>Personnaliser</button>}
     </section>}
   </div>}
 </Context.Provider>;
}

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowLeft, BarChart3, Clock3, Eye, Gauge, RefreshCw, Users } from "lucide-react";
import { fetchAudienceEvents } from "../../analytics/analytics";
import { buildAudienceStats } from "../../analytics/stats";
import "../../styles/audience-admin.css";

const format = value => new Intl.NumberFormat("fr-FR").format(Math.round(value || 0));
const duration = value => value >= 60 ? `${Math.floor(value / 60)} min ${Math.round(value % 60)} s` : `${Math.round(value)} s`;

function Bars({ data, suffix = "" }) {
  const max = Math.max(1, ...data.map(item => item.value));
  return <div className="audience-bars">{data.length ? data.map(item => <div className="audience-bar" key={item.label}><span title={item.label}>{item.label}</span><i><b style={{ width: `${item.value / max * 100}%` }} /></i><strong>{format(item.value)}{suffix}</strong></div>) : <p className="audience-empty">Pas encore de données.</p>}</div>;
}
function Donut({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0), colors = ["#60a5fa", "#34d399", "#fbbf24", "#c084fc", "#fb7185"];
  let cursor = 0;
  const gradient = data.map((item, index) => { const start = total ? cursor / total * 100 : 0; cursor += item.value; const end = total ? cursor / total * 100 : 0; return `${colors[index % colors.length]} ${start}% ${end}%`; }).join(",");
  return <div className="audience-donut-wrap"><div className="audience-donut" style={{ background: total ? `conic-gradient(${gradient})` : "#1e293b" }}><span>{format(total)}<small>vues</small></span></div><div className="audience-legend">{data.map((item,index)=><p key={item.label}><i style={{background:colors[index%colors.length]}} />{item.label}<strong>{total ? Math.round(item.value/total*100) : 0}%</strong></p>)}</div></div>;
}
function Trend({ data }) {
  const max = Math.max(1, ...data.flatMap(item => [item.views, item.visitors]));
  const points = key => data.map((item,index)=>`${data.length <= 1 ? 0 : index/(data.length-1)*100},${100-item[key]/max*90}`).join(" ");
  return <><svg className="audience-trend" viewBox="0 0 100 105" preserveAspectRatio="none" aria-label="Évolution des pages vues et visiteurs"><polyline className="audience-trend-grid" points="0,100 100,100"/><polyline className="audience-trend-views" points={points("views")}/><polyline className="audience-trend-users" points={points("visitors")}/></svg><div className="audience-trend-labels"><span>{data[0]?.label}</span><span>{data.at(-1)?.label}</span></div></>;
}
function Panel({ title, note, children, wide = false }) { return <section className={`audience-panel${wide ? " audience-panel--wide" : ""}`}><header><h2>{title}</h2>{note && <span>{note}</span>}</header>{children}</section>; }

export default function AudienceAnalytics() {
  const [days, setDays] = useState(30), [state, setState] = useState({ events: [], loading: true, unavailable: false, error: null, truncated: false });
  async function load() { setState(current => ({ ...current, loading: true })); setState({ ...(await fetchAudienceEvents(days)), loading: false }); }
  useEffect(() => { load(); }, [days]);
  const stats = useMemo(() => buildAudienceStats(state.events, days), [state.events, days]);
  const cards = [{ label: "Pages vues", value: format(stats.totals.views), icon: Eye }, { label: "Visiteurs", value: format(stats.totals.visitors), icon: Users }, { label: "Sessions", value: format(stats.totals.sessions), icon: Activity }, { label: "Pages / session", value: stats.totals.pagesPerSession.toFixed(1), icon: BarChart3 }, { label: "Durée active", value: duration(stats.totals.avgDuration), icon: Clock3 }, { label: "Engagement", value: `${format(stats.totals.engagement)} %`, icon: Gauge }];
  return <main className="admin-shell audience-admin"><div className="admin-container">
    <header className="audience-header"><Link to="/equipe"><ArrowLeft /> Espace Admin</Link><div><p>MESURE D’AUDIENCE / DONNÉES CONSENTIES</p><h1>Analyse d’audience</h1><span>Une lecture utile du site, sans identité de compte ni adresse IP enregistrée.</span></div><div className="audience-controls"><div>{[7,30,90].map(value=><button className={days===value?"is-active":""} onClick={()=>setDays(value)} key={value}>{value} jours</button>)}</div><button onClick={load} aria-label="Actualiser"><RefreshCw /></button></div></header>
    {state.unavailable && <div className="audience-setup"><strong>La table d’audience n’est pas encore installée.</strong><p>Exécute le fichier <code>docs/analytics-supabase.sql</code> dans l’éditeur SQL de Supabase. La collecte restera silencieuse jusqu’à cette étape.</p></div>}
    {state.error && !state.unavailable && <div className="audience-setup audience-setup--error">Lecture refusée : {state.error.message}</div>}
    {state.truncated && <div className="audience-setup">Affichage limité aux 10 000 événements les plus anciens de la période. Réduis la période pour une vue complète.</div>}
    <section className="audience-kpis">{cards.map(({label,value,icon:Icon})=><article key={label}><Icon/><span>{label}</span><strong>{state.loading ? "…" : value}</strong></article>)}</section>
    <div className="audience-grid">
      <Panel title="Fréquentation" note={`${days} derniers jours`} wide><Trend data={stats.daily}/><div className="audience-trend-key"><span>Pages vues</span><span>Visiteurs uniques</span></div></Panel>
      <Panel title="Activité récente" note="30 dernières minutes"><div className="audience-live"><i /> <strong>{stats.live}</strong><span>session{stats.live>1?"s":""} récente{stats.live>1?"s":""}</span></div></Panel>
      <Panel title="Pages les plus vues"><Bars data={stats.pages}/></Panel>
      <Panel title="Sources de trafic"><Bars data={stats.sources}/></Panel>
      <Panel title="Appareils"><Donut data={stats.devices}/></Panel>
      <Panel title="Navigateurs"><Bars data={stats.browsers}/></Panel>
      <Panel title="Systèmes"><Bars data={stats.systems}/></Panel>
      <Panel title="Profondeur de lecture"><Donut data={stats.scroll}/></Panel>
      <Panel title="Heures de consultation" wide><div className="audience-hours">{stats.hours.map(item=><div key={item.label} title={`${item.label} : ${item.value}`}><i style={{height:`${Math.max(3,item.value/Math.max(1,...stats.hours.map(h=>h.value))*100)}%`}}/><span>{Number(item.label.slice(0,2))%3===0?item.label:""}</span></div>)}</div></Panel>
      <Panel title="Pages d’entrée"><Bars data={stats.entries}/></Panel>
      <Panel title="Campagnes UTM"><Bars data={stats.campaigns}/></Panel>
      <Panel title="Langues"><Bars data={stats.languages}/></Panel>
      <Panel title="Fuseaux horaires"><Bars data={stats.timezones}/></Panel>
      <Panel title="Largeurs d’écran"><Bars data={stats.viewports}/></Panel>
      <Panel title="Qualité d’expérience"><div className="audience-vitals"><article><span>LCP p75</span><strong>{stats.vitals.lcp ? `${(stats.vitals.lcp/1000).toFixed(2)} s` : "—"}</strong><small>Chargement principal</small></article><article><span>CLS p75</span><strong>{stats.vitals.cls || "—"}</strong><small>Stabilité visuelle</small></article><article><span>Rebond estimé</span><strong>{format(stats.totals.bounce)} %</strong><small>Sessions d’une page</small></article></div></Panel>
    </div>
  </div></main>;
}

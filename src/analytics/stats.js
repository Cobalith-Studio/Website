const labelDate = value => new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit" }).format(new Date(value));
const group = (events, key, filter = () => true) => {
  const counts = new Map();
  events.filter(filter).forEach(event => { const value = event[key] || "Non renseigné"; counts.set(value, (counts.get(value) || 0) + 1); });
  return [...counts].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
};
const average = values => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
const percentile = (values, ratio) => { if (!values.length) return 0; const sorted = [...values].sort((a,b)=>a-b); return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * ratio))]; };

export function buildAudienceStats(events, days = 30, now = Date.now()) {
  const views = events.filter(event => event.event_type === "page_view");
  const ends = events.filter(event => event.event_type === "page_end");
  const sessions = new Map(), visitors = new Set(views.map(event => event.visitor_id));
  views.forEach(event => { const current = sessions.get(event.session_id) || { views: 0, visitor: event.visitor_id }; current.views += 1; sessions.set(event.session_id, current); });
  const duration = ends.map(event => Number(event.duration_seconds) || 0);
  const daily = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(now - offset * 86400000), key = date.toISOString().slice(0, 10);
    const dayViews = views.filter(event => String(event.occurred_at).slice(0, 10) === key);
    daily.push({ label: labelDate(date), views: dayViews.length, visitors: new Set(dayViews.map(event => event.visitor_id)).size });
  }
  const vitals = name => events.filter(event => event.event_type === "web_vital" && event.metric_name === name).map(event => Number(event.metric_value)).filter(Number.isFinite);
  const sources = group(views, "referrer_source").slice(0, 8);
  const entries = group(views.filter(event => event.is_session_start), "path").slice(0, 8);
  const campaigns = group(views, "utm_campaign", event => Boolean(event.utm_campaign)).slice(0, 8);
  return {
    totals: { views: views.length, visitors: visitors.size, sessions: sessions.size, pagesPerSession: sessions.size ? views.length / sessions.size : 0, avgDuration: average(duration), engagement: ends.length ? ends.filter(event => event.engaged).length / ends.length * 100 : 0, bounce: sessions.size ? [...sessions.values()].filter(session => session.views === 1).length / sessions.size * 100 : 0 },
    daily, pages: group(views, "path").slice(0, 10), sources, entries, campaigns,
    devices: group(views, "device_type"), browsers: group(views, "browser").slice(0, 7), systems: group(views, "os").slice(0, 7), viewports: group(views, "viewport"), languages: group(views, "language").slice(0, 7), timezones: group(views, "timezone").slice(0, 7), connections: group(views, "connection").slice(0, 6),
    scroll: [{ label: "0–24 %", value: ends.filter(e => e.scroll_depth < 25).length }, { label: "25–49 %", value: ends.filter(e => e.scroll_depth >= 25 && e.scroll_depth < 50).length }, { label: "50–74 %", value: ends.filter(e => e.scroll_depth >= 50 && e.scroll_depth < 75).length }, { label: "75–100 %", value: ends.filter(e => e.scroll_depth >= 75).length }],
    hours: Array.from({ length: 24 }, (_, hour) => ({ label: `${String(hour).padStart(2,"0")}h`, value: views.filter(event => new Date(event.occurred_at).getHours() === hour).length })),
    vitals: { lcp: percentile(vitals("LCP"), .75), cls: percentile(vitals("CLS"), .75) },
    live: new Set(views.filter(event => now - new Date(event.occurred_at).getTime() <= 30 * 60000).map(event => event.session_id)).size
  };
}

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { buildEvent, clearAudienceIdentity, getAudienceIdentity, sendEvent, SESSION_KEY } from "./analytics";
import { mayMeasureAudience } from "../privacy/consent";

export default function AnalyticsTracker({ choice }) {
  const location = useLocation();
  const current = useRef(null);
  useEffect(() => {
    if (!mayMeasureAudience(choice)) { clearAudienceIdentity(); return; }
    const identity = getAudienceIdentity(); identity.session.pages += 1;
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(identity.session)); } catch { /* ignored */ }
    const page = { path: location.pathname, active: 0, last: performance.now(), maxScroll: 0, sent: false, identity }; current.current = page;
    sendEvent(buildEvent("page_view", page.path, identity, { title: document.title.slice(0, 140), entry_path: identity.isNew ? page.path : null }), choice);
    const accrue = () => { if (!document.hidden) { const now = performance.now(); page.active += Math.min(now - page.last, 15000); page.last = now; } };
    const activity = () => { accrue(); page.last = performance.now(); };
    const scroll = () => { const max = document.documentElement.scrollHeight - innerHeight; page.maxScroll = Math.max(page.maxScroll, max > 0 ? Math.round(scrollY / max * 100) : 100); };
    const finish = () => { if (page.sent) return; accrue(); page.sent = true; sendEvent(buildEvent("page_end", page.path, identity, { duration_seconds: Math.min(1800, Math.round(page.active / 1000)), scroll_depth: Math.min(100, page.maxScroll), engaged: page.active >= 10000 || page.maxScroll >= 50 }), choice); };
    ["pointerdown", "keydown"].forEach(name => addEventListener(name, activity, { passive: true })); addEventListener("scroll", scroll, { passive: true }); addEventListener("pagehide", finish); document.addEventListener("visibilitychange", accrue);
    return () => { finish(); ["pointerdown", "keydown"].forEach(name => removeEventListener(name, activity)); removeEventListener("scroll", scroll); removeEventListener("pagehide", finish); document.removeEventListener("visibilitychange", accrue); };
  }, [location.pathname, choice]);

  useEffect(() => {
    if (!mayMeasureAudience(choice) || !("PerformanceObserver" in window) || !current.current) return;
    const observers = [], identity = current.current.identity;
    const observe = (type, handler) => { try { const observer = new PerformanceObserver(list => handler(list.getEntries())); observer.observe({ type, buffered: true }); observers.push(observer); } catch { /* unavailable metric */ } };
    observe("largest-contentful-paint", entries => { const value = entries.at(-1)?.startTime; if (value) sendEvent(buildEvent("web_vital", location.pathname, identity, { metric_name: "LCP", metric_value: Math.round(value) }), choice); });
    observe("layout-shift", entries => { const value = entries.filter(e => !e.hadRecentInput).reduce((sum, e) => sum + e.value, 0); if (value) sendEvent(buildEvent("web_vital", location.pathname, identity, { metric_name: "CLS", metric_value: Math.round(value * 1000) / 1000 }), choice); });
    return () => observers.forEach(observer => observer.disconnect());
  }, [location.pathname, choice]);
  return null;
}

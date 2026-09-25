import { supabase } from "../lib/supabaseClient";
import { mayMeasureAudience, readChoice } from "../privacy/consent";

export const ANALYTICS_TABLE = "analytics_events";
export const VISITOR_KEY = "cobalith.audience.visitor";
export const SESSION_KEY = "cobalith.audience.session";
const SESSION_TIMEOUT = 30 * 60 * 1000;
const PUBLIC_PATHS = new Set(["/", "/le-jeu", "/simulateur", "/simulateur/vin", "/simulateur/vin/concevoir", "/simulateur/vin/trouver", "/simulateur/biere", "/simulateur/spiritueux", "/a-propos", "/contact", "/mentions-legales", "/conditions-utilisation", "/confidentialite", "/connexion", "/inscription"]);

const uuid = () => crypto.randomUUID();
function read(storage, key) { try { return JSON.parse(storage.getItem(key)); } catch { return null; } }
function write(storage, key, value) { try { storage.setItem(key, JSON.stringify(value)); } catch { /* memory-only browser */ } }

export function getAudienceIdentity(now = Date.now()) {
  let visitor = read(localStorage, VISITOR_KEY);
  const expiry = visitor?.createdAt ? new Date(visitor.createdAt) : null;
  if (expiry) expiry.setUTCMonth(expiry.getUTCMonth() + 13);
  if (!visitor?.id || !expiry || now >= expiry.getTime()) visitor = { id: uuid(), createdAt: now };
  write(localStorage, VISITOR_KEY, visitor);
  let session = read(sessionStorage, SESSION_KEY);
  const isNew = !session?.id || now - Number(session.lastSeen || 0) > SESSION_TIMEOUT;
  if (isNew) session = { id: uuid(), startedAt: now, lastSeen: now, pages: 0 };
  session.lastSeen = now;
  write(sessionStorage, SESSION_KEY, session);
  return { visitor, session, isNew };
}

export function clearAudienceIdentity() {
  try { localStorage.removeItem(VISITOR_KEY); } catch { /* ignored */ }
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignored */ }
}

const screenBucket = width => width <= 375 ? "≤375" : width <= 430 ? "376–430" : width <= 768 ? "431–768" : width <= 1024 ? "769–1024" : width <= 1440 ? "1025–1440" : width <= 1920 ? "1441–1920" : ">1920";
function deviceInfo() {
  const ua = navigator.userAgent;
  const browser = /Edg\//.test(ua) ? "Edge" : /Firefox\//.test(ua) ? "Firefox" : /CriOS|Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Autre";
  const os = /Windows/.test(ua) ? "Windows" : /Android/.test(ua) ? "Android" : /iPhone|iPad|iPod/.test(ua) ? "iOS" : /Mac OS/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "Autre";
  const width = innerWidth;
  return { device_type: width < 600 ? "mobile" : width < 1024 ? "tablette" : "ordinateur", browser, os, viewport: screenBucket(width), language: (navigator.language || "inconnue").slice(0, 12), timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "inconnu", connection: navigator.connection?.effectiveType || null };
}

function campaignInfo() {
  const hashQuery = location.hash.includes("?") ? `?${location.hash.split("?").slice(1).join("?")}` : "";
  const params = new URLSearchParams(location.search || hashQuery);
  const clean = key => (params.get(key) || "").slice(0, 100) || null;
  return { utm_source: clean("utm_source"), utm_medium: clean("utm_medium"), utm_campaign: clean("utm_campaign") };
}
function referrerSource() {
  if (!document.referrer) return "direct";
  try { const host = new URL(document.referrer).hostname.replace(/^www\./, ""); return host === location.hostname.replace(/^www\./, "") ? "interne" : host.slice(0, 100); } catch { return "inconnu"; }
}
export function buildEvent(type, path, identity, details = {}) {
  return { event_type: type, path: PUBLIC_PATHS.has(path) ? path : "/404", visitor_id: identity.visitor.id, session_id: identity.session.id, is_session_start: identity.isNew, referrer_source: identity.isNew ? referrerSource() : "interne", ...deviceInfo(), ...campaignInfo(), ...details };
}
export async function sendEvent(event, choice) {
  let persisted = null;
  try { persisted = readChoice(localStorage); } catch { /* ignored */ }
  if (!supabase || !mayMeasureAudience(choice) || !mayMeasureAudience(persisted) || /^\/(equipe|admin)(\/|$)/.test(event.path)) return false;
  const { error } = await supabase.rpc("record_analytics_event", { payload: event });
  if (error && !["42P01", "42501", "PGRST202", "PGRST205"].includes(error.code)) console.warn("Audience event rejected", error.message);
  return !error;
}
export async function fetchAudienceEvents(days = 30) {
  if (!supabase) return { events: [], unavailable: true, truncated: false };
  const since = new Date(Date.now() - days * 86400000).toISOString(), events = [], pageSize = 1000, limit = 10000;
  for (let from = 0; from < limit; from += pageSize) {
    const { data, error } = await supabase.from(ANALYTICS_TABLE).select("*").gte("occurred_at", since).order("occurred_at", { ascending: true }).range(from, from + pageSize - 1);
    if (error) return { events: [], unavailable: ["42P01", "42501", "PGRST205"].includes(error.code), error, truncated: false };
    events.push(...data);
    if (data.length < pageSize) return { events, unavailable: false, truncated: false };
  }
  return { events, unavailable: false, truncated: true };
}

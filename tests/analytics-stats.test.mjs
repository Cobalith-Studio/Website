import test from "node:test";
import assert from "node:assert/strict";
import { buildAudienceStats } from "../src/analytics/stats.js";

const now = new Date("2026-09-25T12:00:00Z").getTime();
const at = minutes => new Date(now - minutes * 60000).toISOString();
const base = { device_type:"ordinateur", browser:"Chrome", os:"Windows", viewport:"1025–1440", language:"fr-FR", timezone:"Europe/Paris", connection:"4g", referrer_source:"direct" };
const events = [
  { ...base, event_type:"page_view", occurred_at:at(10), visitor_id:"v1", session_id:"s1", path:"/", is_session_start:true },
  { ...base, event_type:"page_view", occurred_at:at(9), visitor_id:"v1", session_id:"s1", path:"/le-jeu" },
  { ...base, event_type:"page_end", occurred_at:at(8), visitor_id:"v1", session_id:"s1", path:"/le-jeu", duration_seconds:40, scroll_depth:80, engaged:true },
  { ...base, event_type:"page_view", occurred_at:at(7), visitor_id:"v2", session_id:"s2", path:"/", is_session_start:true, device_type:"mobile", browser:"Safari", os:"iOS" },
  { ...base, event_type:"page_end", occurred_at:at(6), visitor_id:"v2", session_id:"s2", path:"/", duration_seconds:5, scroll_depth:10, engaged:false },
  { ...base, event_type:"web_vital", occurred_at:at(5), visitor_id:"v1", session_id:"s1", path:"/", metric_name:"LCP", metric_value:1800 }
];

test("computes audience totals and distributions", () => {
  const stats = buildAudienceStats(events, 7, now);
  assert.deepEqual(stats.totals, { views:3, visitors:2, sessions:2, pagesPerSession:1.5, avgDuration:22.5, engagement:50, bounce:50 });
  assert.deepEqual(stats.pages.slice(0,2), [{label:"/",value:2},{label:"/le-jeu",value:1}]);
  assert.equal(stats.devices.find(item=>item.label==="mobile").value,1);
  assert.equal(stats.vitals.lcp,1800);
  assert.equal(stats.live,2);
});

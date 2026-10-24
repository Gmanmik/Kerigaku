// Funzione Supabase "statistiche": legge le visite da Cloudflare Web Analytics e le passa alla pagina admin.
// Il token Cloudflare resta nei segreti di Supabase (CF_API_TOKEN, CF_ACCOUNT_ID, CF_SITE_TAG): il browser non lo vede mai.
// Risponde solo a un admin entrato con la verifica in due passaggi (is_admin() lo controlla).
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const ORIGINS = ["https://dojodellecandele.com", "https://www.dojodellecandele.com"];
const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && ORIGINS.includes(origin) ? origin : ORIGINS[0],
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});

const QUERY = `query($account: string!, $filter: AccountRumPageloadEventsAdaptiveGroupsFilter_InputObject!) {
  viewer { accounts(filter: {accountTag: $account}) {
    totale: rumPageloadEventsAdaptiveGroups(limit: 1, filter: $filter) { count sum { visits } }
    giorni: rumPageloadEventsAdaptiveGroups(limit: 92, filter: $filter, orderBy: [date_ASC]) { count sum { visits } dimensions { date } }
    pagine: rumPageloadEventsAdaptiveGroups(limit: 10, filter: $filter, orderBy: [count_DESC]) { count dimensions { requestPath } }
    paesi: rumPageloadEventsAdaptiveGroups(limit: 10, filter: $filter, orderBy: [count_DESC]) { count dimensions { countryName } }
    provenienza: rumPageloadEventsAdaptiveGroups(limit: 10, filter: $filter, orderBy: [count_DESC]) { count dimensions { refererHost } }
    dispositivi: rumPageloadEventsAdaptiveGroups(limit: 5, filter: $filter, orderBy: [count_DESC]) { count dimensions { deviceType } }
  } }
}`;

Deno.serve(async (req) => {
  const h = cors(req.headers.get("Origin"));
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...h, "Content-Type": "application/json" } });

  // chi chiama deve essere un admin con 2FA
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data: ok, error } = await sb.rpc("is_admin");
  if (error || ok !== true) return json({ error: "solo admin" }, 403);

  let days = 7;
  try { const b = await req.json(); if ([1, 7, 30, 90].includes(b?.days)) days = b.days; } catch (_) { /* resta 7 */ }
  const until = new Date(), since = new Date(until.getTime() - days * 86400000);
  const filter = { AND: [{ siteTag: Deno.env.get("CF_SITE_TAG") }, { datetime_geq: since.toISOString() }, { datetime_leq: until.toISOString() }] };

  const r = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${Deno.env.get("CF_API_TOKEN")}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: QUERY, variables: { account: Deno.env.get("CF_ACCOUNT_ID"), filter } }),
  });
  const out = await r.json().catch(() => null);
  const acc = out?.data?.viewer?.accounts?.[0];
  if (!r.ok || !acc) return json({ error: "Cloudflare non risponde", dettagli: out?.errors?.map((e: { message: string }) => e.message) ?? [] }, 502);

  const list = (rows: any[], key: string) => (rows ?? []).map((x) => ({ nome: x.dimensions?.[key] || "(diretto)", visualizzazioni: x.count }));
  return json({
    giorni: days,
    visite: acc.totale?.[0]?.sum?.visits ?? 0,
    visualizzazioni: acc.totale?.[0]?.count ?? 0,
    perGiorno: (acc.giorni ?? []).map((x: any) => ({ data: x.dimensions.date, visite: x.sum.visits, visualizzazioni: x.count })),
    pagine: list(acc.pagine, "requestPath"),
    paesi: list(acc.paesi, "countryName"),
    provenienza: list(acc.provenienza, "refererHost"),
    dispositivi: list(acc.dispositivi, "deviceType"),
  });
});

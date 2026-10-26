// Funzione Supabase "newsletter": tiene allineata la lista Brevo "Dojo newsletter" con il consenso nel profilo.
// A Brevo passano solo l'email e il nome utente (attributo USERNAME); il contatto è legato all'account con ext_id = id utente.
// Segreti in Supabase: BREVO_API_KEY (chiave API, non quella SMTP) e BREVO_LIST_ID. Il browser non li vede mai.
//
// Azioni (POST, corpo JSON):
//   {action:"sync"}            l'utente entrato: lo aggiunge alla lista se ha il consenso, altrimenti lo toglie
//   {action:"delete_self"}     l'utente entrato: cancella il proprio contatto da Brevo (eliminazione account)
//   {action:"delete", id, email} solo admin con 2FA: cancella il contatto di un account che sta per essere eliminato
//   {action:"reconcile"}       solo admin con 2FA (o la chiamata settimanale automatica con x-cron-token): confronta lista e profili e sistema le differenze
//   {action:"stats", days}     solo admin con 2FA: iscritti, email mandate e ultime campagne, per la pagina admin
//   {action:"test", subject, html}  solo admin con 2FA: manda una prova della newsletter alla sua email
//   {action:"send", id}        solo admin con 2FA: manda subito una newsletter della tabella newsletters
//   {action:"dispatch"}        la chiamata oraria automatica (x-cron-token): se è il giorno e l'ora del ritmo, manda la prima della coda
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const ORIGINS = ["https://dojodellecandele.com", "https://www.dojodellecandele.com"];
const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && ORIGINS.includes(origin) ? origin : ORIGINS[0],
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});

const LIST = Number(Deno.env.get("BREVO_LIST_ID"));
const brevo = (path: string, method = "GET", body?: unknown) =>
  fetch("https://api.brevo.com/v3" + path, {
    method,
    headers: { "api-key": Deno.env.get("BREVO_API_KEY") ?? "", "Content-Type": "application/json", Accept: "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
const byExt = (id: string) => `/contacts/${encodeURIComponent(id)}?identifierType=ext_id`;
const byMail = (email: string) => `/contacts/${encodeURIComponent(email)}?identifierType=email_id`;
const fail = async (r: Response) => { throw new Error(`Brevo ${r.status}: ${(await r.text()).slice(0, 200)}`); };

// iscrive (o aggiorna) il contatto dell'utente; se esisteva solo per email (import a mano) gli aggiunge l'ext_id
async function subscribe(id: string, email: string, username: string) {
  const data = { attributes: { EMAIL: email, USERNAME: username }, listIds: [LIST], emailBlacklisted: false };
  let r = await brevo(byExt(id), "PUT", data);
  if (r.status === 404) r = await brevo(byMail(email), "PUT", { ...data, ext_id: id, attributes: { USERNAME: username } });
  if (r.status === 404) r = await brevo("/contacts", "POST", { email, ext_id: id, attributes: { USERNAME: username }, listIds: [LIST] });
  if (!r.ok) await fail(r);
}
async function unsubscribe(id: string, email?: string) {
  let r = await brevo(byExt(id), "PUT", { unlinkListIds: [LIST] });
  if (r.status === 404 && email) r = await brevo(byMail(email), "PUT", { unlinkListIds: [LIST] });
  if (!r.ok && r.status !== 404 && r.status !== 400) await fail(r);   // 400: non era nella lista
}
// le newsletter partono come campagne Brevo verso la lista "Dojo newsletter"
const SENDER = { name: "Dojo delle candele", email: Deno.env.get("NEWSLETTER_SENDER") ?? "noreply@dojodellecandele.com" };
const UNSUB = /\{\{\s*unsubscribe\s*\}\}/;
type Letter = { id: number; subject: string; preheader: string; html: string; status: string };
async function sendLetter(db: ReturnType<typeof createClient>, n: Letter) {
  if (!UNSUB.test(n.html)) throw new Error("manca il link per disiscriversi ({{ unsubscribe }})");
  // la segno "in invio" prima di chiamare Brevo: se due chiamate arrivano insieme, parte una sola volta
  const { data: took } = await db.from("newsletters").update({ status: "invio", updated_at: new Date().toISOString(), error: null })
    .eq("id", n.id).in("status", ["bozza", "coda", "errore"]).select("id");
  if (!took?.length) throw new Error("questa newsletter è già partita o sta partendo");
  try {
    let r = await brevo("/emailCampaigns", "POST", {
      name: `Newsletter ${new Date().toISOString().slice(0, 10)} · ${n.subject}`.slice(0, 120),
      subject: n.subject, previewText: n.preheader || undefined, sender: SENDER,
      htmlContent: n.html, recipients: { listIds: [LIST] },
    });
    if (!r.ok) await fail(r);
    const { id: campaign } = await r.json();
    await db.from("newsletters").update({ brevo_id: campaign }).eq("id", n.id);
    r = await brevo(`/emailCampaigns/${campaign}/sendNow`, "POST");
    if (!r.ok) await fail(r);
    await db.from("newsletters").update({ status: "inviata", sent_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", n.id);
    return campaign;
  } catch (e) {
    await db.from("newsletters").update({ status: "errore", error: String((e as Error).message ?? e).slice(0, 500), updated_at: new Date().toISOString() }).eq("id", n.id);
    throw e;
  }
}
// giorno della settimana (1 = lunedì) e ora in Italia
function romeNow() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", weekday: "short", hour: "2-digit", hourCycle: "h23" })
    .formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { weekday: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(p.weekday) + 1, hour: Number(p.hour) };
}

async function remove(id: string, email?: string) {
  let r = await brevo(byExt(id), "DELETE");
  if (r.status === 404 && email) r = await brevo(byMail(email), "DELETE");
  if (!r.ok && r.status !== 404) await fail(r);
}

Deno.serve(async (req) => {
  const h = cors(req.headers.get("Origin"));
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...h, "Content-Type": "application/json" } });
  if (!LIST || !Deno.env.get("BREVO_API_KEY")) return json({ error: "mancano i segreti BREVO_API_KEY o BREVO_LIST_ID" }, 500);

  const asUser = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  let body: { action?: string; id?: string | number; email?: string; days?: number; subject?: string; html?: string } = {};
  try { body = await req.json(); } catch (_) { /* corpo vuoto */ }

  try {
    if (body.action === "sync") {
      const { data: { user } } = await asUser.auth.getUser();
      if (!user?.email) return json({ error: "serve l'accesso" }, 401);
      const { data: prof } = await admin.from("profiles").select("username, marketing").eq("id", user.id).maybeSingle();
      if (prof?.marketing && user.email_confirmed_at) await subscribe(user.id, user.email, prof.username);
      else await unsubscribe(user.id, user.email);
      return json({ ok: true, iscritto: !!(prof?.marketing && user.email_confirmed_at) });
    }

    // la persona che sta eliminando il proprio account: la tolgo e cancello il suo contatto da Brevo
    if (body.action === "delete_self") {
      const { data: { user } } = await asUser.auth.getUser();
      if (!user) return json({ error: "serve l'accesso" }, 401);
      await remove(user.id, user.email ?? undefined);
      return json({ ok: true });
    }

    // l'allineamento settimanale parte da solo (pg_cron su Supabase) e si riconosce dal segreto NEWSLETTER_CRON_TOKEN
    const cronToken = Deno.env.get("NEWSLETTER_CRON_TOKEN") ?? "";
    const viaCron = (body.action === "reconcile" || body.action === "dispatch") && cronToken.length >= 24 && req.headers.get("x-cron-token") === cronToken;

    // da qui in poi solo admin con 2FA (tranne l'allineamento automatico)
    if (!viaCron) {
      const { data: isAdmin } = await asUser.rpc("is_admin");
      if (isAdmin !== true) return json({ error: "solo admin" }, 403);
    }

    if (body.action === "dispatch") {
      if (!viaCron) return json({ error: "solo la chiamata automatica" }, 403);
      const { data: set } = await admin.from("newsletter_settings").select("every_weeks, weekday, hour").eq("id", 1).maybeSingle();
      if (!set || !set.every_weeks) return json({ ok: true, inviata: false, motivo: "in pausa" });
      const now = romeNow();
      if (now.weekday !== set.weekday || now.hour !== set.hour) return json({ ok: true, inviata: false, motivo: "non è il momento" });
      const { data: last } = await admin.from("newsletters").select("sent_at").not("sent_at", "is", null).order("sent_at", { ascending: false }).limit(1);
      const since = last?.[0]?.sent_at ? Date.now() - Date.parse(last[0].sent_at) : Infinity;
      if (since < (7 * set.every_weeks - 1) * 86400000) return json({ ok: true, inviata: false, motivo: "troppo presto dall'ultima" });
      const { data: next } = await admin.from("newsletters").select("id, subject, preheader, html, status").eq("status", "coda").order("pos").limit(1);
      if (!next?.length) return json({ ok: true, inviata: false, motivo: "coda vuota" });
      const campaign = await sendLetter(admin, next[0] as Letter);
      return json({ ok: true, inviata: true, id: next[0].id, campagna: campaign });
    }

    if (body.action === "send" && body.id !== undefined) {
      const { data: n } = await admin.from("newsletters").select("id, subject, preheader, html, status").eq("id", Number(body.id)).maybeSingle();
      if (!n) return json({ error: "newsletter non trovata" }, 404);
      const campaign = await sendLetter(admin, n as Letter);
      return json({ ok: true, campagna: campaign });
    }

    if (body.action === "test") {
      // la prova arriva solo all'admin che la chiede, come email singola (non tocca la lista)
      const { data: { user } } = await asUser.auth.getUser();
      const subject = String(body.subject ?? "").slice(0, 150), html = String(body.html ?? "");
      if (!user?.email || !subject || !html || html.length > 300000) return json({ error: "mancano oggetto o testo" }, 400);
      const r = await brevo("/smtp/email", "POST", {
        sender: SENDER, to: [{ email: user.email }], subject: "[Prova] " + subject,
        htmlContent: html.replace(new RegExp(UNSUB.source, "g"), "https://dojodellecandele.com/"),
      });
      if (!r.ok) await fail(r);
      return json({ ok: true, a: user.email });
    }

    if (body.action === "delete" && typeof body.id === "string") {
      // l'account di solito è già stato eliminato: l'email la passa la pagina admin (contatti importati a mano hanno solo quella)
      const { data } = await admin.auth.admin.getUserById(body.id);
      const email = data?.user?.email ?? (typeof body.email === "string" ? body.email : undefined);
      await remove(body.id, email);
      return json({ ok: true });
    }

    if (body.action === "stats") {
      // numeri per la scheda "Newsletter" dell'admin: iscritti, email mandate e ultime campagne (aperture e clic non li tracciamo)
      const days = [1, 7, 30, 90].includes(Number(body.days)) ? Number(body.days) : 30;
      const get = async (path: string) => { const r = await brevo(path); if (!r.ok) await fail(r); return r.json(); };
      const [list, account, report, camps] = await Promise.all([
        get(`/contacts/lists/${LIST}`),
        get("/account"),
        get(`/smtp/statistics/aggregatedReport?days=${days}`),
        get("/emailCampaigns?status=sent&limit=10&sort=desc&statistics=globalStats"),
      ]);
      const credits = (account.plan ?? []).find((p: any) => p.creditsType === "sendLimit") ?? (account.plan ?? [])[0];
      return json({
        giorni: days,
        iscritti: list.uniqueSubscribers ?? list.totalSubscribers ?? 0,
        disiscrittiLista: list.totalBlacklisted ?? 0,
        piano: credits ? { tipo: credits.type, crediti: credits.credits, tipoCrediti: credits.creditsType } : null,
        transazionali: {
          inviate: report.requests ?? 0, consegnate: report.delivered ?? 0,
          rimbalzi: (report.hardBounces ?? 0) + (report.softBounces ?? 0), bloccate: report.blocked ?? 0,
          spam: report.spamReports ?? 0, disiscritti: report.unsubscribed ?? 0,
        },
        campagne: (camps.campaigns ?? []).map((c: any) => {
          const g = c.statistics?.globalStats ?? {};
          return { nome: c.name, oggetto: c.subject, data: c.sentDate, inviate: g.sent ?? 0, consegnate: g.delivered ?? 0,
            rimbalzi: (g.hardBounces ?? 0) + (g.softBounces ?? 0), disiscritti: g.unsubscriptions ?? 0, spam: g.complaints ?? 0 };
        }),
      });
    }

    if (body.action === "reconcile") {
      // tutti gli account, con email e consenso
      const users = new Map<string, { id: string; email: string; username: string; marketing: boolean; ok: boolean; since?: string }>();
      for (let page = 1; ; page++) {
        const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
        if (error) throw error;
        for (const u of data.users) if (u.email) users.set(u.email.toLowerCase(), { id: u.id, email: u.email, username: "", marketing: false, ok: !!u.email_confirmed_at });
        if (data.users.length < 1000) break;
      }
      const { data: profs, error: pe } = await admin.from("profiles").select("id, username, marketing, marketing_at");
      if (pe) throw pe;
      const byId = new Map([...users.values()].map((u) => [u.id, u]));
      for (const p of profs ?? []) { const u = byId.get(p.id); if (u) { u.username = p.username; u.marketing = !!p.marketing; u.since = p.marketing_at; } }

      // i contatti oggi nella lista
      const inList = new Map<string, { blacklisted: boolean; modified?: string }>();
      for (let offset = 0; ; offset += 500) {
        const r = await brevo(`/contacts/lists/${LIST}/contacts?limit=500&offset=${offset}`);
        if (!r.ok) await fail(r);
        const d = await r.json();
        for (const c of d.contacts ?? []) inList.set(String(c.email).toLowerCase(), { blacklisted: !!c.emailBlacklisted, modified: c.modifiedAt });
        if ((d.contacts ?? []).length < 500) break;
      }

      const out = { aggiunti: 0, tolti: 0, senzaAccount: 0, disiscritti: 0 };
      for (const [mail, c] of inList) {
        const u = users.get(mail);
        // nessun account con questa email (eliminato a mano o importato da fuori): lo tolgo solo dalla lista, senza cancellarlo
        if (!u) { const r = await brevo(byMail(mail), "PUT", { unlinkListIds: [LIST] }); if (!r.ok && r.status !== 404) await fail(r); out.senzaAccount++; continue; }
        // si è disiscritto da Brevo dopo l'ultimo consenso dato sul sito (se l'ha riacceso dopo, vince il sito)
        if (c.blacklisted && u.marketing && (!c.modified || !u.since || Date.parse(c.modified) > Date.parse(u.since))) {
          await admin.from("profiles").update({ marketing: false, marketing_at: new Date().toISOString() }).eq("id", u.id);
          u.marketing = false; out.disiscritti++;
        } else if (c.blacklisted && u.marketing && u.ok) { await subscribe(u.id, u.email, u.username); out.aggiunti++; }   // l'ha riacceso sul sito
        if (!u.marketing) { await unsubscribe(u.id, u.email); out.tolti++; }
      }
      for (const [mail, u] of users) if (u.marketing && u.ok && !inList.has(mail)) { await subscribe(u.id, u.email, u.username); out.aggiunti++; }
      return json({ ok: true, ...out });
    }

    return json({ error: "azione sconosciuta" }, 400);
  } catch (e) {
    return json({ error: "non riuscito", dettagli: [String((e as Error).message ?? e)] }, 502);
  }
});

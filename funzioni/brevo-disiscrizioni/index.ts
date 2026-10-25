// Funzione Supabase "brevo-disiscrizioni": la chiama Brevo (webhook marketing) quando qualcuno si disiscrive
// dal link in fondo a un'email. Spegne il consenso newsletter nel profilo dell'account con quella email.
// Va pubblicata con "Verify JWT" spento: la protegge il segreto BREVO_WEBHOOK_TOKEN, che sta nell'indirizzo del webhook
// (…/functions/v1/brevo-disiscrizioni?token=IL_SEGRETO). Senza token giusto risponde 403 e non fa nulla.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const EVENTS = ["unsubscribe", "unsubscribed", "list_deletion", "contact_deleted"];

function same(a: string, b: string) {
  if (!a || !b || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

Deno.serve(async (req) => {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  if (req.method !== "POST" || !same(token, Deno.env.get("BREVO_WEBHOOK_TOKEN") ?? "")) return new Response("no", { status: 403 });

  let body: unknown = null;
  try { body = await req.json(); } catch (_) { return new Response("ok"); }
  const items = (Array.isArray(body) ? body : [body]) as { event?: string; email?: string }[];
  const emails = items.filter((x) => x && EVENTS.includes(String(x.event)) && typeof x.email === "string").map((x) => x.email!.toLowerCase());
  if (!emails.length) return new Response("ok");

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) return new Response("errore", { status: 500 });      // Brevo riprova più tardi
    for (const u of data.users) {
      if (u.email && emails.includes(u.email.toLowerCase())) {
        await admin.from("profiles").update({ marketing: false, marketing_at: new Date().toISOString() }).eq("id", u.id).eq("marketing", true);
      }
    }
    if (data.users.length < 1000) break;
  }
  return new Response("ok");
});

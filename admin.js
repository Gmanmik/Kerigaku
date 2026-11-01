const PL = [["hammer_p","Hammer",1,"inv"],["hanging_m","Hanging man",0,"inv"],["invhammer_p","Inverted hammer",1,"inv"],["shooting_m","Shooting star",0,"inv"],["belthold_p","Belt hold",1,"inv"],["belthold_m","Belt hold",0,"inv"],["engulf_p","Engulfing",1,"inv"],["engulf_m","Engulfing",0,"inv"],["harami_p","Harami",1,"inv"],["harami_m","Harami",0,"inv"],["haramix_p","Harami cross",1,"inv"],["haramix_m","Harami cross",0,"inv"],["piercing_p","Piercing line",1,"inv"],["darkcloud_m","Dark cloud cover",0,"inv"],["dojistar_p","Doji star",1,"inv"],["dojistar_m","Doji star",0,"inv"],["meeting_p","Meeting line",1,"inv"],["meeting_m","Meeting line",0,"inv"],["3soldiers_p","Three white soldiers",1,"inv"],["3crows_m","Three black crows",0,"inv"],["mstar_p","Morning star",1,"inv"],["estar_m","Evening star",0,"inv"],["mdoji_p","Morning doji star",1,"inv"],["edoji_m","Evening doji star",0,"inv"],["abandoned_p","Abandoned baby",1,"inv"],["abandoned_m","Abandoned baby",0,"inv"],["tristar_p","Tri-star",1,"inv"],["tristar_m","Tri-star",0,"inv"],["breakaway_p","Breakaway",1,"inv"],["breakaway_m","Breakaway",0,"inv"],["3inside_p","Three inside up",1,"inv"],["3inside_m","Three inside down",0,"inv"],["3outside_p","Three outside up",1,"inv"],["3outside_m","Three outside down",0,"inv"],["kicking_p","Kicking",1,"inv"],["kicking_m","Kicking",0,"inv"],["matchlow_p","Matching low",1,"inv"],["matchhigh_m","Matching high",0,"inv"],["ladderbot_p","Ladder bottom",1,"inv"],["laddertop_m","Ladder top",0,"inv"],["u3river_p","Unique three river bottom",1,"inv"],["upgap2crows_m","Upside gap two crows",0,"inv"],["3stars_p","Three stars in the south",1,"inv"],["ident3crows_m","Identical three crows",0,"inv"],["swallow_p","Concealing baby swallow",1,"inv"],["deliberation_m","Deliberation",0,"inv"],["sandwich_p","Stick sandwich",1,"inv"],["advblock_m","Advance block",0,"inv"],["homing_p","Homing pigeon",1,"inv"],["2crows_m","Two crows",0,"inv"],["seplines_p","Separating lines",1,"cont"],["seplines_m","Separating lines",0,"cont"],["rising3_p","Rising three methods",1,"cont"],["falling3_m","Falling three methods",0,"cont"],["uptasuki_p","Upside tasuki gap",1,"cont"],["dntasuki_m","Downside tasuki gap",0,"cont"],["sbswhite_p","Side by side white lines",1,"cont"],["sbswhite_m","Side by side white lines",0,"cont"],["3strike_p","Three line strike",1,"cont"],["3strike_m","Three line strike",0,"cont"],["upgap3m_p","Upside gap three methods",1,"cont"],["dngap3m_m","Downside gap three methods",0,"cont"],["onneck_p","On neck line",1,"cont"],["onneck_m","On neck line",0,"cont"],["inneck_p","In neck line",1,"cont"],["inneck_m","In neck line",0,"cont"]]; // [id, nome, rialzista, famiglia] nell'ordine del Dojo
const ORDER = ["inv","cont"].flatMap(f => [1,0].flatMap(b => PL.filter(p => p[3] === f && p[2] === b)));
const CFG = window.DOJO_CONFIG || {};
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ready = !!(window.supabase && CFG.supabaseUrl && CFG.supabaseAnonKey && !/INSERISCI/.test(CFG.supabaseUrl + CFG.supabaseAnonKey));
const sb = ready ? window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey) : null;
let me = null, users = [], open = null;
// controllo anti-robot di Cloudflare Turnstile, attivo solo se config.js ha turnstileSiteKey
let tsId = null;
if(CFG.turnstileSiteKey){
  window.dojoTurnstile = () => { tsId = turnstile.render("#lg-ts", {sitekey: CFG.turnstileSiteKey, size: "flexible", appearance: "interaction-only", language: "it", theme: document.documentElement.dataset.theme || "auto"}); };
  const sc = document.createElement("script");
  sc.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=dojoTurnstile"; sc.async = true;
  document.head.appendChild(sc);
}

const fmtDate = d => d ? new Date(d).toLocaleDateString("it-IT", {day:"numeric", month:"short", year:"numeric"}) : "mai";
function ago(d){
  if(!d) return "mai";
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if(s < 60) return "adesso";
  if(s < 3600) return `${Math.round(s / 60)} min fa`;
  if(s < 86400){ const h = Math.round(s / 3600); return h === 1 ? "1 ora fa" : `${h} ore fa`; }
  const g = Math.round(s / 86400);
  return g === 1 ? "ieri" : g < 30 ? `${g} giorni fa` : fmtDate(d);
}
const BELTS = ["bianca", "gialla", "arancione", "verde", "blu", "nera"];
function summary(u){
  const d = u.progress || {}, srs = d.srs || {}, st = d.stats || {};
  let known = 0, fixing = 0, learning = 0, r = 0, w = 0;
  const belts = [0, 0, 0, 0, 0, 0];
  // i progressi li scrive ogni allievo: si contano solo numeri, così nessun testo finisce nella pagina
  const num = v => Number.isFinite(+v) ? +v : 0;
  for(const c of Object.values(srs)){ const b = Math.max(0, Math.min(5, Math.round(num(c && c.b)))); belts[b]++; if(b >= 5) known++; else if(b >= 3) fixing++; else if(b >= 1) learning++; }
  for(const c of Object.values(st)){ r += num(c && c.r); w += num(c && c.w); }
  // ogni pallino ha il colore della cintura della formazione (scatola di Leitner 0..5)
  const dots = ORDER.map(p => { const b = Math.max(0, Math.min(5, Math.round(num((srs[p[0]] || {}).b)))); return `<i class="k${b}" title="${esc(p[1] + (p[2] ? " +" : " –"))} · cintura ${BELTS[b]}"></i>`; }).join("");
  return {known, fixing, learning, r, w, dots, belts};
}

function gate(title, text, showForm, showMfa){
  $("#main").hidden = true; $("#gate").hidden = false;
  $("#rail").hidden = true; document.body.classList.remove("adm-on"); openMenu(false);
  $("#gateTitle").textContent = title; $("#gateText").textContent = text;
  $("#loginForm").hidden = !showForm;
  $("#mfaForm").hidden = !showMfa;
  if(showMfa) $("#mf-code").focus();
  paintWho();
}
const HOME_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>`;
const OUT_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h5v16h-5"/><path d="M10 8l-4 4 4 4M6 12h10"/></svg>`;
function paintWho(){
  const w = $("#who");
  if(!me){ w.innerHTML = ""; return; }
  const n = (me.user_metadata && me.user_metadata.username) || me.email.split("@")[0];
  w.innerHTML = `<span class="who-name">Sei entrato come <b></b></span><a class="rail-btn" href="./" title="Vai al Dojo">${HOME_SVG}<span>Vai al Dojo</span></a><button class="rail-btn" id="out" type="button" title="Esci">${OUT_SVG}<span>Esci</span></button>`;
  w.querySelector("b").textContent = n;
  $("#wname").textContent = n;
  $("#out").onclick = async () => { await sb.auth.signOut(); me = null; gate("Accesso admin", "Entra con il tuo username (o la tua email) e la password del Dojo.", true); };
}

async function boot(){
  if(!ready) return gate("Configurazione mancante", "Inserisci URL e chiave di Supabase in config.js.", false);
  const {data} = await sb.auth.getSession();
  if(!data.session) return gate("Accesso admin", "Entra con il tuo username (o la tua email) e la password del Dojo.", true);
  me = data.session.user;
  await enter();
}
// il pannello chiede sempre la verifica in due passaggi (security.sql)
async function enter(){
  const st = await sb.rpc("admin_status");
  if(!st.error){
    if(st.data === "setup") return gate("Attiva la verifica in due passaggi", "Per proteggere il pannello serve la verifica in due passaggi. Attivala nella pagina Account del Dojo, poi torna qui.", false);
    if(st.data === "code") return gate("Verifica in due passaggi", "Scrivi il codice a 6 cifre che vedi nella tua app di autenticazione.", false, true);
  }
  const {data: isAdmin, error} = await sb.rpc("is_admin");
  if(error) return gate("Pannello non installato", "Esegui admin.sql nel SQL Editor di Supabase, poi ricarica.", false);
  if(!isAdmin) return gate("Non sei admin", "Questo account non ha i permessi per il pannello. Un admin può darteli dall'elenco degli allievi.", false);
  $("#gate").hidden = true; $("#main").hidden = false; paintWho();
  $("#rail").hidden = false; document.body.classList.add("adm-on");
  showSection();
  await load();
}
async function load(){
  const {data, error} = await sb.rpc("admin_list_users");
  if(error){ $("#list").innerHTML = `<p class="empty">Non riesco a caricare gli allievi: ${esc(error.message)}</p>`; return; }
  users = data || [];
  render(); renderSignups();
  loadIps();
}
function render(){
  const week = Date.now() - 7 * 86400000;
  const active = users.filter(u => u.progress_updated_at && new Date(u.progress_updated_at).getTime() > week).length;
  const sums = users.map(summary);
  const known = sums.reduce((a, s) => a + s.known, 0);
  const r = sums.reduce((a, s) => a + s.r, 0), w = sums.reduce((a, s) => a + s.w, 0);
  $("#tiles").innerHTML = [
    [users.length, users.length === 1 ? "allievo registrato" : "allievi registrati"],
    [active, "si sono allenati negli ultimi 7 giorni"],
    [known, "cinture nere (formazioni conosciute), in totale"],
    [r + w ? Math.round(100 * r / (r + w)) + "%" : "–", `risposte giuste (${r} su ${r + w})`]
  ].map(([v, l]) => `<div class="panel tile"><span class="v">${v}</span><span class="l">${l}</span></div>`).join("");
  const q = $("#q").value.trim().toLowerCase();
  const vis = users.filter(u => !q || u.username.toLowerCase().includes(q));
  $("#list").innerHTML = vis.length ? vis.map(u => row(u, summary(u))).join("") : `<p class="empty">${users.length ? "Nessun allievo con questo nome." : "Ancora nessun allievo registrato."}</p>`;
  vis.forEach(bindRow);
}
function row(u, s){
  const self = me && u.id === me.id, tot = s.r + s.w;
  return `<article class="panel user${u.banned ? " off" : ""}" id="u-${u.id}">
    <div class="uhead">
      <div class="uname"><span class="n"></span>${u.is_admin ? `<span class="chip">admin</span>` : ""}${u.mfa ? `<span class="chip ok">2FA</span>` : ""}${u.marketing ? `<span class="chip ok">newsletter</span>` : ""}${self ? `<span class="chip me">sei tu</span>` : ""}${u.banned ? `<span class="chip ko">sospeso</span>` : ""}${u.locked ? `<span class="chip ko">accesso bloccato</span>` : ""}</div>
      <div class="meta">Registrato il ${fmtDate(u.created_at)} · ultimo accesso ${ago(u.last_sign_in_at)} · ultimo allenamento ${ago(u.progress_updated_at)}</div>
    </div>
    <div class="mail"></div>
    <div class="nums">
      ${[5,4,3,2,1].map(b => `<span class="bt"><i class="k${b}"></i><b>${s.belts[b]}</b> ${BELTS[b]}</span>`).join("")}
      <span>risposte giuste <b>${s.r}</b> su <b>${tot}</b>${tot ? ` (${Math.round(100 * s.r / tot)}%)` : ""}</span>
    </div>
    <div class="dots" aria-label="Formazioni: ${s.known} conosciute su ${PL.length}">${s.dots}</div>
    <div class="acts">
      <button class="btn ghost" data-a="pw" type="button">Nuova password</button>
      <button class="btn ghost" data-a="reset" type="button" ${u.progress ? "" : "disabled"}>Azzera progressi</button>
      <button class="btn ghost" data-a="fig" type="button">Impara o dimentica una formazione</button>
      ${self ? "" : `<button class="btn ghost" data-a="ip" type="button">Blocca IP</button>`}
      ${u.mfa && !self ? `<button class="btn ghost" data-a="mfa" type="button">Togli 2FA</button>` : ""}
      ${u.locked ? `<button class="btn ghost" data-a="unlock" type="button">Sblocca accesso</button>` : ""}
      ${self ? "" : `<button class="btn ghost" data-a="ban" type="button">${u.banned ? "Riattiva account" : "Sospendi account"}</button>`}
      ${self ? "" : `<button class="btn ghost" data-a="admin" type="button">${u.is_admin ? "Togli admin" : "Rendi admin"}</button>
      <button class="btn ghost" data-a="del" type="button">Elimina account</button>`}
    </div>
    <div class="slot"></div>
  </article>`;
}
function bindRow(u){
  const el = document.getElementById("u-" + u.id); if(!el) return;
  el.querySelector(".n").textContent = u.username;
  el.querySelector(".mail").textContent = u.email || "Nessuna email (account creato con il solo username)";
  el.querySelectorAll("[data-a]").forEach(b => b.onclick = () => ask(u, b.dataset.a, el));
}
// fa imparare (cintura nera, scatola 5) o dimenticare (torna bianca, nuova) una formazione; l'allievo lo vede al prossimo accesso
function askFigure(u, slot){
  const opts = P.map(p => `<option value="${p.id}">${esc(p.name)} ${p.bull ? "▲" : "▼"}</option>`).join("");
  slot.innerHTML = `<div class="confirm"><p></p><select aria-label="Formazione">${opts}</select>
    <button class="btn" type="button" data-learn>Segna come imparata</button><button class="btn danger" type="button" data-forget>Fai dimenticare</button><button class="btn ghost" type="button" data-no>Annulla</button></div><p class="msg" role="status"></p>`;
  slot.querySelector("p").textContent = `Scegli una formazione per ${u.username}. La modifica arriva sul suo Dojo la prossima volta che lo apre.`;
  const sel = slot.querySelector("select"), msg = slot.querySelector(".msg");
  slot.querySelector("[data-no]").onclick = () => slot.innerHTML = "";
  const go = async learn => {
    const p = P.find(x => x.id === sel.value);
    const {error} = await sb.rpc("admin_force_item", {target: u.id, item: p.id, learn});
    msg.className = error ? "msg ko" : "msg";
    msg.textContent = error ? "Non riuscito: " + (/admin_force_item/.test(error.message) ? "manca la funzione su Supabase (file SQL «formazioni-forzate»)" : error.message)
      : `${p.name} ${p.bull ? "▲" : "▼"}: ${learn ? "cintura nera, segnata come imparata" : "dimenticata, torna cintura bianca come formazione nuova"} per ${u.username}.`;
  };
  slot.querySelector("[data-learn]").onclick = () => go(true);
  slot.querySelector("[data-forget]").onclick = () => go(false);
}
// blocco IP: mostra gli ultimi indirizzi usati dall'allievo, l'admin sceglie quale bloccare e per quanti giorni
async function askIp(u, slot){
  slot.innerHTML = `<p class="msg" role="status">Cerco gli indirizzi usati da ${esc(u.username)}…</p>`;
  const {data, error} = await sb.rpc("admin_user_ips", {target: u.id});
  const msg = slot.querySelector(".msg");
  if(error){ msg.className = "msg ko"; msg.textContent = "Non riesco a leggere gli indirizzi: " + error.message; return; }
  if(!data || !data.length){ msg.textContent = "Nessun indirizzo registrato per questo allievo."; return; }
  slot.innerHTML = `<div class="confirm"><p>Blocco un indirizzo IP e sospendo gli account che lo hanno usato. Da quell'indirizzo non si potranno più creare account. Attenzione: più persone possono condividere lo stesso IP (scuola, rete mobile).</p>
    <select aria-label="Indirizzo IP">${data.map(r => `<option value="${esc(r.ip)}">${esc(r.ip)} · visto ${ago(r.last_seen)}${r.blocked ? " · già bloccato" : ""}</option>`).join("")}</select>
    <select aria-label="Giorni">${[[7, "7 giorni"], [30, "30 giorni"], [90, "90 giorni"]].map(([d, t]) => `<option value="${d}"${d === 30 ? " selected" : ""}>${t}</option>`).join("")}</select>
    <button class="btn danger" type="button" data-ok>Sì, blocca</button><button class="btn ghost" type="button" data-no>Annulla</button></div><p class="msg" role="status"></p>`;
  const [selIp, selDays] = slot.querySelectorAll("select");
  slot.querySelector("[data-no]").onclick = () => slot.innerHTML = "";
  slot.querySelector("[data-ok]").onclick = async e => {
    e.target.disabled = true;
    const {data: n, error: er} = await sb.rpc("admin_ban_ip", {addr: selIp.value, days: Number(selDays.value), note: "da " + u.username});
    const m = slot.querySelector(".msg");
    if(er){ e.target.disabled = false; m.className = "msg ko"; m.textContent = "Non riuscito: " + er.message; return; }
    await loadIps(); await load();
  };
}
async function loadIps(){
  const box = $("#ipBox"), {data} = await sb.rpc("admin_list_banned_ips");
  if(!data || !data.length){ box.hidden = true; box.innerHTML = ""; return; }
  box.hidden = false;
  box.innerHTML = `<strong>Indirizzi IP bloccati</strong><ul style="margin:6px 0 0;padding:0;list-style:none">${data.map(r => `<li style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:4px 0"><code>${esc(r.ip)}</code><span class="meta">fino al ${fmtDate(r.until)}${r.note ? " · " + esc(r.note) : ""}</span><button class="btn ghost" type="button" data-ip="${esc(r.ip)}">Sblocca</button></li>`).join("")}</ul>`;
  box.querySelectorAll("[data-ip]").forEach(b => b.onclick = async () => { b.disabled = true; await sb.rpc("admin_unban_ip", {addr: b.dataset.ip}); loadIps(); });
}
function ask(u, a, el){
  const slot = el.querySelector(".slot");
  if(a === "fig") return askFigure(u, slot);
  if(a === "ip") return askIp(u, slot);
  const t = {
    pw: [`Nuova password per ${u.username}: comunicagliela tu.`, "Imposta password", "btn", true],
    reset: [`Cancello tutti i progressi di ${u.username}? Ripartirà da zero.`, "Sì, azzera", "btn danger", false],
    admin: [u.is_admin ? `Tolgo a ${u.username} l'accesso a questo pannello?` : `Do a ${u.username} l'accesso a questo pannello, con gli stessi poteri tuoi?`, u.is_admin ? "Sì, togli" : "Sì, rendi admin", "btn", false],
    mfa: [`Tolgo la verifica in due passaggi a ${u.username}? Potrà entrare con la sola password e riattivarla dalla pagina Account. Fallo solo se sei sicuro che sia davvero lui a chiederlo.`, "Sì, togli 2FA", "btn danger", false],
    unlock: [`Sblocco l'accesso di ${u.username}? Potrà riprovare subito la password.`, "Sì, sblocca", "btn", false],
    ban: [u.banned ? `Riattivo l'account di ${u.username}? Potrà di nuovo entrare.` : `Sospendo l'account di ${u.username}? Non potrà più entrare e verrà disconnesso entro un'ora; progressi e dati restano. Puoi riattivarlo quando vuoi.`, u.banned ? "Sì, riattiva" : "Sì, sospendi", u.banned ? "btn" : "btn danger", false],
    del: [`Elimino l'account di ${u.username} e tutti i suoi progressi? Non si può annullare.`, "Sì, elimina", "btn danger", false]
  }[a];
  slot.innerHTML = `<div class="confirm"><p></p>${t[3] ? `<input type="text" autocomplete="off" placeholder="Almeno 8 caratteri, lettere e numeri" aria-label="Nuova password">` : ""}<button class="${t[2]}" type="button" data-ok>${t[1]}</button><button class="btn ghost" type="button" data-no>Annulla</button></div><p class="msg" role="status"></p>`;
  slot.querySelector("p").textContent = t[0];
  const inp = slot.querySelector("input"); if(inp) inp.focus();
  slot.querySelector("[data-no]").onclick = () => slot.innerHTML = "";
  slot.querySelector("[data-ok]").onclick = async e => {
    const msg = slot.querySelector(".msg");
    let call;
    if(a === "pw"){ if(inp.value.length < 8 || !/[a-z]/i.test(inp.value) || !/\d/.test(inp.value)){ msg.className = "msg ko"; msg.textContent = "La password deve avere almeno 8 caratteri, con lettere e numeri."; return; } call = sb.rpc("admin_reset_password", {target: u.id, new_password: inp.value}); }
    if(a === "reset") call = sb.rpc("admin_reset_progress", {target: u.id});
    if(a === "admin") call = sb.rpc("admin_set_admin", {target: u.id, make: !u.is_admin});
    if(a === "del") call = sb.rpc("admin_delete_user", {target: u.id});
    if(a === "mfa") call = sb.rpc("admin_remove_mfa", {target: u.id});
    if(a === "unlock") call = sb.rpc("admin_unlock", {u: u.username});
    if(a === "ban") call = sb.rpc("admin_set_banned", {target: u.id, ban: !u.banned});
    e.target.disabled = true;
    const {error} = await call;
    if(error){ e.target.disabled = false; msg.className = "msg ko"; msg.textContent = "Non riuscito: " + error.message; return; }
    // account eliminato: cancella anche il suo contatto su Brevo (se Brevo non risponde, "Allinea" lo toglie almeno dalla lista)
    if(a === "del") await sb.functions.invoke("newsletter", {body: {action: "delete", id: u.id, email: u.email}}).catch(() => {});
    if(a === "pw"){ slot.innerHTML = `<p class="msg" role="status"></p>`; slot.querySelector(".msg").textContent = `Password di ${u.username} aggiornata.`; return; }
    await load();
  };
}

// paese: Cloudflare manda il codice ISO (US, IT…); mostro bandierina e nome in italiano.
// La bandierina è un'emoji disegnata dal font Twemoji Country Flags, ospitato sul sito, così si vede anche su Windows.
const regionName = (() => { try{ return new Intl.DisplayNames(["it"], {type: "region"}); }catch(e){ return null; } })();
function countryHTML(r){
  const c = String(r.nome || "").toUpperCase();
  if(c === "XX" || c === "T1") return esc(c === "T1" ? "Rete Tor" : "Sconosciuto");
  if(!/^[A-Z]{2}$/.test(c)) return esc(r.nome);
  const flag = String.fromCodePoint(...[...c].map(ch => 0x1F1E6 + ch.charCodeAt(0) - 65));
  let name = c; try{ name = (regionName && regionName.of(c)) || c; }catch(e){}
  return `<span class="flag" aria-hidden="true">${flag}</span>${esc(name)} <span class="cc">${c}</span>`;
}
$("#q").addEventListener("input", render);
$("#reload").onclick = load;
// CSV da importare in Brevo (Contatti → Importa): solo chi ha dato il consenso
$("#mktcopy").onclick = async () => {
  const list = users.filter(u => u.marketing && u.email);
  const csv = "EMAIL;USERNAME\n" + list.map(u => `${u.email};${u.username}`).join("\n");
  $("#exportBox").hidden = false; $("#exportTxt").value = csv;
  let copied = false;
  try{ await navigator.clipboard.writeText(csv); copied = true; }catch(e){ $("#exportTxt").select(); }
  $("#exportMsg").textContent = `${list.length} iscritt${list.length === 1 ? "o" : "i"} alla newsletter. ` + (copied ? "Elenco copiato: incollalo in Brevo, Contatti → Importa contatti." : "Copia l'elenco qui sotto e incollalo in Brevo, Contatti → Importa contatti.");
};
// confronta la lista Brevo con i consensi: iscrive chi manca, toglie chi ha spento il consenso o non ha più l'account,
// e spegne il consenso di chi si è disiscritto da Brevo
$("#nlsync").onclick = async e => {
  const msg = $("#nlMsg"); e.target.disabled = true; msg.className = "meta"; msg.textContent = "Confronto la lista Brevo con gli iscritti…";
  const {data, error} = await sb.functions.invoke("newsletter", {body: {action: "reconcile"}});
  e.target.disabled = false;
  if(error){
    let why = "";
    if(error.context && typeof error.context.json === "function"){
      try{ const b = await error.context.clone().json(); why = (b.error || "") + (b.dettagli && b.dettagli.length ? ": " + b.dettagli.join("; ") : ""); }catch(_){}
      if(error.context.status === 404) why = "la funzione \"newsletter\" non esiste su Supabase";
    }
    msg.className = "meta ko"; msg.textContent = "Non riuscito: " + (why || error.message); return;
  }
  const n = (k, one, many) => `${data[k]} ${data[k] === 1 ? one : many}`;
  msg.textContent = `Fatto. ${n("aggiunti", "iscritto aggiunto", "iscritti aggiunti")}, ${n("tolti", "tolto dalla lista", "tolti dalla lista")}, ${n("senzaAccount", "contatto senza account tolto dalla lista", "contatti senza account tolti dalla lista")}, ${n("disiscritti", "disiscritto da Brevo", "disiscritti da Brevo")}.`;
  if(data.disiscritti) await load();
};
$("#loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const n = $("#lg-name").value.trim().toLowerCase(), pw = $("#lg-pw").value, err = $("#lg-err");
  if(!n || !pw) return err.textContent = "Inserisci username e password.";
  $("#lg-go").disabled = true; err.textContent = "";
  let email = n;
  if(!n.includes("@")){
    const r = await sb.rpc("login_email", {u: n, pw});
    email = r.error ? null : r.data;
    if(!email){ $("#lg-go").disabled = false; return err.textContent = r.error ? (/troppi tentativi/i.test(r.error.message) ? "Troppi tentativi sbagliati: riprova tra 15 minuti." : "Accesso non riuscito: " + r.error.message) : "Username o password sbagliati."; }
  }
  let captchaToken;
  if(CFG.turnstileSiteKey){
    captchaToken = window.turnstile && tsId !== null ? turnstile.getResponse(tsId) : "";
    if(!captchaToken){ $("#lg-go").disabled = false; return err.textContent = "Un attimo: aspetta che finisca il controllo anti-robot, poi riprova."; }
    turnstile.reset(tsId);
  }
  const {data, error} = await sb.auth.signInWithPassword({email, password: pw, options: {captchaToken}});
  $("#lg-go").disabled = false;
  if(error) return err.textContent = /invalid login/i.test(error.message) ? "Username o password sbagliati." : /banned/i.test(error.message) ? "Questo account è sospeso." : "Accesso non riuscito: " + error.message;
  me = data.user; $("#loginForm").reset();
  await enter();
});
$("#mfaForm").addEventListener("submit", async e => {
  e.preventDefault();
  const code = $("#mf-code").value.trim(), err = $("#mf-err");
  if(!/^\d{6}$/.test(code)) return err.textContent = "Il codice è fatto di 6 cifre.";
  $("#mf-go").disabled = true; err.textContent = "";
  const f = await sb.auth.mfa.listFactors();
  const totp = ((f.data && f.data.totp) || [])[0];
  const r = totp ? await sb.auth.mfa.challengeAndVerify({factorId: totp.id, code}) : {error: {message: "nessuna app collegata"}};
  $("#mf-go").disabled = false;
  if(r.error) return err.textContent = "Codice sbagliato o scaduto: riprova con quello nuovo.";
  $("#mfaForm").reset();
  await enter();
});
boot();

// visite al sito: la funzione Supabase "statistiche" chiede i numeri a Cloudflare Web Analytics (il token resta sul server)
let statsDays = 7, nlDays = 7;
// motivo preciso di un errore delle funzioni Supabase (404 funzione mancante, 403 non admin, 502 servizio esterno)
async function fnError(error, data, name){
  let why = data && data.error ? data.error + (data.dettagli && data.dettagli.length ? ": " + data.dettagli.join("; ") : "") : "";
  if(error && error.context && typeof error.context.json === "function"){
    try{ const b = await error.context.clone().json(); why = (b.error || b.message || "") + (b.dettagli && b.dettagli.length ? ": " + b.dettagli.join("; ") : ""); }catch(e){}
    if(error.context.status === 404) why = `la funzione "${name}" non esiste su Supabase`;
    why = why || "errore " + error.context.status;
  }
  return why;
}
async function loadBrevo(days){
  nlDays = days;
  document.querySelectorAll("#nlSeg button").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.d === days)));
  const box = $("#nlBody");
  box.innerHTML = `<p class="empty">Carico le statistiche della newsletter…</p>`;
  const {data, error} = await sb.functions.invoke("newsletter", {body: {action: "stats", days}});
  if(nlDays !== days) return;
  if(error || !data || data.error){
    const why = await fnError(error, data, "newsletter");
    box.innerHTML = `<p class="empty">Statistiche Brevo non disponibili${why ? ` (${esc(why)})` : ""}. Servono la funzione "newsletter" e i segreti BREVO_API_KEY e BREVO_LIST_ID.</p>`;
    return;
  }
  const n = v => Math.max(0, Math.round(Number(v) || 0)), t = data.transazionali || {};
  const tile = (v, l) => `<div class="panel tile"><span class="v">${n(v)}</span><span class="l">${l}</span></div>`;
  const day = s => { const d = new Date(s); return isNaN(d) ? "" : d.toLocaleDateString("it-IT", {day: "numeric", month: "short", year: "numeric"}); };
  const camps = (data.campagne || []).map(c => `<tr><td>${esc(c.oggetto || c.nome || "")}<br><span class="meta">${esc(day(c.data))}</span></td><td class="num">${n(c.consegnate)}</td><td class="num">${n(c.rimbalzi)}</td><td class="num">${n(c.disiscritti)}</td></tr>`).join("");
  box.innerHTML = `<div style="display:grid;gap:14px;grid-template-columns:minmax(0,1fr)">
    <div class="tiles four">${tile(data.iscritti, "iscritti alla newsletter")}${tile(t.consegnate, "email dei codici consegnate")}${tile(t.rimbalzi + t.bloccate, "rimbalzate o bloccate")}${tile(t.disiscritti, "disiscritti nel periodo")}</div>
    ${data.piano ? `<p class="meta">Piano Brevo: ${esc(String(data.piano.tipo || ""))}${data.piano.tipoCrediti === "sendLimit" ? ` · ${n(data.piano.crediti)} email al giorno` : data.piano.crediti != null ? ` · crediti ${n(data.piano.crediti)}` : ""}. Segnalazioni di spam nel periodo: ${n(t.spam)}.</p>` : ""}
    <div><h3 style="margin:0 0 6px;font-size:13px;color:var(--muted);font-weight:600;letter-spacing:.04em;text-transform:uppercase">Ultime newsletter mandate</h3>
    ${camps ? `<div class="tabwrap"><table><thead><tr><th>Newsletter</th><th class="num">Consegnate</th><th class="num">Rimbalzi</th><th class="num">Disiscritti</th></tr></thead><tbody>${camps}</tbody></table></div>` : `<p class="empty" style="padding:6px 0;text-align:left">Ancora nessuna newsletter mandata.</p>`}</div>
    <p class="meta">Aperture e clic non li contiamo: il tracciamento in Brevo è spento per scelta.</p></div>`;
}
// grafico a barre con la scala: valori a sinistra e linee orizzontali, così si capisce subito quanto sono grandi i numeri
function niceTicks(max){
  const raw = Math.max(1, max) / 4, p = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = Math.max(1, [1, 2, 5, 10].map(m => m * p).find(s => s >= raw));
  const top = Math.max(step, Math.ceil(max / step) * step);
  return {top, ticks: Array.from({length: Math.round(top / step) + 1}, (_, i) => i * step)};
}
function barChart(rows, label){
  const {top, ticks} = niceTicks(Math.max(0, ...rows.map(d => d.v))), W = 600, H = 160, bw = W / rows.length;
  const grid = ticks.map(t => { const y = (H - H * t / top).toFixed(1); return `<line x1="0" x2="${W}" y1="${y}" y2="${y}"/>`; }).join("");
  const bars = rows.map((d, i) => { const h = H * d.v / top; return `<rect x="${(i * bw + bw * .12).toFixed(1)}" y="${(H - h).toFixed(1)}" width="${Math.max(.6, bw * .76).toFixed(1)}" height="${h.toFixed(1)}"><title>${esc(d.data)}: ${d.v}</title></rect>`; }).join("");
  const labels = ticks.map(t => `<span style="top:${(100 - 100 * t / top).toFixed(2)}%">${t.toLocaleString("it-IT")}</span>`).join("");
  return `<div class="chartwrap"><div class="yaxis" aria-hidden="true">${labels}</div><svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${esc(label)}"><g class="grid">${grid}</g>${bars}</svg></div>
    <div class="chart-dates"><span>${esc(rows[0].data)}</span><span>${esc(rows[rows.length - 1].data)}</span></div>`;
}
// nuovi iscritti per giorno, dalla data di registrazione degli account (nessun dato in più)
function renderSignups(){
  const box = $("#signBody"); if(!box) return;
  if(!users.length){ box.innerHTML = `<p class="empty">Carico gli allievi…</p>`; return; }
  const days = statsDays, now = new Date(), day0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const since = days === 1 ? now.getTime() - 86400000 : day0.getTime() - (days - 1) * 86400000;
  const inP = users.filter(u => Date.parse(u.created_at) >= since);
  const tile = (v, l) => `<div class="panel tile"><span class="v">${v}</span><span class="l">${l}</span></div>`;
  let chart = "";
  if(days > 1){
    const rows = Array.from({length: days}, (_, i) => { const d = new Date(day0.getTime() - (days - 1 - i) * 86400000); return {t: d.getTime(), data: d.toLocaleDateString("it-IT", {day: "numeric", month: "short"}), v: 0}; });
    inP.forEach(u => { const c = new Date(u.created_at), k = rows.findIndex(r => r.t === new Date(c.getFullYear(), c.getMonth(), c.getDate()).getTime()); if(k >= 0) rows[k].v++; });
    chart = barChart(rows, "Nuovi iscritti per giorno");
  }
  box.innerHTML = `<div style="display:grid;gap:14px;grid-template-columns:minmax(0,1fr)">
    <div class="tiles">${tile(inP.length, days === 1 ? "iscritti nelle ultime 24 ore" : `iscritti negli ultimi ${days} giorni`)}${tile(users.length, "allievi registrati in tutto")}</div>${chart}
    <p class="meta">Chi usa il Dojo senza account non viene contato: non lo tracciamo. Le visite anonime sono nel riquadro qui sopra.</p></div>`;
}
async function loadStats(days){
  statsDays = days; renderSignups();
  document.querySelectorAll("#statsSeg button").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.d === days)));
  const box = $("#statsBody");
  box.innerHTML = `<p class="empty">Carico le statistiche…</p>`;
  const {data, error} = await sb.functions.invoke("statistiche", {body: {days}});
  if(statsDays !== days) return;
  if(error || !data || data.error){
    // motivo preciso, per capire cosa sistemare: funzione mancante (404), non admin (403) o risposta di Cloudflare (502)
    let why = data && data.error ? data.error + (data.dettagli && data.dettagli.length ? ": " + data.dettagli.join("; ") : "") : "";
    if(error && error.context && typeof error.context.json === "function"){
      try{ const b = await error.context.clone().json(); why = (b.error || b.message || "") + (b.dettagli && b.dettagli.length ? ": " + b.dettagli.join("; ") : ""); }catch(e){}
      if(error.context.status === 404) why = "la funzione \"statistiche\" non esiste su Supabase";
      why = why || "errore " + error.context.status;
    }
    box.innerHTML = `<p class="empty">Statistiche non disponibili${why ? ` (${esc(why)})` : ""}. Se non hai ancora collegato Cloudflare, segui i passi in LEGGIMI (funzione "statistiche").</p>`;
    return;
  }
  const n = v => Math.max(0, Math.round(Number(v) || 0));
  const itDay = t => { const d = new Date(t + "T12:00:00"); return isNaN(d) ? t : d.toLocaleDateString("it-IT", {day: "numeric", month: "short"}); };
  const days_ = (data.perGiorno || []).map(d => ({data: itDay(String(d.data || "")), v: n(d.visualizzazioni)}));
  const list = (t, rows, fmt = r => esc(r.nome)) => `<div><h3>${t}</h3>${(rows || []).length ? `<ol>${rows.map(r => `<li><span>${fmt(r)}</span><span>${n(r.visualizzazioni)}</span></li>`).join("")}</ol>` : `<p class="empty" style="padding:6px 0;text-align:left">Ancora niente.</p>`}</div>`;
  box.innerHTML = `<div style="display:grid;gap:14px;grid-template-columns:minmax(0,1fr)">
    <div class="tiles"><div class="panel tile"><span class="v">${n(data.visite).toLocaleString("it-IT")}</span><span class="l">visite</span></div><div class="panel tile"><span class="v">${n(data.visualizzazioni).toLocaleString("it-IT")}</span><span class="l">pagine viste</span></div></div>
    ${days_.length > 1 ? barChart(days_, "Pagine viste per giorno") : ""}
    <div class="lists">${list("Pagine più viste", data.pagine)}${list("Da dove arrivano", data.provenienza)}${list("Paesi", data.paesi, countryHTML)}${list("Dispositivi", data.dispositivi)}</div></div>`;
}
document.querySelectorAll("#statsSeg button").forEach(b => b.onclick = () => loadStats(+b.dataset.d));
document.querySelectorAll("#nlSeg button").forEach(b => b.onclick = () => loadBrevo(+b.dataset.d));

// menu a comparsa: a sinistra resta una colonna di icone, il tasto Menu la apre con i nomi delle sezioni
const SECTIONS = ["benvenuto", "allievi", "statistiche", "newsletter"], loaded = {};
function openMenu(on){
  const rail = $("#rail"), t = $("#navToggle");
  rail.classList.toggle("open", on); $("#scrim").hidden = !on;
  t.setAttribute("aria-expanded", String(on)); t.title = on ? "Chiudi il menu" : "Apri il menu";
}
// una sezione per volta, scelta dall'indirizzo (#allievi…); le statistiche si caricano la prima volta che le apri
function showSection(){
  const want = location.hash.slice(1), s = SECTIONS.includes(want) ? want : "benvenuto";
  SECTIONS.forEach(x => { $("#s-" + x).hidden = x !== s; });
  document.querySelectorAll("#rail [data-s]").forEach(a => a.dataset.s === s ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  if(s === "statistiche" && !loaded.s){ loaded.s = true; loadStats(statsDays); loadBrevo(nlDays); }
  if(s === "newsletter" && !loaded.n){ loaded.n = true; loadNews(); }
}
$("#navToggle").onclick = () => openMenu(!$("#rail").classList.contains("open"));
$("#scrim").onclick = () => openMenu(false);
document.querySelectorAll("#rail [data-s]").forEach(a => a.addEventListener("click", () => openMenu(false)));
document.addEventListener("keydown", e => { if(e.key === "Escape" && $("#rail").classList.contains("open")){ openMenu(false); $("#navToggle").focus(); } });
window.addEventListener("hashchange", () => { if(!$("#main").hidden){ showSection(); window.scrollTo(0, 0); } });


// ---- Newsletter: si scrivono qui, si mettono in coda e partono da sole al ritmo scelto (tabelle newsletters e newsletter_settings, newsletter-coda.sql)
const DAYS = ["", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"];
let rhythm = {every_weeks: 1, weekday: 2, hour: 9}, letters = [], editing = null, kind = "testo";
$("#rHour").innerHTML = Array.from({length: 24}, (_, h) => `<option value="${h}">${h}:00</option>`).join("");
const UNSUB = /\{\{\s*unsubscribe\s*\}\}/;
const escE = s => esc(s).replace(/'/g, "&#39;");
const safeUrl = u => /^(https?:\/\/|mailto:)/i.test(u) ? u : "https://dojodellecandele.com/";
const okUrl = u => /^(https?:\/\/|mailto:)/i.test(u);
// testo semplice → paragrafi, titoletti, grassetto, link e bottoni, dentro il modello delle email del Dojo (come newsletter/newsletter-01-doji.html)
const TD = "font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#17201C;";
function inline(t){
  return escE(t)
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, a, u) => okUrl(u) ? `<a href="${escE(u.replace(/&amp;/g, "&"))}" style="color:#2C46A6;">${a}</a>` : a);
}
function textToRows(text){
  // un titoletto può stare anche sulla riga subito sopra il suo paragrafo
  return text.replace(/\r/g, "").replace(/^(##\s+.+)\n(?=\S)/gm, "$1\n\n").split(/\n\s*\n/).map(b => b.trim()).filter(Boolean).map(b => {
    let m = b.match(/^##\s+(.+)$/);
    if(m) return `<tr><td style="padding:16px 32px 2px 32px;font-family:Georgia,'Times New Roman',serif;font-size:19px;color:#17201C;">${inline(m[1])}</td></tr>`;
    m = b.match(/^\[\[(.+?)\s*->\s*(\S+)\]\]$/);
    if(m) return `<tr><td style="padding:14px 32px 6px 32px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:#17201C;border-radius:10px;"><a href="${escE(safeUrl(m[2]))}" style="display:inline-block;padding:13px 22px;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;color:#F1F4F0;text-decoration:none;">${escE(m[1])} &rarr;</a></td></tr></table></td></tr>`;
    return `<tr><td style="padding:6px 32px 6px 32px;${TD}">${inline(b).replace(/\n/g, "<br>")}</td></tr>`;
  }).join("");
}
const FOOT = `<tr><td style="padding:22px 32px 28px 32px;font-family:Helvetica,Arial,sans-serif;font-size:12.5px;line-height:1.6;color:#5A6660;border-top:1px solid #EEF1EE;">Ricevi questa email perché ti sei iscritto alla newsletter di KeriGaku. Il Dojo serve a imparare, non dà consigli di investimento. <a href="{{ unsubscribe }}" style="color:#2C46A6;">Disiscriviti</a> con un clic, oppure dalla pagina Account.<br>Inviata da Michele, KeriGaku &middot; <a href="mailto:admin@dojodellecandele.com" style="color:#2C46A6;">admin@dojodellecandele.com</a> &middot; <a href="https://dojodellecandele.com/privacy.html" style="color:#2C46A6;">Privacy</a></td></tr>`;
function wrapEmail(subject, pre, rows){
  return `<!doctype html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escE(subject)}</title></head>
<body style="margin:0;padding:0;background:#F1F4F0;">
${pre ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escE(pre)}</div>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F1F4F0;"><tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background:#FFFFFF;border:1px solid #D7DDD8;border-radius:14px;">
<tr><td style="padding:28px 32px 0 32px;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#5A6660;">KeriGaku &middot; newsletter</td></tr>
<tr><td style="padding:14px 32px 6px 32px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.2;color:#17201C;">${escE(subject)}</td></tr>
${rows}
<tr><td style="padding:6px 32px 6px 32px;${TD}">A presto,<br>Michele &middot; KeriGaku</td></tr>
${FOOT}
</table>
<p style="font-family:Helvetica,Arial,sans-serif;font-size:11.5px;color:#7A857F;margin:14px 0 0 0;">KeriGaku &middot; allenamento sulle formazioni candlestick giapponesi</p>
</td></tr></table>
</body></html>`;
}
// HTML incollato: se manca il link per disiscriversi aggiungo il piè di pagina del Dojo
function withFooter(html){
  if(UNSUB.test(html)) return html;
  const foot = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;margin:0 auto;">${FOOT}</table>`;
  return /<\/body>/i.test(html) ? html.replace(/<\/body>/i, foot + "</body>") : html + foot;
}
function formData(){
  const subject = $("#nlSubject").value.trim(), pre = $("#nlPre").value.trim();
  const content = kind === "testo" ? $("#nlText").value : $("#nlHtml").value;
  if(!subject) return {err: "Scrivi l'oggetto."};
  if(!content.trim()) return {err: kind === "testo" ? "Scrivi il testo." : "Incolla o carica l'HTML."};
  const html = kind === "testo" ? wrapEmail(subject, pre, textToRows(content)) : withFooter(content);
  return {subject, preheader: pre, kind, content, html};
}
function setKind(k){
  kind = k;
  document.querySelectorAll("#nlKind button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.k === k)));
  $("#kTesto").hidden = k !== "testo"; $("#kHtml").hidden = k !== "html";
}
document.querySelectorAll("#nlKind button").forEach(b => b.onclick = () => setKind(b.dataset.k));
$("#nlFile").onchange = e => {
  const f = e.target.files && e.target.files[0]; if(!f) return;
  if(f.size > 300000) return $("#nlErr").textContent = "File troppo grande (massimo 300 kB).";
  const r = new FileReader();
  r.onload = () => {
    const html = String(r.result); $("#nlHtml").value = html;
    // oggetto dal <title> del file, se l'oggetto è ancora vuoto
    const t = html.match(/<title>([^<]*)<\/title>/i);
    if(t && !$("#nlSubject").value.trim()){ const d = document.createElement("textarea"); d.innerHTML = t[1]; $("#nlSubject").value = d.value.trim().slice(0, 150); }
    $("#nlFormMsg").textContent = `Caricato «${f.name}».`;
  };
  r.readAsText(f); e.target.value = "";
};
function formMsg(t, ko){ $("#nlErr").textContent = ko ? t : ""; $("#nlFormMsg").textContent = ko ? "" : t; }
function clearForm(){
  editing = null; $("#nlForm").reset(); $("#nlText").value = ""; $("#nlHtml").value = ""; setKind("testo");
  $("#nlPrevBox").hidden = true; $("#h-edit").textContent = "Nuova newsletter"; formMsg("");
}
$("#nlClear").onclick = clearForm;
$("#nlPreview").onclick = () => {
  const d = formData(); if(d.err) return formMsg(d.err, true);
  formMsg(""); $("#nlFrame").srcdoc = d.html.replace(UNSUB, "#"); $("#nlPrevBox").hidden = false;
};
async function saveLetter(status){
  const d = formData(); if(d.err){ formMsg(d.err, true); return null; }
  const row = {subject: d.subject, preheader: d.preheader, kind: d.kind, content: d.content, html: d.html, status, updated_at: new Date().toISOString()};
  const cur = editing && letters.find(n => n.id === editing);
  // chi entra in coda va in fondo; chi c'era già tiene il suo posto
  if(status === "coda" && !(cur && cur.status === "coda")) row.pos = Date.now() / 1000;
  const q = editing ? sb.from("newsletters").update(row).eq("id", editing).select().single() : sb.from("newsletters").insert(row).select().single();
  const {data, error} = await q;
  if(error){ formMsg("Non salvata: " + error.message, true); return null; }
  return data;
}
$("#nlDraft").onclick = async e => {
  e.target.disabled = true; const n = await saveLetter("bozza"); e.target.disabled = false;
  if(n){ editing = n.id; $("#h-edit").textContent = "Modifica newsletter"; formMsg("Bozza salvata."); loadLetters(); }
};
$("#nlQueue").onclick = async e => {
  e.target.disabled = true; const n = await saveLetter("coda"); e.target.disabled = false;
  if(n){ clearForm(); formMsg(`«${n.subject}» è in coda.`); loadLetters(); }
};
$("#nlTest").onclick = async e => {
  const d = formData(); if(d.err) return formMsg(d.err, true);
  e.target.disabled = true; formMsg("Mando la prova…");
  const {data, error} = await sb.functions.invoke("newsletter", {body: {action: "test", subject: d.subject, html: d.html}});
  e.target.disabled = false;
  if(error || !data || data.error) return formMsg("Prova non mandata: " + (await fnError(error, data, "newsletter") || "errore"), true);
  formMsg(`Prova mandata a ${data.a}: controlla la posta.`);
};

// ritmo
function paintRhythm(){ $("#rEvery").value = String(rhythm.every_weeks); $("#rDay").value = String(rhythm.weekday); $("#rHour").value = String(rhythm.hour); }
$("#rhythmForm").addEventListener("submit", async e => {
  e.preventDefault();
  const v = {every_weeks: +$("#rEvery").value, weekday: +$("#rDay").value, hour: +$("#rHour").value, updated_at: new Date().toISOString()};
  $("#rSave").disabled = true;
  const {error} = await sb.from("newsletter_settings").update(v).eq("id", 1);
  $("#rSave").disabled = false;
  if(error){ $("#rMsg").className = "meta ko"; $("#rMsg").textContent = "Non salvato: " + error.message; return; }
  Object.assign(rhythm, v); $("#rMsg").className = "meta";
  $("#rMsg").textContent = v.every_weeks ? `Salvato: ogni ${v.every_weeks === 1 ? "settimana" : v.every_weeks + " settimane"}, il ${DAYS[v.weekday]} alle ${v.hour}:00.` : "Salvato: invio automatico in pausa.";
  renderLetters();
});
$("#rEvery").onchange = () => { $("#rDay").disabled = $("#rHour").disabled = $("#rEvery").value === "0"; };

// date previste: prossimo giorno e ora del ritmo, non prima di (settimane × 7 − 1) giorni dall'ultima mandata
function plannedDates(count){
  if(!rhythm.every_weeks) return [];
  const sent = letters.filter(n => n.sent_at).map(n => Date.parse(n.sent_at));
  const after = Math.max(Date.now(), sent.length ? Math.max(...sent) + (7 * rhythm.every_weeks - 1) * 86400000 : 0);
  const d = new Date(after); d.setMinutes(0, 0, 0); d.setHours(rhythm.hour);
  while(d.getTime() <= after || ((d.getDay() + 6) % 7) + 1 !== rhythm.weekday) d.setDate(d.getDate() + 1);
  return Array.from({length: count}, (_, i) => new Date(d.getTime() + i * 7 * rhythm.every_weeks * 86400000));
}
const when = d => d.toLocaleDateString("it-IT", {weekday: "short", day: "numeric", month: "short"}) + ", " + d.getHours() + ":00";
const dayTime = s => { const d = new Date(s); return isNaN(d) ? "" : d.toLocaleString("it-IT", {day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"}); };
function renderLetters(){
  const queue = letters.filter(n => n.status === "coda" || n.status === "invio" || n.status === "errore").sort((a, b) => a.pos - b.pos);
  const waiting = queue.filter(n => n.status === "coda"), dates = plannedDates(waiting.length);
  const row = (n, extra, acts) => `<li data-id="${n.id}"><span class="t"><b>${esc(n.subject)}</b><span class="when">${extra}</span></span><span class="acts">${acts}</span></li>`;
  $("#nlQueueList").innerHTML = queue.length ? `<ul class="nl-list">${queue.map(n => {
    if(n.status === "invio") return row(n, "sta partendo…", "");
    if(n.status === "errore") return row(n, "non partita: " + esc(n.error || "errore"), `<button class="btn ghost" data-a="edit">Modifica</button><button class="btn ghost" data-a="requeue">Rimetti in coda</button><button class="btn ghost" data-a="del">Elimina</button>`);
    const i = waiting.indexOf(n);
    return row(n, rhythm.every_weeks ? "partirà " + when(dates[i]) : "in pausa: parte solo con «Manda adesso»",
      `<button class="btn ghost" data-a="up" ${i ? "" : "disabled"} aria-label="Più su">↑</button><button class="btn ghost" data-a="down" ${i < waiting.length - 1 ? "" : "disabled"} aria-label="Più giù">↓</button><button class="btn ghost" data-a="edit">Modifica</button><button class="btn ghost" data-a="send">Manda adesso</button><button class="btn ghost" data-a="del">Elimina</button>`);
  }).join("")}</ul>` : `<p class="empty">La coda è vuota. Scrivi una newsletter qui sopra e premi «Metti in coda».</p>`;
  const drafts = letters.filter(n => n.status === "bozza").sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
  $("#nlDrafts").innerHTML = drafts.length ? `<ul class="nl-list">${drafts.map(n => row(n, "salvata " + dayTime(n.updated_at), `<button class="btn ghost" data-a="edit">Modifica</button><button class="btn ghost" data-a="requeue">Metti in coda</button><button class="btn ghost" data-a="del">Elimina</button>`)).join("")}</ul>` : `<p class="empty">Nessuna bozza.</p>`;
  const sent = letters.filter(n => n.status === "inviata").sort((a, b) => Date.parse(b.sent_at) - Date.parse(a.sent_at));
  $("#nlSent").innerHTML = sent.length ? `<ul class="nl-list">${sent.map(n => row(n, "mandata " + dayTime(n.sent_at), `<button class="btn ghost" data-a="copy">Usa come base</button>`)).join("")}</ul>` : `<p class="empty">Ancora nessuna newsletter mandata da qui.</p>`;
}
function editLetter(n, asNew){
  editing = asNew ? null : n.id; setKind(n.kind || "html");
  $("#nlSubject").value = n.subject; $("#nlPre").value = n.preheader || "";
  $("#nlText").value = n.kind === "testo" ? n.content : ""; $("#nlHtml").value = n.kind === "testo" ? "" : (n.content || n.html);
  $("#h-edit").textContent = asNew ? "Nuova newsletter" : "Modifica newsletter"; $("#nlPrevBox").hidden = true;
  formMsg(asNew ? "Copiata: cambiala e salvala come nuova." : "Stai modificando «" + n.subject + "».");
  $("#h-edit").scrollIntoView({behavior: "smooth", block: "start"});
}
const armed = new WeakMap();
async function letterAction(e){
  const b = e.target.closest("button[data-a]"); if(!b) return;
  const id = +b.closest("li").dataset.id, n = letters.find(x => x.id === id); if(!n) return;
  const a = b.dataset.a;
  if(a === "edit") return editLetter(n, false);
  if(a === "copy") return editLetter(n, true);
  // le azioni che non si annullano chiedono un secondo tocco
  if(a === "send" || a === "del"){
    if(!armed.get(b)){ armed.set(b, b.textContent); b.textContent = a === "send" ? "Tocca di nuovo per mandarla a tutti" : "Tocca di nuovo per eliminarla"; b.classList.add("danger"); setTimeout(() => { if(armed.get(b)){ b.textContent = armed.get(b); armed.delete(b); b.classList.remove("danger"); } }, 5000); return; }
    armed.delete(b);
  }
  b.disabled = true;
  let error = null;
  if(a === "del") ({error} = await sb.from("newsletters").delete().eq("id", id));
  if(a === "requeue") ({error} = await sb.from("newsletters").update({status: "coda", error: null, pos: Date.now() / 1000, updated_at: new Date().toISOString()}).eq("id", id));
  if(a === "up" || a === "down"){
    const waiting = letters.filter(x => x.status === "coda").sort((x, y) => x.pos - y.pos), i = waiting.indexOf(n), o = waiting[a === "up" ? i - 1 : i + 1];
    if(o){ ({error} = await sb.from("newsletters").update({pos: o.pos}).eq("id", n.id)); if(!error) ({error} = await sb.from("newsletters").update({pos: n.pos}).eq("id", o.id)); }
  }
  if(a === "send"){
    const {data, error: err} = await sb.functions.invoke("newsletter", {body: {action: "send", id}});
    if(err || !data || data.error) error = {message: await fnError(err, data, "newsletter") || "errore"};
    else $("#nlFormMsg").textContent = `«${n.subject}» è partita.`;
  }
  if(error) alert("Non riuscito: " + error.message);
  loadLetters();
}
["#nlQueueList", "#nlDrafts", "#nlSent"].forEach(s => $(s).addEventListener("click", letterAction));
async function loadLetters(){
  const {data, error} = await sb.from("newsletters").select("id, subject, preheader, kind, content, html, status, pos, created_at, updated_at, sent_at, error").order("pos");
  if(error){
    const msg = /does not exist|schema cache/i.test(error.message) ? "Manca la tabella delle newsletter: esegui newsletter-coda.sql su Supabase." : "Non riesco a caricare le newsletter: " + error.message;
    $("#nlQueueList").innerHTML = `<p class="empty">${esc(msg)}</p>`; $("#nlDrafts").innerHTML = $("#nlSent").innerHTML = ""; return;
  }
  letters = data || []; renderLetters();
}
async function loadNews(){
  const {data} = await sb.from("newsletter_settings").select("every_weeks, weekday, hour").eq("id", 1).maybeSingle();
  if(data) rhythm = data;
  paintRhythm(); $("#rEvery").onchange();
  await loadLetters();
}

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
  // ogni pallino ha il colore della cintura della figura (scatola di Leitner 0..5)
  const dots = ORDER.map(p => { const b = Math.max(0, Math.min(5, Math.round(num((srs[p[0]] || {}).b)))); return `<i class="k${b}" title="${esc(p[1] + (p[2] ? " +" : " –"))} · cintura ${BELTS[b]}"></i>`; }).join("");
  return {known, fixing, learning, r, w, dots, belts};
}

function gate(title, text, showForm, showMfa){
  $("#main").hidden = true; $("#gate").hidden = false;
  $("#gateTitle").textContent = title; $("#gateText").textContent = text;
  $("#loginForm").hidden = !showForm;
  $("#mfaForm").hidden = !showMfa;
  if(showMfa) $("#mf-code").focus();
  paintWho();
}
function paintWho(){
  const w = $("#who");
  if(!me){ w.innerHTML = `<a href="./">Vai al Dojo</a>`; return; }
  const n = (me.user_metadata && me.user_metadata.username) || me.email.split("@")[0];
  w.innerHTML = `<span>Sei entrato come <b></b></span><a href="./">Vai al Dojo</a><button class="linkbtn" id="out" type="button">Esci</button>`;
  w.querySelector("b").textContent = n;
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
  loadStats(7);
  await load();
}
async function load(){
  const {data, error} = await sb.rpc("admin_list_users");
  if(error){ $("#list").innerHTML = `<p class="empty">Non riesco a caricare gli allievi: ${esc(error.message)}</p>`; return; }
  users = data || [];
  render();
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
    [known, "cinture nere (figure conosciute), in totale"],
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
    <div class="dots" aria-label="Figure: ${s.known} conosciute su ${PL.length}">${s.dots}</div>
    <div class="acts">
      <button class="btn ghost" data-a="pw" type="button">Nuova password</button>
      <button class="btn ghost" data-a="reset" type="button" ${u.progress ? "" : "disabled"}>Azzera progressi</button>
      <button class="btn ghost" data-a="fig" type="button">Impara o dimentica una figura</button>
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
// fa imparare (cintura nera, scatola 5) o dimenticare (torna bianca, nuova) una figura; l'allievo lo vede al prossimo accesso
function askFigure(u, slot){
  const opts = P.map(p => `<option value="${p.id}">${esc(p.name)} ${p.bull ? "▲" : "▼"}</option>`).join("");
  slot.innerHTML = `<div class="confirm"><p></p><select aria-label="Figura">${opts}</select>
    <button class="btn" type="button" data-learn>Segna come imparata</button><button class="btn danger" type="button" data-forget>Fai dimenticare</button><button class="btn ghost" type="button" data-no>Annulla</button></div><p class="msg" role="status"></p>`;
  slot.querySelector("p").textContent = `Scegli una figura per ${u.username}. La modifica arriva sul suo Dojo la prossima volta che lo apre.`;
  const sel = slot.querySelector("select"), msg = slot.querySelector(".msg");
  slot.querySelector("[data-no]").onclick = () => slot.innerHTML = "";
  const go = async learn => {
    const p = P.find(x => x.id === sel.value);
    const {error} = await sb.rpc("admin_force_item", {target: u.id, item: p.id, learn});
    msg.className = error ? "msg ko" : "msg";
    msg.textContent = error ? "Non riuscito: " + (/admin_force_item/.test(error.message) ? "manca la funzione su Supabase (file SQL «figure-forzate»)" : error.message)
      : `${p.name} ${p.bull ? "▲" : "▼"}: ${learn ? "cintura nera, segnata come imparata" : "dimenticata, torna cintura bianca come figura nuova"} per ${u.username}.`;
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
let statsTab = "sito", statsDays = 7;
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
  const box = $("#statsBody");
  box.innerHTML = `<p class="empty">Carico le statistiche della newsletter…</p>`;
  const {data, error} = await sb.functions.invoke("newsletter", {body: {action: "stats", days}});
  if(statsTab !== "brevo") return;
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
async function loadStats(days){
  statsDays = days;
  document.querySelectorAll("#statsSeg button").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.d === days)));
  if(statsTab === "brevo") return loadBrevo(days);
  const box = $("#statsBody");
  box.innerHTML = `<p class="empty">Carico le statistiche…</p>`;
  const {data, error} = await sb.functions.invoke("statistiche", {body: {days}});
  if(statsTab !== "sito") return;
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
  const days_ = (data.perGiorno || []).map(d => ({data: String(d.data || ""), v: n(d.visualizzazioni)}));
  const max = Math.max(1, ...days_.map(d => d.v)), W = 600, H = 120, bw = days_.length ? W / days_.length : W;
  const bars = days_.map((d, i) => { const h = Math.round((H - 4) * d.v / max); return `<rect x="${(i * bw + 1).toFixed(1)}" y="${H - h}" width="${Math.max(1, bw - 2).toFixed(1)}" height="${h}"><title>${esc(d.data)}: ${d.v}</title></rect>`; }).join("");
  const lab = days_.length ? `<div class="chart-dates"><span>${esc(days_[0].data)}</span><span>${esc(days_[days_.length - 1].data)}</span></div>` : "";
  const list = (t, rows, fmt = r => esc(r.nome)) => `<div><h3>${t}</h3>${(rows || []).length ? `<ol>${rows.map(r => `<li><span>${fmt(r)}</span><span>${n(r.visualizzazioni)}</span></li>`).join("")}</ol>` : `<p class="empty" style="padding:6px 0;text-align:left">Ancora niente.</p>`}</div>`;
  box.innerHTML = `<div style="display:grid;gap:14px;grid-template-columns:minmax(0,1fr)">
    <div class="tiles"><div class="panel tile"><span class="v">${n(data.visite)}</span><span class="l">visite</span></div><div class="panel tile"><span class="v">${n(data.visualizzazioni)}</span><span class="l">pagine viste</span></div></div>
    ${days_.length > 1 ? `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Pagine viste per giorno">${bars}</svg>${lab}` : ""}
    <div class="lists">${list("Pagine più viste", data.pagine)}${list("Da dove arrivano", data.provenienza)}${list("Paesi", data.paesi, countryHTML)}${list("Dispositivi", data.dispositivi)}</div></div>`;
}
document.querySelectorAll("#statsSeg button").forEach(b => b.onclick = () => loadStats(+b.dataset.d));
document.querySelectorAll("#statsTab button").forEach(b => b.onclick = () => {
  statsTab = b.dataset.t;
  document.querySelectorAll("#statsTab button").forEach(x => { x.setAttribute("aria-pressed", String(x === b)); x.setAttribute("aria-selected", String(x === b)); });
  loadStats(statsDays);
});

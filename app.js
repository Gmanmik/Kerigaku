const BYID = Object.fromEntries(P.map(p => [p.id, p]));
const GEAR = `<svg class="gear" viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round" fill-rule="evenodd" d="M20.05 10.44 L22.91 10.56 L22.91 13.44 L20.05 13.56 L19.58 15.14 L18.80 16.59 L20.73 18.70 L18.70 20.73 L16.59 18.80 L15.14 19.58 L13.56 20.05 L13.44 22.91 L10.56 22.91 L10.44 20.05 L8.86 19.58 L7.41 18.80 L5.30 20.73 L3.27 18.70 L5.20 16.59 L4.42 15.14 L3.95 13.56 L1.09 13.44 L1.09 10.56 L3.95 10.44 L4.42 8.86 L5.20 7.41 L3.27 5.30 L5.30 3.27 L7.41 5.20 L8.86 4.42 L10.44 3.95 L10.56 1.09 L13.44 1.09 L13.56 3.95 L15.14 4.42 L16.59 5.20 L18.70 3.27 L20.73 5.30 L18.80 7.41 L19.58 8.86ZM15.4 12a3.4 3.4 0 1 0 -6.8 0a3.4 3.4 0 1 0 6.8 0Z"/></svg> `;
const ROUND = 10;

/* ---------- livelli e figure aperte: al livello 1 sono aperte le 20 figure più note, il livello 2 ne apre altre 24 e il 3 le ultime 22.
   I livelli salgono con le risposte giuste (vedi LEVELS); le figure già studiate restano sempre aperte. La Prova del Dojo si apre dal livello 2. */
const FIG_GROUPS = [
  ["hammer_p","hanging_m","invhammer_p","shooting_m","engulf_p","engulf_m","harami_p","harami_m","haramix_p","haramix_m",  "piercing_p","darkcloud_m","dojistar_p","dojistar_m","mstar_p","estar_m","mdoji_p","edoji_m","3soldiers_p","3crows_m"],
  ["belthold_p","belthold_m","seplines_p","seplines_m","rising3_p","falling3_m","matchlow_p","matchhigh_m",
    "3inside_p","3inside_m","3outside_p","3outside_m","abandoned_p","abandoned_m","uptasuki_p","dntasuki_m",
    "onneck_p","onneck_m","inneck_p","inneck_m","meeting_p","meeting_m","kicking_p","kicking_m"],
  ["tristar_p","tristar_m","breakaway_p","breakaway_m","3strike_p","3strike_m","upgap3m_p","dngap3m_m",
    "ladderbot_p","laddertop_m","sbswhite_p","sbswhite_m","homing_p","deliberation_m","advblock_m","sandwich_p",
    "u3river_p","upgap2crows_m","3stars_p","ident3crows_m","swallow_p","2crows_m"]
];
const LEVEL_GROUP = [0, 1, 2, 2], PROVA_LEVEL = 1;      // quale gruppo apre ogni livello
const GROUP_OF = {}; FIG_GROUPS.forEach((g, i) => g.forEach(id => GROUP_OF[id] = i));
const LEVEL_FOR_GROUP = LEVEL_GROUP.map((g, i) => i).filter((i, k) => k === 0 || LEVEL_GROUP[k] > LEVEL_GROUP[k - 1]);   // primo livello che apre ogni gruppo

/* ---------- storage (best effort) ---------- */
const store = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};
// ogni utente ha la sua copia locale (chiave + ":" + id); senza account la chiave è quella semplice
let space = "";
const K = k => k + space;
const PREFS0 = {tab:"f2n", fam:"all", ans:"btn", hl:true, sfilter:"all", provaBest:0};
let stats = store.get(K("dojo-stats-v1"), {});
let prefs = Object.assign({}, PREFS0, store.get(K("dojo-prefs-v1"), {}));
function savePrefs(){ store.set(K("dojo-prefs-v1"), prefs); cloud.schedule(); }
function saveStats(){ store.set(K("dojo-stats-v1"), stats); cloud.schedule(); }
if(!prefs.srsSeen){ prefs.mode = "srs"; prefs.srsSeen = true; }
/* ---------- account: login su Supabase ----------
   Ci si registra con username, email e password; l'email riceve un codice a 6 cifre
   che conferma l'account. Chi si è registrato prima delle email ha un indirizzo
   interno <username>@USER_DOMAIN: entra con lo username e può aggiungere l'email
   dalla pagina Account. I progressi stanno nella tabella progress, una riga per
   utente, protetta da regole che fanno leggere e scrivere a ciascuno solo la
   propria (schema.sql, account.sql). Sul dispositivo resta una copia per ogni
   utente, più quella di chi usa il Dojo senza account. */
const CFG = window.DOJO_CONFIG || {};
const USER_DOMAIN = "utenti.dojo-delle-candele.app";
const isLegacy = email => !email || email.endsWith("@" + USER_DOMAIN);
/* controllo anti-robot di Cloudflare Turnstile, attivo solo se config.js ha turnstileSiteKey.
   Ogni gettone vale una volta sola: dopo l'uso il widget ne prepara subito un altro. */
const captcha = (() => {
  const key = CFG.turnstileSiteKey;
  let id = null, el = null, token = "", waiters = [];
  if(key){
    window.dojoTurnstile = () => mount(el);
    const sc = document.createElement("script");
    sc.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=dojoTurnstile"; sc.async = true;
    document.head.appendChild(sc);
  }
  function mount(box){
    el = box; token = "";
    if(id !== null && window.turnstile){ try{ turnstile.remove(id); }catch(e){} id = null; }
    if(!key || !box || !window.turnstile || !box.isConnected) return;
    id = turnstile.render(box, {sitekey: key, size: "flexible", appearance: "interaction-only", language: "it",
      theme: document.documentElement.dataset.theme || "auto",
      callback: t => { token = t; waiters.splice(0).forEach(f => f(t)); },
      "expired-callback": () => { token = ""; }, "error-callback": () => { token = ""; }});
  }
  async function take(){
    if(!key) return undefined;
    if(!window.turnstile) throw "Il controllo anti-robot non si è caricato: ricarica la pagina.";
    const t = token || await new Promise((res, rej) => { waiters.push(res); setTimeout(() => rej("Completa il controllo anti-robot qui sotto, poi riprova."), 10000); });
    token = ""; if(id !== null) try{ turnstile.reset(id); }catch(e){}
    return t;
  }
  return {mount, take};
})();
const cloud = (() => {
  const ready = !!(window.supabase && CFG.supabaseUrl && CFG.supabaseAnonKey && !/INSERISCI/.test(CFG.supabaseUrl + CFG.supabaseAnonKey));
  const sb = ready ? window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey) : null;
  let user = null, state = ready ? "guest" : "local", timer = 0, writing = false, dirty = false, lastErr = "";
  const uname = u => (u && u.user_metadata && u.user_metadata.username) || (u && u.email ? u.email.split("@")[0] : "");
  const payload = () => Object.assign({v:1, srs, stats, daily, prefs, resetAt: resetSeen}, window.Scenari ? Scenari.data() : {});
  function paint(s){
    if(s) state = s;
    const box = $("#acct"); if(!box) return;
    const dot = {ok:"ok", saving:"busy", loading:"busy", error:"ko"}[state] || "";
    const msg = {
      local: !window.supabase ? "Login non attivo: la libreria di Supabase non si è caricata" : "Login non attivo: inserisci URL e chiave di Supabase in config.js",
      guest: "Senza account: progressi salvati solo su questo dispositivo",
      loading: "Carico i tuoi progressi…",
      saving: "Salvataggio…",
      ok: "Progressi salvati nel tuo account",
      error: "Non riesco a salvare online: riprovo alla prossima risposta"
    }[state];
    box.innerHTML = `<span class="who noav"><span class="st ${dot}"></span><span class="txt">${user ? "<b></b> · " : ""}<span class="m"></span></span></span>` +
      (ready ? (user ? `<button class="linkbtn" id="accountBtn">${GEAR}Impostazioni</button>` : `<button class="linkbtn" id="loginBtn">Accedi o registrati</button>`) : "") +
      `<button class="linkbtn" id="settingsBtn"${user ? " hidden" : ""} aria-label="Impostazioni">${GEAR}</button>`;
    if(user) box.querySelector("b").textContent = uname(user);
    box.querySelector(".m").textContent = msg + (state === "error" && lastErr ? ` (${lastErr})` : "");
    const ab = $("#accountBtn"); if(ab) ab.onclick = showAccount;
    const sb2 = $("#settingsBtn"); if(sb2) sb2.onclick = showAccount;
    const li = $("#loginBtn"); if(li) li.onclick = () => showAuth("in");
  }
  async function flush(){
    clearTimeout(timer); timer = 0;
    if(!user) return;
    if(writing){ dirty = true; return; }
    writing = true; dirty = false; paint("saving");
    const {error} = await sb.from("progress").upsert({user_id: user.id, data: payload(), updated_at: new Date().toISOString()});
    if(error && await recover(error)){ writing = false; return; }
    if(!error) lastErr = "";
    paint(error ? "error" : "ok");
    writing = false;
    if(dirty && user) flush();
  }
  function schedule(){ if(!user) return; clearTimeout(timer); timer = setTimeout(flush, 700); }
  // unisce i progressi del server con quelli locali: per ogni figura vince quella più avanti
  // i dati arrivano dal server: tiene solo le figure conosciute e solo numeri
  const num = v => Number.isFinite(+v) ? +v : 0;
  function clean(r){
    const srs = {}, stats = {}, ids = new Set(P.map(p => p.id));
    for(const [id, c] of Object.entries(r.srs || {})) if(ids.has(id) && c) srs[id] = {b: num(c.b), due: num(c.due)};
    for(const [id, c] of Object.entries(r.stats || {})) if(ids.has(id) && c) stats[id] = {r: num(c.r), w: num(c.w)};
    const d = r.daily || {};
    return {srs, stats, daily: {day: num(d.day), newCount: num(d.newCount)}, prefs: r.prefs && typeof r.prefs === "object" ? r.prefs : null, resetAt: num(r.resetAt)};
  }
  function merge(raw){
    let changed = false;
    const r = clean(raw);
    // azzerato su un altro dispositivo: prima cancello qui; azzerato qui ma non ancora salvato: ignoro i vecchi dati del server
    if(r.resetAt > resetSeen){ wipeProgress(r.resetAt); }
    else if(r.resetAt < resetSeen){ r.srs = {}; r.stats = {}; r.daily = {day:0, newCount:0}; r.prefs = null; raw = {}; changed = true; }
    const rs = r.srs, out = Object.assign({}, rs);
    for(const [id, c] of Object.entries(srs)){
      const o = rs[id];
      if(!o || c.b > o.b || (c.b === o.b && c.due > o.due)){ out[id] = c; changed = true; }
    }
    const rst = r.stats || {}, st = Object.assign({}, rst);
    for(const [id, c] of Object.entries(stats)){
      const o = rst[id] || {r:0, w:0};
      const m = {r: Math.max(o.r, c.r), w: Math.max(o.w, c.w)};
      if(m.r !== o.r || m.w !== o.w) changed = true;
      st[id] = m;
    }
    let d = r.daily || {day:0, newCount:0};
    if(daily.day > d.day || (daily.day === d.day && daily.newCount > d.newCount)){ d = daily; changed = true; }
    srs = out; stats = st; daily = d;
    if(r.prefs) for(const k of Object.keys(prefs)) if(k in r.prefs && typeof r.prefs[k] === typeof prefs[k]) prefs[k] = r.prefs[k];
    saveLocal();
    if(window.Scenari && Scenari.merge(raw)) changed = true;
    return changed;
  }
  // il database ha rifiutato: l'accesso può essere scaduto, o la 2FA è stata attivata dopo questo accesso
  async function recover(err, loading){
    lastErr = (err && err.message) || "";
    const r = await sb.auth.refreshSession();
    if(r.error || !r.data.session){ await sb.auth.signOut().catch(() => {}); user = null; setSpace(null); paint("guest"); showAuth("in"); return true; }
    if(await needsMfa()){ if(loading) user = null; showAuth("mfa"); return true; }
    return false;
  }
  // dopo la password: se l'account ha la verifica in due passaggi, chiede il codice dell'app
  async function needsMfa(){
    const {data} = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
    return !!data && data.nextLevel === "aal2" && data.currentLevel !== "aal2";
  }
  async function enter(u){
    if(await needsMfa()) return showAuth("mfa");
    if(user && user.id === u.id){ goHome(); schedule(); return; }
    const guest = {srs, stats, daily};
    user = u; setSpace(u.id); paint("loading");
    nlSync(u);
    const {data, error} = await sb.from("progress").select("data").eq("user_id", u.id).maybeSingle();
    if(error){ if(await recover(error, true)) return; paint("error"); }
    else if(data){ if(merge(data.data || {})) flush(); else paint("ok"); }
    else {
      // primo accesso: porta nell'account quello che hai fatto senza account
      merge(guest); flush();
    }
    // figure imposte dall'admin (la tabella può non esserci ancora: in quel caso non succede nulla)
    const fz = await sb.from("progress_forced").select("item, box, t").eq("user_id", u.id);
    if(!fz.error && applyForced(fz.data)) flush();
    goHome();
  }
  async function logout(){
    if(timer) await flush();
    await sb.auth.signOut();
    user = null; setSpace(null); paint("guest"); goHome();
  }
  async function deleteAccount(){
    clearTimeout(timer); timer = 0; dirty = false;
    await sb.functions.invoke("newsletter", {body: {action: "delete_self"}}).catch(() => {});   // toglie il contatto da Brevo prima che l'account sparisca
    const {error} = await sb.rpc("delete_my_account");
    if(error){ await sb.functions.invoke("newsletter", {body: {action: "sync"}}).catch(() => {}); throw error; }   // non è stato eliminato: rimetto il contatto com'era
    try{ const sfx = ":" + user.id; Object.keys(localStorage).filter(k => k.endsWith(sfx)).forEach(k => localStorage.removeItem(k)); }catch(e){}   // via anche la copia locale dei progressi
    await sb.auth.signOut().catch(() => {});
    user = null; setSpace(null); paint("guest"); goHome();
  }
  function errText(e){
    const m = (e && e.message || "").toLowerCase();
    if(m.includes("captcha")) return "Il controllo anti-robot non è passato: riprova tra qualche secondo.";
    if(m.includes("invalid login")) return "Username, email o password sbagliati.";
    if(m.includes("banned")) return "Questo account è sospeso. Per informazioni scrivi ad admin@dojodellecandele.com.";
    if(m.includes("troppi tentativi")) return "Troppi tentativi sbagliati con questo username: riprova tra 15 minuti o entra con l'email.";
    if(m.includes("already registered") || m.includes("already been registered")) return "Questa email ha già un account: prova ad accedere.";
    if(m.includes("database error saving new user")) return "Questo username è già preso o non è valido: scegline un altro.";
    if(m.includes("token has expired") || m.includes("invalid") && m.includes("otp") || m.includes("token")) return "Codice sbagliato o scaduto: controlla l'ultima email o fattene mandare un altro.";
    if(m.includes("rate limit") || m.includes("security purposes")) return "Troppe richieste in poco tempo: aspetta un minuto e riprova.";
    if(m.includes("should be different")) return "La nuova password deve essere diversa da quella attuale.";
    if(m.includes("aal2")) return "Prima inserisci il codice della tua app di autenticazione.";
    if(m.includes("password")) return "La password deve avere almeno 8 caratteri, con lettere e numeri.";
    if(m.includes("email") && m.includes("invalid")) return "Questo indirizzo email non sembra valido.";
    return "Qualcosa non ha funzionato: " + (e && e.message || "riprova tra poco.");
  }
  const must = async p => { const {data, error} = await p; if(error) throw errText(error); return data; };
  window.addEventListener("pagehide", () => { if(timer) flush(); });
  // con lo username chiede al database l'email dell'account, che arriva solo se la password è giusta (login.sql)
  async function toLogin(id, pw){
    if(id.includes("@")) return id;
    const {data, error} = await sb.rpc("login_email", {u: id, pw});
    if(error) throw errText(error);
    if(!data) throw errText({message: "invalid login"});
    return data;
  }
  return {
    get ready(){ return ready; }, get on(){ return !!user; }, get user(){ return user; }, sb, schedule, flush, logout, deleteAccount, errText,
    async signIn(id, pw){
      const email = await toLogin(id, pw);
      const {data, error} = await sb.auth.signInWithPassword({email, password: pw, options: {captchaToken: await captcha.take()}});
      if(error){ if(/email not confirmed/i.test(error.message)){ AUTH.email = email; await this.resendSignup(email); return paintAuth("code"); } throw errText(error); }
      await enter(data.user);
    },
    async signUp(name, email, pw, marketing){
      const free = await must(sb.rpc("username_available", {u: name}));
      if(!free) throw "Questo username è già preso: scegline un altro.";
      const d = await must(sb.auth.signUp({email, password: pw, options: {data: {username: name, marketing: !!marketing}, captchaToken: await captcha.take()}}));
      if(d.session) await enter(d.user);   // conferma email disattivata
      return !d.session;
    },
    async verifySignup(email, code){ const d = await must(sb.auth.verifyOtp({email, token: code, type: "signup"})); await enter(d.user); },
    resendSignup: async email => must(sb.auth.resend({type: "signup", email, options: {captchaToken: await captcha.take()}})),
    sendReset: async email => must(sb.auth.resetPasswordForEmail(email, {captchaToken: await captcha.take()})),
    // prima di cambiare password chiede al database se è una di quelle già usate (password.sql); se la funzione non c'è, va avanti
    async setPassword(pw){
      const {data: used, error} = await sb.rpc("password_used_before", {pw});
      if(!error && used) throw "Hai già usato questa password: scegline una nuova.";
      await must(sb.auth.updateUser({password: pw}));
    },
    async resetWithCode(email, code, pw){
      const d = await must(sb.auth.verifyOtp({email, token: code, type: "recovery"}));
      if(await needsMfa()) return "mfa";   // con la verifica in due passaggi la password si cambia dopo il codice dell'app
      await this.setPassword(pw);
      await enter(d.user);
    },
    async verifyMfa(code, newPw){
      const f = await must(sb.auth.mfa.listFactors());
      const totp = (f.totp || [])[0]; if(!totp) throw "Nessuna app di autenticazione collegata a questo account.";
      await must(sb.auth.mfa.challengeAndVerify({factorId: totp.id, code}));
      if(newPw) await this.setPassword(newPw);
      const {data} = await sb.auth.getUser(); await enter(data.user);
    },
    async init(){
      paint();
      if(!ready) return;
      const {data} = await sb.auth.getSession();
      if(data.session) await enter(data.session.user);
      else if(!store.get("dojo-guest", false)) showLanding();
      sb.auth.onAuthStateChange((ev, s) => {
        if(ev === "SIGNED_OUT" && user){ user = null; setSpace(null); paint("guest"); goHome(); }
        if(ev === "USER_UPDATED" && s && user){ user = s.user; paint(); }
      });
    }
  };
})();

/* ---------- ripasso a intervalli (Leitner) ---------- */
const INT = [0, 1, 3, 7, 16, 35];          // giorni di attesa per ogni scatola
const NEW_PER_DAY = 5, SRS_MAX = 20, PER_SESSION = [5, 10, 15, 20];
// ogni scatola di Leitner è una cintura: dalla bianca (mai vista) alla nera (la conosci, torna ogni 35 giorni)
const BELTS = ["bianca", "gialla", "arancione", "verde", "blu", "nera"];
const BELTS_PL = ["bianche", "gialle", "arancioni", "verdi", "blu", "nere"];
const beltName = b => "Cintura " + BELTS[b];
const perSession = () => PER_SESSION.includes(+prefs.perSession) ? +prefs.perSession : SRS_MAX;
const everyText = b => b === 0 ? "Non l'hai ancora incontrata in Studia e ripassa" : INT[b] === 1 ? "Torna ogni giorno" : `Torna ogni ${INT[b]} giorni`;
const BELT_SVG = b => `<svg class="belt k${b}" viewBox="0 0 34 16" aria-hidden="true"><rect x="1" y="4.5" width="32" height="5" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><path d="M15 10.5l-3.5 4.5h3.5l2-3zM19 10.5l3.5 4.5H19l-2-3z"/></svg>`;
let srs = store.get(K("dojo-srs-v1"), {});    // id -> {b: scatola 0..5, due: giorno}
let daily = store.get(K("dojo-daily-v1"), {day:0, newCount:0});
// azzeramenti e figure imposte dall'admin: ricordo l'ultimo visto, così un altro dispositivo non riporta indietro i vecchi progressi
let resetSeen = store.get(K("dojo-reset-v1"), 0), forcedSeen = store.get(K("dojo-forced-v1"), {});
function loadLocal(){
  stats = store.get(K("dojo-stats-v1"), {});
  prefs = Object.assign({}, PREFS0, store.get(K("dojo-prefs-v1"), {}), {srsSeen:true});
  srs = store.get(K("dojo-srs-v1"), {});
  daily = store.get(K("dojo-daily-v1"), {day:0, newCount:0});
  resetSeen = store.get(K("dojo-reset-v1"), 0); forcedSeen = store.get(K("dojo-forced-v1"), {});
  if(window.Scenari) Scenari.load();
}
function saveLocal(){ store.set(K("dojo-srs-v1"), srs); store.set(K("dojo-daily-v1"), daily); store.set(K("dojo-stats-v1"), stats); store.set(K("dojo-prefs-v1"), prefs); }
// azzera tutti i progressi (ripasso, statistiche, scenari, livello); "at" è il momento dell'azzeramento
function wipeProgress(at){
  srs = {}; stats = {}; daily = {day:0, newCount:0}; forcedSeen = {};
  prefs.provaBest = 0;
  resetSeen = at; store.set(K("dojo-reset-v1"), at); store.set(K("dojo-forced-v1"), forcedSeen);
  if(window.Scenari) Scenari.reset();
  saveLocal();
}
// figure fatte imparare (box 5) o dimenticare (box 0) dall'admin, dalla tabella progress_forced
function applyForced(rows){
  let changed = false;
  for(const r of rows || []){
    const t = Date.parse(r.t) || 0, id = r.item;
    if(!BYID[id] || t <= (forcedSeen[id] || 0) || t <= resetSeen) continue;
    const b = Math.max(0, Math.min(5, +r.box || 0));
    if(b > 0) srs[id] = {b, due: today() + INT[b]}; else delete srs[id];
    forcedSeen[id] = t; changed = true;
  }
  if(changed){ store.set(K("dojo-forced-v1"), forcedSeen); saveLocal(); }
  return changed;
}
function setSpace(id){ space = id ? ":" + id : ""; loadLocal(); }
const today = () => { const d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000); };
const sc = id => srs[id] || {b:0, due:0};
function saveSrs(){ store.set(K("dojo-srs-v1"), srs); store.set(K("dojo-daily-v1"), daily); cloud.schedule(); }
function newLeft(){ const t = today(); if(daily.day !== t) daily = {day:t, newCount:0}; return Math.max(0, NEW_PER_DAY - daily.newCount); }
function grade(id, ok, relearn){
  const c = Object.assign({b:0, due:0}, srs[id]);
  c.b = ok ? (relearn ? 1 : Math.min(5, c.b + 1)) : 1;
  c.due = today() + (ok ? INT[c.b] : 0);
  srs[id] = c; saveSrs(); return c;
}
function srsQueue(){
  const t = today(), list = openP().filter(p => prefs.fam === "all" || p.fam === prefs.fam), max = perSession();
  // prima le figure da ripassare, poi le nuove; in tutto non più di quante ne hai scelte nelle Impostazioni
  const due = list.filter(p => sc(p.id).b > 0 && sc(p.id).due <= t).sort((a, b) => sc(a.id).due - sc(b.id).due).slice(0, max);
  const fresh = list.filter(p => sc(p.id).b === 0).slice(0, Math.min(newLeft(), max - due.length));
  return {due, fresh};
}
// quando arriva una figura mai vista in Studia e ripassa (se ripassi ogni giorno): "oggi", "domani", "tra 3 giorni"
function arrivalText(id){
  const list = openP().filter(p => prefs.fam === "all" || p.fam === prefs.fam).filter(p => sc(p.id).b === 0);
  const k = list.findIndex(p => p.id === id);
  if(k < 0) return "Arriva quando alleni anche la sua famiglia";
  const perDay = Math.max(1, Math.min(NEW_PER_DAY, perSession())), left = newLeft();
  return "Arriva " + whenText(today() + (k < left ? 0 : 1 + Math.floor((k - left) / perDay)));
}
function whenText(day){
  const d = day - today();
  if(d <= 0) return "oggi";
  if(d === 1) return "domani";
  if(d < 7) return `tra ${d} giorni`;
  if(d < 14) return "tra una settimana circa";
  if(d < 28) return `tra ${Math.round(d / 7)} settimane`;
  return "tra un mese circa";
}
function nextDueDay(){
  const ds = Object.values(srs).filter(c => c.b > 0).map(c => c.due);
  return ds.length ? Math.min(...ds) : null;
}
const learnedFig = id => sc(id).b >= 2;
// gruppo di figure aperto dal livello raggiunto
function groupNow(){ return LEVEL_GROUP[levelInfo().i]; }
// aperta: compresa nel gruppo del livello raggiunto, oppure già studiata
const isOpen = (p, gi = groupNow()) => GROUP_OF[p.id] <= gi || sc(p.id).b > 0;
function openP(){ const gi = groupNow(); return P.filter(p => isOpen(p, gi)); }
const provaOpen = () => levelInfo().i >= PROVA_LEVEL;

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const esc = s => s.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const rnd = (a, b) => a + Math.random() * (b - a);
const shuffle = a => { for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const dirWord = p => p.bull ? "rialzista" : "ribassista";
const label = p => `${p.name} ${p.bull ? "+" : "–"}`;
const chipDir = p => `<span class="chip ${p.bull?"bull":"bear"}">${p.bull?"▲ rialzo":"▼ ribasso"}</span>`;
const chipN = p => `<span class="chip n">${p.n} candel${p.n===1?"a":"e"}</span>`;
const famName = f => f === "inv" ? "Inversione" : "Continuazione";

/* ---------- chart drawing ---------- */
// candle: [kind, low, bodyBottom, bodyTop, high]
function makeContext(p){
  if(!p.trend) return [];
  const m = 3, out = [];
  const f = p.c[0];
  const R = Math.max(...p.c.map(c => c[4])) - Math.min(...p.c.map(c => c[1]));
  const k = Math.max(.8, Math.min(1.6, R / 40));
  for(let i = m; i >= 1; i--){
    const size = rnd(5, 9) * k, step = rnd(8, 11) * k;
    let bot, top, kind;
    if(p.trend === "d"){
      bot = f[4] + rnd(2, 5) + (i - 1) * step; top = bot + size;
      kind = Math.random() < .78 ? "b" : "w";
    } else {
      top = f[1] - rnd(2, 5) - (i - 1) * step; bot = top - size;
      kind = Math.random() < .78 ? "w" : "b";
    }
    out.push([kind, bot - rnd(.8, 3.5), bot, top, top + rnd(.8, 3.5)]);
  }
  return out;
}

function chartSVG(p, o = {}){
  const ctx = o.context || [];
  const all = ctx.concat(p.c);
  const n = all.length;
  const arrow = o.arrow && p.trend;
  const W = o.w || 320, H = o.h || 200, padX = 18, padY = 16;
  const arrW = arrow ? 42 : 0;
  let lo = Math.min(...all.map(c => c[1])), hi = Math.max(...all.map(c => c[4]));
  if(arrow){ if(p.trend==="d") hi = Math.max(hi, p.c[0][4] + 30); else lo = Math.min(lo, p.c[0][1] - 30); }
  const slot = Math.min(o.maxSlot || 36, (W - 2*padX - arrW) / Math.max(n, 1));
  const groupW = arrW + slot * n;
  const x0 = (W - groupW) / 2 + arrW + slot / 2;
  const s = (H - 2*padY) / Math.max(hi - lo, 20);
  const yOff = padY + ((H - 2*padY) - (hi - lo) * s) / 2;
  const Y = v => H - yOff - (v - lo) * s;
  const bw = Math.max(4, Math.min(o.maxBody || 16, slot * .58));
  const sw = Math.max(1.2, Math.min(2, bw / 8));
  let g = "";
  // faint horizontal grid
  for(let i=1;i<5;i++){ const y = (H*i/5).toFixed(1); g += `<line x1="0" x2="${W}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-width="1" stroke-dasharray="2 4" opacity=".7"/>`; }
  if(o.hl && ctx.length){
    const xa = x0 + ctx.length*slot - slot/2 + 2, xb = x0 + (n-1)*slot + slot/2 - 2;
    g += `<rect x="${xa.toFixed(1)}" y="3" width="${(xb-xa).toFixed(1)}" height="${H-6}" rx="7" fill="var(--hl)" stroke="var(--hl-line)" stroke-width="1" stroke-dasharray="3 3"/>`;
  }
  if(arrow){
    const f = p.c[0];
    const a = p.trend === "d" ? [f[4] + 28, f[4] + 4] : [f[1] - 28, f[1] - 4];
    const xs = x0 - arrW - slot*.15, xe = x0 - slot*.45;
    const ys = Y(a[0]), ye = Y(a[1]);
    const ang = Math.atan2(ye - ys, xe - xs), hd = 7;
    g += `<line x1="${xs.toFixed(1)}" y1="${ys.toFixed(1)}" x2="${(xe-hd*.7*Math.cos(ang)).toFixed(1)}" y2="${(ye-hd*.7*Math.sin(ang)).toFixed(1)}" stroke="var(--muted)" stroke-opacity=".55" stroke-width="2.4" stroke-linecap="round"/>`;
    g += `<polygon points="${xe},${ye} ${xe-hd*Math.cos(ang-.45)},${ye-hd*Math.sin(ang-.45)} ${xe-hd*Math.cos(ang+.45)},${ye-hd*Math.sin(ang+.45)}" fill="var(--muted)" fill-opacity=".55"/>`;
  }
  all.forEach((c, i) => {
    const cx = x0 + i*slot, [k, l, b, t, h] = c;
    if(k === "d"){
      g += `<line x1="${cx}" x2="${cx}" y1="${Y(h)}" y2="${Y(l)}" stroke="${o.mono ? "var(--line2)" : "var(--doji)"}" stroke-width="${sw}"/>`;
      g += `<line x1="${cx-bw*.62}" x2="${cx+bw*.62}" y1="${Y(b)}" y2="${Y(b)}" stroke="${o.mono ? "var(--line2)" : "var(--doji)"}" stroke-width="${sw*1.1}"/>`;
      return;
    }
    const col = o.mono ? "var(--line2)" : k === "w" ? "var(--bull)" : "var(--bear)";   // mono: figura chiusa, nessun indizio dal colore
    g += `<line x1="${cx}" x2="${cx}" y1="${Y(h)}" y2="${Y(l)}" stroke="${col}" stroke-width="${sw}"/>`;
    const yt = Y(t), hh = Math.max(1.6, (t - b) * s);
    g += `<rect x="${(cx-bw/2).toFixed(1)}" y="${yt.toFixed(1)}" width="${bw.toFixed(1)}" height="${hh.toFixed(1)}" rx="1.5" fill="${col}"/>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.aria || "Grafico a candele")}">${g}</svg>`;
}


/* ---------- views & menu ---------- */
let view = "home";
const MODE_TITLE = {srs:"Studia e ripassa", studia:"Studia", f2n:"Figura → Nome", n2f:"Nome → Figura", scen:"Scenari", prova:"La Prova del Dojo"};
function setTab(t){
  leaveLanding();
  view = t; if(t !== "studia"){ prefs.mode = t; savePrefs(); }
  $("#view-home").hidden = true; $("#view-auth").hidden = true; $("#view-account").hidden = true;
  $("#bar").hidden = false;
  $("#barTitle").textContent = MODE_TITLE[t];
  const famTxt = {all:"Tutte le famiglie", inv:"Solo inversione", cont:"Solo continuazione"}[prefs.fam];
  $("#barCfg").innerHTML = t === "studia" || t === "scen" || t === "prova" ? "" : t === "srs" ? `<span class="chip n">${famTxt}</span><span class="chip n">${prefs.hl ? "Figura evidenziata" : "Senza aiuto"}</span>` :
    `<span class="chip n">${famTxt}</span>` +
    `<span class="chip n">${prefs.hl ? "Figura evidenziata" : "Senza aiuto"}</span>`;
  $("#view-studia").hidden = t !== "studia";
  $("#view-quiz").hidden = t === "studia";
  heroAnim.stop();
  window.scrollTo({top:0});
  if(t === "studia") renderStudy(); else if(t === "scen") Scenari.round(); else if(t === "prova") Prova.start(); else newRound(t);
}
function curMode(){ return Q && Q.mode === "srs" ? Q.dirs[Q.i] : Q && Q.mode; }
function goHome(){
  leaveLanding();
  view = "home";
  $("#view-auth").hidden = true; $("#view-account").hidden = true;
  syncControls();
  $("#view-home").hidden = false; $("#bar").hidden = true;
  $("#view-studia").hidden = true; $("#view-quiz").hidden = true;
  renderHome(); heroAnim.start();
  window.scrollTo({top:0});
}
$("#backBtn").onclick = goHome;

function selectMode(m, quiet){
  prefs.mode = m; if(!quiet) savePrefs();
  document.querySelectorAll(".mode").forEach(b => { const on = b.dataset.mode === m; b.setAttribute("aria-checked", on); b.tabIndex = on ? 0 : -1; });
  $("#settings").hidden = m === "studia" || m === "scen" || m === "prova";
  $("#startBtn").firstChild.textContent = m === "studia" ? "Apri lo studio " : m === "srs" ? "Studia e ripassa " : m === "scen" ? "Apri gli scenari " : m === "prova" ? (window.Prova && Prova.unlocked() ? "Inizia la prova " : "Scopri la prova ") : "Inizia il giro ";
  $("#startHint").textContent = m === "studia" ? "Sfoglia tutte le figure con calma." : m === "srs" ? srsHint() : m === "scen" ? (window.Scenari ? Scenari.hint() : "Due o tre figure in fila: riconoscile e leggile insieme.") : m === "prova" ? (window.Prova ? Prova.hint() : "") : `${Math.min(ROUND, perSession())} domande di allenamento libero.`;
}
document.querySelectorAll(".mode").forEach(b => {
  b.onclick = () => selectMode(b.dataset.mode);
  b.ondblclick = () => setTab(b.dataset.mode);
  b.onkeydown = e => {
    const ms = ["srs","f2n","n2f","scen","prova"], i = ms.indexOf(b.dataset.mode);
    if(e.key === "ArrowRight" || e.key === "ArrowDown"){ e.preventDefault(); selectMode(ms[(i+1)%ms.length]); $("#mode-"+prefs.mode).focus(); }
    if(e.key === "ArrowLeft" || e.key === "ArrowUp"){ e.preventDefault(); selectMode(ms[(i+ms.length-1)%ms.length]); $("#mode-"+prefs.mode).focus(); }
  };
});
$("#startBtn").onclick = () => setTab(prefs.mode);
$("#studyLink").onclick = () => setTab("studia");

function srsHint(){
  const {due, fresh} = srsQueue();
  if(!due.length && !fresh.length){ const nd = nextDueDay(); return "Per oggi hai finito." + (nd !== null ? ` Il prossimo ripasso è ${whenText(nd)}.` : ""); }
  const parts = [];
  if(due.length) parts.push(due.length === 1 ? "1 figura da ripassare" : `${due.length} figure da ripassare`);
  if(fresh.length) parts.push(fresh.length === 1 ? "1 nuova" : `${fresh.length} nuove`);
  return "Oggi ti aspettano " + parts.join(" e ") + ".";
}
// livelli: si sale con le risposte giuste in totale; per l'ultimo servono anche tutte le figure imparate almeno una volta
const LEVELS = [{n:"Fuffaguru mancato", r:0}, {n:"Amante dei corsi di trading", r:50}, {n:"Fidanzato di Murphy", r:200}, {n:"Figlio di Buffett", r:500, all:true}];
function levelInfo(){
  const right = Object.values(stats).reduce((s, c) => s + (+c.r || 0), 0), learned = P.filter(p => sc(p.id).b >= 1).length;
  let i = 0; LEVELS.forEach((l, k) => { if(right >= l.r && (!l.all || learned === P.length)) i = k; });
  return {i, right, learned, cur: LEVELS[i], next: LEVELS[i + 1]};
}
function renderLevel(){
  const L = levelInfo(), box = $("#levelBox"); if(!box) return;
  let pct = 100, txt = "Livello massimo: sei arrivato in cima al Dojo.";
  if(L.next){
    pct = Math.min(100, Math.round((L.right - L.cur.r) / (L.next.r - L.cur.r) * 100));
    const miss = Math.max(0, L.next.r - L.right);
    txt = `Prossimo livello: ${esc(L.next.n)}. ` + (miss ? (miss === 1 ? "Ti manca 1 risposta giusta" : `Ti mancano ${miss} risposte giuste`) : "Risposte giuste raggiunte") +
      (L.next.all && L.learned < P.length ? `${miss ? " e" : ", ora"} ${P.length - L.learned} figure da imparare.` : ".") + opensNext(L.i);
  }
  box.innerHTML = `<span class="lv-ico l${L.i + 1}" role="img" aria-label="${esc(L.cur.n)}"></span><div class="lv-main"><div class="lv-name">${esc(L.cur.n)}<small>Livello ${L.i + 1} di ${LEVELS.length} · ${openP().length} figure aperte su ${P.length}</small></div><div class="lv-bar"><i style="width:${pct}%"></i></div><div class="lv-next">${txt}</div></div>`;
}
// messaggio quando un livello apre figure nuove o La Prova del Dojo
function opensHTML(from, to){
  const g0 = LEVEL_GROUP[from], g1 = LEVEL_GROUP[to], n = P.filter(p => GROUP_OF[p.id] > g0 && GROUP_OF[p.id] <= g1).length;
  const bits = [n ? `${n} figure nuove` : "", from < PROVA_LEVEL && to >= PROVA_LEVEL ? "La Prova del Dojo" : ""].filter(Boolean);
  return bits.length ? `<p class="levelup">Si aprono ${bits.join(" e ")}.</p>` : "";
}
// cosa apre il prossimo livello, per il riquadro dei progressi
function opensNext(i){
  const g = LEVEL_GROUP[i + 1] - LEVEL_GROUP[i], n = g > 0 ? P.filter(p => GROUP_OF[p.id] > LEVEL_GROUP[i] && GROUP_OF[p.id] <= LEVEL_GROUP[i + 1]).length : 0;
  const bits = [n ? `${n} figure nuove` : "", i + 1 === PROVA_LEVEL ? "La Prova del Dojo" : ""].filter(Boolean);
  return bits.length ? ` Si aprono ${bits.join(" e ")}.` : "";
}
function renderHome(){
  const order = ["inv","cont"].flatMap(f => [true,false].flatMap(b => P.filter(p => p.fam === f && p.bull === b)));
  const bi = groupNow();
  // le figure chiuse vanno in fondo, in ordine di gruppo, così la posizione del pallino non dice nulla
  order.sort((a, b) => (isOpen(a, bi) ? -1 : GROUP_OF[a.id]) - (isOpen(b, bi) ? -1 : GROUP_OF[b.id]) || (isOpen(a, bi) || a.id === b.id ? 0 : a.id < b.id ? -1 : 1));
  $("#progDots").innerHTML = order.map(p => {
    if(!isOpen(p, bi)) return `<i class="lk" title="Figura chiusa: si apre salendo di livello"></i>`;
    const b = sc(p.id).b;
    return `<i class="k${b}" title="${esc(label(p))} · ${beltName(b)}"></i>`;
  }).join("");
  renderLevel();
  const nd = nextDueDay();
  $("#nextDue").textContent = nd === null ? `Comincia da Studia e ripassa: ogni giorno ti presenta fino a ${Math.min(NEW_PER_DAY, perSession())} figure nuove.` : `Prossime figure da ripassare: ${whenText(nd)}.`;
  if(prefs.mode === "srs") $("#startHint").textContent = srsHint();
  if(prefs.mode === "scen" && window.Scenari) $("#startHint").textContent = Scenari.hint();
  const pl = $("#provaLock"); if(pl) pl.hidden = !!(window.Prova && Prova.unlocked());
  renderPeek();
}
// tessera "Studia e ripassa": le prime figure che ti chiederà, con cintura e ogni quanto tornano
// (riquadro al passaggio del mouse; sui telefoni una riga nella tessera)
function renderPeek(){
  const box = $("#srsPeek"), line = $("#srsPeekLine"); if(!box || !line) return;
  const {due, fresh} = srsQueue(), next = due.concat(fresh).slice(0, 4);
  if(!next.length){
    const nd = nextDueDay(), t = "Per oggi hai finito." + (nd !== null ? ` Il prossimo ripasso è ${whenText(nd)}.` : "");
    box.innerHTML = `<b>Le prossime figure</b><span class="pk-empty">${t}</span>`; line.textContent = t; return;
  }
  box.innerHTML = `<b>Le prossime figure</b>` + next.map(p => { const b = sc(p.id).b;
    return `<span class="pk-row">${BELT_SVG(b)}<span class="pk-n">${esc(label(p))}</span><span class="pk-w">${b ? BELTS[b] + " · " + (INT[b] === 1 ? "ogni giorno" : `ogni ${INT[b]} giorni`) : "nuova"}</span></span>`; }).join("");
  line.textContent = "Prossime: " + next.map(label).join(", ");
}
// conferma a prova di distrazione: prima il pulsante, poi "Sei sicuro?" e la parola da scrivere (CANCELLA o ELIMINA)
const DANGER_WORD = "CANCELLA", DELETE_WORD = "ELIMINA";
function dangerHTML(id, text, label = "Azzera i progressi", word = DANGER_WORD){
  return `<div class="danger-box"><p>${esc(text)} <b>Non si può annullare.</b></p>
    <div class="row"><button class="btn danger" type="button" id="${id}-open" aria-expanded="false" aria-controls="${id}-c">${label}</button></div>
    <div class="danger-confirm" id="${id}-c" hidden>
      <label for="${id}-w">Sei sicuro di quello che vuoi fare? Scrivi <b>${word}</b> per confermare.</label>
      <div class="row"><input id="${id}-w" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-describedby="${id}-m"><button class="btn danger" type="button" id="${id}-go" disabled>Conferma</button><button class="btn ghost small" type="button" id="${id}-no">Annulla</button></div>
    </div>
    <p class="hint" id="${id}-m" role="status"></p></div>`;
}
function bindDanger(id, onYes, word = DANGER_WORD){
  const w = $("#" + id + "-w"), go = $("#" + id + "-go"), open = $("#" + id + "-open"), c = $("#" + id + "-c");
  const show = on => { c.hidden = !on; open.hidden = on; open.setAttribute("aria-expanded", String(on)); w.value = ""; go.disabled = true; if(on) w.focus(); else open.focus(); };
  open.onclick = () => { $("#" + id + "-m").textContent = ""; show(true); };
  $("#" + id + "-no").onclick = () => show(false);
  w.oninput = () => { go.disabled = w.value.trim().toUpperCase() !== word; };
  go.onclick = () => { if(w.value.trim().toUpperCase() !== word) return; go.disabled = true; w.value = ""; c.hidden = true; open.hidden = false; open.setAttribute("aria-expanded", "false"); onYes(); };
}
function renderIllustrations(){
  const mini = (id, o) => chartSVG(BYID[id], Object.assign({arrow:true, w:90, h:80, maxSlot:16, maxBody:8}, o));
  const boxes = ["oggi","1 g","3 g","1 sett.","2 sett.","1 mese"].slice(1);
  $("#ill-srs").innerHTML = `<div style="display:flex;align-items:flex-end;gap:5px;padding:10px 10px 14px;width:100%;height:100%;position:relative">${boxes.map((t, i) => {
    const n = 4 - Math.min(3, i);
    return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0">
      <div style="display:flex;flex-direction:column-reverse;gap:2px;width:100%;align-items:center">${Array.from({length:n}, (_, j) => `<span style="display:block;width:70%;height:7px;border-radius:2px;background:${i >= 3 ? "var(--bull)" : i >= 1 ? "var(--hl-line)" : "var(--line)"};opacity:${.55 + j * .12}"></span>`).join("")}</div>
      <span style="display:block;width:100%;height:14px;border:1.5px solid var(--line);border-top:0;border-radius:0 0 4px 4px;background:var(--card)"></span>
</div>`;
  }).join("")}<span style="position:absolute;left:10px;right:10px;bottom:3px;display:flex;justify-content:space-between;font-family:var(--mono);font-size:9px;color:var(--muted)"><span>oggi</span><span>tra un mese</span></span></div>`;
  $("#ill-studia").innerHTML = `<div style="display:flex;gap:6px;padding:8px;width:100%;height:100%">${["hammer_p","engulf_m","mstar_p"].map(id =>
    `<div style="flex:1;background:var(--card);border:1px solid var(--line);border-radius:6px;display:flex;flex-direction:column;padding:3px;min-width:0">${mini(id)}<span style="display:block;height:4px;width:70%;background:var(--line);border-radius:2px;margin:3px auto 2px"></span><span style="display:block;height:3px;width:45%;background:var(--line);border-radius:2px;margin:0 auto"></span></div>`).join("")}</div>`;
  const es = BYID["estar_m"];
  $("#ill-f2n").innerHTML = `<div style="position:relative;width:100%;height:100%">${chartSVG(es, {context: makeContext(es), hl:true, w:260, h:104, maxSlot:24, maxBody:12})}
    <span style="position:absolute;right:10px;top:8px;width:28px;height:28px;border-radius:50%;background:var(--accent);color:var(--card);display:grid;place-items:center;font-family:var(--display);font-size:18px">?</span></div>`;
  $("#ill-n2f").innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding:6px;width:100%;height:100%">
    <span style="background:var(--card);border:1px solid var(--line);border-radius:6px;padding:1px 8px;font-weight:600;font-size:12px;white-space:nowrap">Hammer <span style="color:var(--bull)">▲</span></span>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;width:100%;max-width:200px;min-height:0;flex:1">${["hanging_m","hammer_p","shooting_m"].map((id,i) =>
      `<div style="background:var(--card);border:1.5px solid ${i===1?"var(--bull)":"var(--line)"};border-radius:5px;min-width:0;display:flex">${mini(id,{w:70,h:56})}</div>`).join("")}</div></div>`;
}

/* hero: candles drifting slowly to the left */
const heroAnim = (() => {
  const cv = $("#heroCanvas"); const ctx = cv.getContext("2d");
  let raf = 0, candles = [], off = 0, last = 50, W = 0, H = 0;
  const CW = 22;
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  function nextCandle(){
    const o = last, c = Math.max(12, Math.min(88, o + (Math.random() - .48) * 14));
    const hi = Math.max(o, c) + Math.random() * 6, lo = Math.min(o, c) - Math.random() * 6;
    last = c; return {o, c, hi, lo};
  }
  function size(){
    const r = cv.getBoundingClientRect(), d = window.devicePixelRatio || 1;
    W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    while(candles.length < W / CW + 3) candles.push(nextCandle());
  }
  function draw(){
    ctx.clearRect(0, 0, W, H);
    const bull = css("--bull"), bear = css("--bear");
    const y = v => H * .92 - v / 100 * H * .84;
    candles.forEach((k, i) => {
      const x = i * CW - off + CW / 2;
      const col = k.c >= k.o ? bull : bear;
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(x, y(k.hi)); ctx.lineTo(x, y(k.lo)); ctx.stroke();
      const t = y(Math.max(k.o, k.c)), b = y(Math.min(k.o, k.c));
      ctx.fillRect(x - CW * .3, t, CW * .6, Math.max(2, b - t));
    });
  }
  function tick(){
    off += .25;
    if(off >= CW){ off -= CW; candles.shift(); candles.push(nextCandle()); }
    draw(); raf = requestAnimationFrame(tick);
  }
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.addEventListener("resize", () => { if(getComputedStyle(cv).display === "none"){ cancelAnimationFrame(raf); raf = 0; return; } size(); draw(); if(!still && !raf && view === "home") raf = requestAnimationFrame(tick); });
  window.addEventListener("dojo-theme", () => { if(raf || still) draw(); });
  return {
    start(){ if(getComputedStyle(cv).display === "none") return; size(); draw(); if(!still && !raf) raf = requestAnimationFrame(tick); },
    stop(){ cancelAnimationFrame(raf); raf = 0; }
  };
})();

function syncControls(){
  [["#famSeg","fam"],["#studySeg","sfilter"]].forEach(([id, k]) =>
    $(id).querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.v === prefs[k])));
  $("#hlToggle").checked = prefs.hl;
  selectMode(["srs","f2n","n2f","scen","prova"].includes(prefs.mode) ? prefs.mode : "srs", true);
}
function bindSeg(id, key, cb){
  const el = $(id);
  const paint = () => el.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.v === prefs[key]));
  el.querySelectorAll("button").forEach(b => b.onclick = () => { prefs[key] = b.dataset.v; savePrefs(); paint(); cb(); });
  paint();
}

/* ---------- quiz ---------- */
let Q = null;
function pool(){ return openP().filter(p => prefs.fam === "all" || p.fam === prefs.fam); }
function weight(p){ const s = stats[p.id] || {r:0, w:0}; return Math.max(.35, 1 + 1.6*s.w - .45*s.r); }
function pickQuestions(list, k){
  const src = list.slice(), out = [];
  while(out.length < k && src.length){
    const tot = src.reduce((a, p) => a + weight(p), 0);
    let r = Math.random() * tot, i = 0;
    for(; i < src.length - 1; i++){ r -= weight(src[i]); if(r <= 0) break; }
    out.push(src.splice(i, 1)[0]);
  }
  return out;
}
function distractors(t, list, k){
  const others = list.filter(p => p.id !== t.id);
  const chosen = [];
  const add = p => { if(p && !chosen.includes(p) && p.id !== t.id) chosen.push(p); };
  if(t.twin && Math.random() < .75 && isOpen(BYID[t.twin])) add(BYID[t.twin]);
  shuffle(others.filter(p => p.n === t.n)).slice(0, 2).forEach(add);
  shuffle(others.slice()).forEach(p => { if(chosen.length < k) add(p); });
  return chosen.slice(0, k);
}
// con il filtro famiglia può non esserci nessuna figura aperta (al livello 1 ci sono solo figure d'inversione)
function renderEmptyPool(mode){
  const fam = {inv:"d'inversione", cont:"di continuazione"}[prefs.fam] || "";
  $("#quiz").innerHTML = `<div class="panel summary"><div class="eyebrow">${esc(MODE_TITLE[mode] || "")}</div><p class="score">Nessuna figura ${fam} aperta.</p>
    <p style="margin:0;color:var(--muted);max-width:60ch">Al tuo livello le figure ${fam} sono ancora chiuse: si aprono salendo di livello. Intanto puoi allenarti su tutte le figure aperte.</p>
    <div class="actions"><button class="btn" id="allGo">Allenati su tutte</button><button class="btn ghost" id="homeGo">Torna al menu</button></div></div>`;
  $("#allGo").onclick = () => { prefs.fam = "all"; savePrefs(); syncControls(); setTab(mode); };
  $("#homeGo").onclick = goHome;
}
function newRound(mode, only){
  if(!only && !pool().length) return renderEmptyPool(mode);
  if(mode === "srs" && !only){
    const {due, fresh} = srsQueue();
    if(!due.length && !fresh.length) return renderDone();
    const qs = shuffle(due.slice()).concat(fresh);
    Q = {mode, list: pool(), qs, dirs: qs.map(() => Math.random() < .5 ? "f2n" : "n2f"), intro: new Set(fresh.map(p => p.id)),
         relearn: new Set(), requeued: {}, i:0, res:[], streak:0, best:0, answered:false};
    return renderToday(due, fresh);
  }
  const list = pool();
  const qs = only ? only.map(id => BYID[id]) : pickQuestions(list, Math.min(ROUND, perSession(), list.length));
  Q = {mode, list, qs, i:0, res:[], streak:0, best:0, answered:false};
  renderQuestion();
}
function renderQuestion(){
  const box = $("#quiz");
  if(Q.i >= Q.qs.length) return renderSummary();
  const t = Q.qs[Q.i];
  if(!Q.cur || Q.cur.id !== t.id + Q.i){
    Q.cur = {id: t.id + Q.i, ctx: makeContext(t), opts: shuffle([t, ...distractors(t, Q.list.length >= 5 ? Q.list : openP(), 3)]), ctxFor:{}};
    Q.answered = false; Q.pick = null; Q.levelUp = null; Q.opens = "";
  }
  if(Q.mode === "srs" && Q.intro.has(t.id)) return renderIntro(t);
  const mode = curMode();
  const pips = Q.qs.map((_, i) => `<span class="pip ${i < Q.res.length ? (Q.res[i] ? "ok" : "ko") : (i === Q.i ? "cur" : "")}"></span>`).join("");
  let body = "";
  if(mode === "f2n"){
    body += `<h2 class="prompt">Che figura è questa?<small>${prefs.hl ? "La figura è nella zona evidenziata. Le candele prima mostrano il trend." : "Le prime candele mostrano il trend, poi arriva la figura."}</small></h2>`;
    body += `<div class="bigchart">${chartSVG(t, {context: Q.cur.ctx, hl: prefs.hl, w: 560, h: 260, maxSlot: 52, maxBody: 22, aria: "Grafico da riconoscere"})}</div>`;
    body += `<div class="opts">${Q.cur.opts.map((p, i) => `<button class="opt ${optClass(p, t)}" data-id="${p.id}" ${Q.answered?"disabled":""}><span class="nm">${esc(p.name)}</span><span style="display:flex;gap:6px;align-items:center">${chipDir(p)}<span class="k">${i+1}</span></span></button>`).join("")}</div>`;
  } else {
    body += `<h2 class="prompt">Trova: ${esc(t.name)} ${chipDir(t)}<small>Scegli il grafico giusto. In ogni grafico la zona evidenziata è la figura.</small></h2>`;
    body += `<div class="opts figs">${Q.cur.opts.map((p, i) => {
      const ctx = Q.cur.ctxFor[p.id] || (Q.cur.ctxFor[p.id] = makeContext(p));
      return `<button class="opt fig ${optClass(p, t)}" data-id="${p.id}" ${Q.answered?"disabled":""} aria-label="Opzione ${i+1}"><span class="k">${i+1}</span>${chartSVG(p, {context: ctx, hl: prefs.hl, w: 300, h: 170, maxSlot: 34, maxBody: 15, aria: "Opzione " + (i+1)})}</button>`;
    }).join("")}</div>`;
  }
  if(Q.answered) body += feedback(t);
  box.innerHTML = `<div class="qhead"><div class="pips" aria-label="Avanzamento">${pips}</div><div class="streak">Di fila <b>${Q.streak}</b> · Record <b>${Q.best}</b></div></div><div class="panel qcard">${body}</div>`;
  box.querySelectorAll(".opt").forEach(b => b.onclick = () => answer(b.dataset.id));
  const nx = $("#next"); if(nx) { nx.onclick = next; nx.focus({preventScroll:true}); }
}
function optClass(p, t){
  if(!Q.answered) return "";
  if(p.id === t.id) return "right";
  if(p.id === Q.pick) return "wrong";
  return "";
}
function answer(id){
  if(Q.answered) return;
  const t = Q.qs[Q.i], ok = id === t.id, lvBefore = levelInfo().i;
  Q.answered = true; Q.pick = id; Q.res.push(ok);
  const s = stats[t.id] || (stats[t.id] = {r:0, w:0});
  ok ? s.r++ : s.w++;
  saveStats();
  Q.lastGrade = null;
  if(Q.mode === "srs"){
    Q.lastGrade = grade(t.id, ok, Q.relearn.has(t.id));
    if(!ok){
      Q.relearn.add(t.id);
      Q.requeued[t.id] = (Q.requeued[t.id] || 0) + 1;
      if(Q.requeued[t.id] <= 3){
        const pos = Math.min(Q.qs.length, Q.i + 3);
        Q.qs.splice(pos, 0, t); Q.dirs.splice(pos, 0, Math.random() < .5 ? "f2n" : "n2f");
      }
    }
  } else {
    const c = srs[t.id];
    if(c && c.b > 0){
      if(!ok){ c.b = Math.max(1, c.b - 1); c.due = Math.min(c.due, today() + 1); saveSrs(); }
      else if(c.due <= today()){ grade(t.id, true, false); }
    }
  }
  Q.streak = ok ? Q.streak + 1 : 0; Q.best = Math.max(Q.best, Q.streak);
  const lvAfter = levelInfo().i; if(lvAfter > lvBefore) Q.levelUp = LEVELS[lvAfter].n;
  if(lvAfter > lvBefore) Q.opens = opensHTML(lvBefore, lvAfter);
  if(window.DojoSuoni) DojoSuoni.play(lvAfter > lvBefore ? "livello" : ok ? "giusto" : "sbagliato");
  renderQuestion();
  if(ok) memePop();
}
// frasi scherzose sulla finanza online, una a caso a ogni risposta giusta (mai la stessa due volte di fila)
const MEME = ["Sei prossimo alla FIRE!", "Mantieni la mano d'oro!", "Pubblicato su r/wallstreetbets!", "To the moon! 🚀", "Stonks! 📈",
  "Diamond hands! 💎🙌", "Warren Buffett ha messo like.", "Il tuo commercialista è fiero di te.", "Interesse composto sbloccato.",
  "Hai battuto l'indice. Almeno oggi.", "Il tuo ETF ti ringrazia.", "Comprato sul minimo, venduto sul massimo.", "Margin call evitata!",
  "Il mercato ti dà ragione (per ora).", "Altro che fuffaguru.", "Questa la metti nel portafoglio."];
let lastMeme = -1;
function memeLine(){ let i; do i = Math.floor(Math.random() * MEME.length); while(i === lastMeme && MEME.length > 1); lastMeme = i; return MEME[i]; }
// la frase compare grande al centro dello schermo e sfuma da sola (animazione .meme-pop in index.html)
function memePop(){
  document.querySelectorAll(".meme-pop").forEach(e => e.remove());
  const el = document.createElement("div"); el.className = "meme-pop"; el.setAttribute("role", "status"); el.textContent = memeLine();
  // nasce leggermente inclinata e sparisce ruotando, ogni volta a sinistra o a destra a caso
  const side = () => Math.random() < .5 ? -1 : 1, r0 = side() * (2 + Math.random() * 3);
  el.style.setProperty("--r0", r0.toFixed(1) + "deg");
  el.style.setProperty("--r1", (r0 + side() * (8 + Math.random() * 6)).toFixed(1) + "deg");
  document.body.appendChild(el); setTimeout(() => el.remove(), 1600);
}
// la riga «Sostieni il Dojo» compare al massimo una volta al giorno
function supportToday(){
  const d = new Date().toISOString().slice(0, 10);
  try{ if(localStorage.getItem("dojo-support-day") === d) return false; localStorage.setItem("dojo-support-day", d); }catch(e){}
  return true;
}
function feedback(t){
  const ok = Q.pick === t.id, picked = BYID[Q.pick];
  let h = `<div class="fb ${ok?"ok":"ko"}" role="status"><h3>${ok ? "Giusto!" : "Non proprio."} ${esc(t.name)} ${chipDir(t)} ${chipN(t)}</h3>${Q.levelUp ? `<p class="levelup"><span class="lv-ico big l${levelInfo().i + 1}" aria-hidden="true"></span>Sei salito di livello: <b>${esc(Q.levelUp)}</b></p>` : ""}${Q.levelUp ? Q.opens || "" : ""}<p>${esc(t.d)}</p>`;
  if(Q.lastGrade){
    h += `<span class="nextchip">${ok ? "La rivedrai " + whenText(Q.lastGrade.due) : (Q.requeued[t.id] <= 3 ? "Te la richiedo tra poco" : "La rivedrai oggi stesso")}</span>`;
  }
  if(!ok && picked){
    h += `<div class="compare">
      <figure>${chartSVG(t, {arrow:true, w:280, h:150, maxSlot:30, maxBody:14})}<figcaption>Era: <b>${esc(label(t))}</b></figcaption></figure>
      <figure>${chartSVG(picked, {arrow:true, w:280, h:150, maxSlot:30, maxBody:14})}<figcaption>Hai scelto: <b>${esc(label(picked))}</b> — ${esc(picked.d)}</figcaption></figure></div>`;
  }
  h += `<div class="actions"><button class="btn" id="next">${Q.i + 1 >= Q.qs.length ? "Vedi il risultato" : "Avanti"}</button><span class="hint">oppure premi Invio</span></div></div>`;
  return h;
}
function next(){ Q.i++; Q.cur = null; renderQuestion(); window.scrollTo({top: Math.min(window.scrollY, $("#quiz").offsetTop - 80), behavior:"smooth"}); }
// apertura di Studia e ripassa: le figure nuove di oggi si vedono subito; quelle da ripassare solo come cinture, per non suggerire la risposta
function renderToday(due, fresh){
  const byBelt = [1,2,3,4,5].map(b => [b, due.filter(p => sc(p.id).b === b).length]).filter(x => x[1]);
  $("#quiz").innerHTML = `<div class="panel summary today"><div class="eyebrow">Studia e ripassa · oggi</div>
    <p class="score">${fresh.length ? (fresh.length === 1 ? "1 figura nuova" : `${fresh.length} figure nuove`) : "Nessuna figura nuova"}${due.length ? ` e ${due.length === 1 ? "1 da ripassare" : `${due.length} da ripassare`}` : ""}.</p>
    ${fresh.length ? `<div class="eyebrow" style="margin-bottom:8px">Nuove: prima le guardi, poi te le chiedo</div><div class="grid mini">${fresh.map(p => `<article class="panel card"><div class="well">${chartSVG(p, {arrow:true, w:240, h:150, maxSlot:30, maxBody:14, aria: label(p)})}</div><h3>${esc(p.name)}</h3><div class="chips">${chipDir(p)}<span class="chip fam">${famName(p.fam)}</span></div></article>`).join("")}</div>` : ""}
    ${byBelt.length ? `<div class="eyebrow" style="margin:14px 0 8px">Da ripassare</div><div class="beltrow">${byBelt.map(([b, n]) => `<span class="beltcount">${BELT_SVG(b)}${n} ${n === 1 ? beltName(b).toLowerCase() : "cinture " + BELTS_PL[b]}</span>`).join("")}</div>` : ""}
    <p class="hint" style="margin:12px 0 0">Ogni risposta giusta fa salire la figura di cintura e la fa tornare più tardi; una sbagliata la riporta alla gialla. Le figure per sessione si cambiano nelle Impostazioni (ora ${perSession()}).</p>
    <div class="actions"><button class="btn" id="todayGo">Comincia</button><button class="btn ghost" id="homeGo">Torna al menu</button></div></div>`;
  $("#todayGo").onclick = renderQuestion;
  $("#homeGo").onclick = goHome;
  $("#todayGo").focus({preventScroll:true});
}
function renderIntro(t){
  const twin = t.twin ? BYID[t.twin] : null;
  $("#quiz").innerHTML = `<div class="qhead"><div class="pips">${Q.qs.map((_, i) => `<span class="pip ${i < Q.res.length ? (Q.res[i] ? "ok" : "ko") : (i === Q.i ? "cur" : "")}"></span>`).join("")}</div></div>
  <div class="panel intro">
    <div class="eyebrow">Figura nuova · guardala bene</div>
    <h2>${esc(t.name)}</h2>
    <div style="display:flex;gap:6px;flex-wrap:wrap">${chipDir(t)}${chipN(t)}<span class="chip fam">${famName(t.fam)}</span></div>
    <div class="big">${chartSVG(t, {arrow:true, w:520, h:240, maxSlot:56, maxBody:24, aria: label(t)})}</div>
    <p style="margin:0;max-width:65ch;font-size:16px">${esc(t.d)}</p>
    ${twin && isOpen(twin) ? `<p class="hint" style="margin:0">La sua gemella è ${esc(label(twin))}: stessa idea, direzione opposta.</p>` : ""}
    <div class="actions"><button class="btn" id="gotit">Ho capito, mettimi alla prova</button></div>
  </div>`;
  const b = $("#gotit");
  b.onclick = () => { Q.intro.delete(t.id); newLeft(); daily.newCount++; srs[t.id] = srs[t.id] || {b:0, due:today()}; saveSrs(); renderQuestion(); };
  b.focus({preventScroll:true});
}
function renderDone(){
  const nd = nextDueDay();
  $("#quiz").innerHTML = `<div class="panel summary"><div class="eyebrow">Studia e ripassa</div><p class="score">Per oggi hai finito.</p>
    <p style="margin:0;color:var(--muted);max-width:60ch">${nd !== null ? `Le prossime figure da ripassare arrivano ${whenText(nd)}. ` : ""}Le figure nuove sono finite per oggi: domani ne arrivano altre. Se vuoi, puoi allenarti liberamente.</p>
    <div class="actions"><button class="btn" id="freeGo">Allenamento libero</button><button class="btn ghost" id="homeGo">Torna al menu</button></div></div>`;
  $("#freeGo").onclick = () => setTab("f2n");
  $("#homeGo").onclick = goHome;
}
function renderSrsSummary(){
  const ids = [...new Set(Q.qs.map(p => p.id))];
  const groups = {};
  ids.forEach(id => { const w = whenText(sc(id).due); (groups[w] = groups[w] || []).push(BYID[id]); });
  const order = ["oggi","domani"];
  const keys = Object.keys(groups).sort((a, b) => {
    const da = Math.min(...groups[a].map(p => sc(p.id).due)), db = Math.min(...groups[b].map(p => sc(p.id).due)); return da - db; });
  const good = Q.res.filter(Boolean).length;
  $("#quiz").innerHTML = `<div class="panel summary"><div class="eyebrow">Ripasso finito</div>
    <p class="score">${good === Q.res.length ? "Tutto giusto, ottimo." : "Fatto. Le figure sbagliate le hai ripassate subito."}</p>
    <div class="pips">${Q.res.map(r => `<span class="pip ${r ? "ok" : "ko"}"></span>`).join("")}</div>
    <div><div class="eyebrow" style="margin-bottom:8px">Quando le rivedrai</div>
    <div class="sched">${keys.map(k => `<div><b>${k[0].toUpperCase() + k.slice(1)}</b><span>${groups[k].map(p => esc(label(p))).join(", ")}</span></div>`).join("")}</div></div>
    ${supportToday() ? `<div class="support-line"><p>Ti è piaciuto il ripasso? Il Dojo è gratis e senza pubblicità. Se vuoi, offrimi un tè.</p><a class="support" href="https://paypal.me/Gmanmik" target="_blank" rel="noopener noreferrer"><span class="cha" aria-hidden="true">茶</span>Sostieni il Dojo</a></div>` : ""}
    <div class="actions"><button class="btn" id="homeGo">Torna al menu</button><button class="btn ghost" id="freeGo">Allenamento libero</button></div></div>`;
  $("#homeGo").onclick = goHome;
  $("#freeGo").onclick = () => setTab("f2n");
}
function renderSummary(){
  if(Q.mode === "srs") return renderSrsSummary();
  const good = Q.res.filter(Boolean).length, tot = Q.res.length;
  const wrong = Q.qs.filter((_, i) => !Q.res[i]);
  const msg = good === tot ? "Giro perfetto." : good >= tot * .7 ? "Ottimo lavoro." : good >= tot * .4 ? "Stai migliorando." : "Si impara sbagliando.";
  const pips = Q.res.map(r => `<span class="pip ${r?"ok":"ko"}"></span>`).join("");
  let h = `<div class="panel summary"><div class="eyebrow">Fine del giro</div><p class="score">${msg}</p>
    <div class="pips">${pips}</div><p style="margin:0;color:var(--muted)">Giuste: ${good} su ${tot}. Record di risposte giuste di fila: ${Q.best}.</p>`;
  if(wrong.length){
    h += `<div><div class="eyebrow" style="margin-bottom:8px">Da ripassare</div><div class="grid">${wrong.map(cardHTML).join("")}</div></div>`;
  }
  h += `<div class="actions"><button class="btn" id="again">Nuovo giro</button>${wrong.length ? `<button class="btn ghost" id="retry">Rifai solo quelle sbagliate</button>` : ""}</div></div>`;
  $("#quiz").innerHTML = h;
  $("#again").onclick = () => newRound(Q.mode);
  const r = $("#retry"); if(r) r.onclick = () => newRound(Q.mode, shuffle(wrong.map(p => p.id)));
  bindTwinLinks($("#quiz"));
}
document.addEventListener("keydown", e => {
  if(view === "home" || view === "studia" || view === "prova" || view === "auth" || view === "account" || !Q || e.target.tagName === "SELECT" || e.target.tagName === "INPUT") return;
  if(Q.mode === "scen") return Scenari.key(e);
  if(Q.mode === "srs" && Q.intro && Q.qs[Q.i] && Q.intro.has(Q.qs[Q.i].id)) return;
  if(!Q.answered && /^[1-4]$/.test(e.key) && (curMode() === "n2f" || curMode() === "f2n")){
    const o = Q.cur && Q.cur.opts[+e.key - 1]; if(o) answer(o.id);
  } else if(Q.answered && e.key === "Enter" && document.activeElement?.id !== "next"){ next(); }
});

/* ---------- study ---------- */
function lockedCardHTML(p){
  const N = LEVEL_FOR_GROUP[GROUP_OF[p.id]] + 1, tk = "<i></i>".repeat(N);
  return `<article class="panel card locked" aria-label="Figura chiusa">
    <div class="well wrap" role="img" aria-label="Figura chiusa"><span class="band"></span><span class="seal">?</span><span class="tk">${tk}</span></div>
    <div class="ghostname">? ? ?</div>
    <div class="unl"><span class="tk2">${tk}</span>Si apre al livello ${N}: ${esc(LEVELS[N - 1].n)}</div>
    <div class="ghostline"></div><div class="ghostline" style="width:80%"></div>
  </article>`;
}
// la cintura della figura; al passaggio del mouse (o toccandola) un piccolo menu dice ogni quanto torna e quando
function beltHTML(p){
  const c = sc(p.id), b = c.b;
  const when = b === 0 ? arrivalText(p.id) : "Prossimo ripasso: " + whenText(c.due);
  return `<span class="beltbox" tabindex="0" role="button" aria-label="${esc(beltName(b))}. ${esc(everyText(b))}. ${esc(when)}.">${BELT_SVG(b)}<span class="bn">${BELTS[b]}</span>
    <span class="tip" role="tooltip"><b>${beltName(b)}</b><span class="sc">${[0,1,2,3,4,5].map(i => `<i class="k${i}${i === b ? " on" : ""}"></i>`).join("")}</span>${esc(everyText(b))}<br>${esc(when)}</span></span>`;
}
function cardHTML(p){
  const twin = p.twin && isOpen(BYID[p.twin]) ? BYID[p.twin] : null;
  return `<article class="panel card" id="c-${p.id}">
    <div class="well">${chartSVG(p, {arrow:true, w:240, h:150, maxSlot:30, maxBody:14, aria: label(p)})}</div>
    <h3>${esc(p.name)}</h3>
    <div class="chips">${chipDir(p)}${chipN(p)}<span class="chip fam">${famName(p.fam)}</span></div>
    <p>${esc(p.d)}</p>
    <div class="foot">${twin ? `<button data-go="${twin.id}">Gemella: ${esc(label(twin))}</button>` : "<span></span>"}${beltHTML(p)}</div>
  </article>`;
}
function bindTwinLinks(root){
  root.querySelectorAll("[data-go]").forEach(b => b.onclick = () => {
    if(view !== "studia"){ $("#search").value = ""; setTab("studia"); }
    const el = document.getElementById("c-" + b.dataset.go);
    if(el){ el.scrollIntoView({behavior:"smooth", block:"center"}); el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); }
  });
}
function renderStudy(){
  const q = $("#search").value.trim().toLowerCase();
  const f = prefs.sfilter;
  const bi = groupNow();
  // le figure chiuse compaiono come sagome in fondo a ogni gruppo, ma non nella ricerca
  const vis = P.filter(p => isOpen(p, bi) && (f === "all" || (f === "bull") === p.bull) && (!q || p.name.toLowerCase().includes(q) || p.d.toLowerCase().includes(q)));
  const groups = [["inv", true, "Inversione al rialzo"], ["inv", false, "Inversione al ribasso"], ["cont", true, "Continuazione al rialzo"], ["cont", false, "Continuazione al ribasso"]];
  let h = "";
  for(const [fam, bull, title] of groups){
    const items = vis.filter(p => p.fam === fam && p.bull === bull);
    if(!items.length) continue;
    const op = items.filter(p => isOpen(p, bi));
    if(op.length) h += `<div class="sect"><h2>${title}</h2><span class="eyebrow">${op.length} figure</span></div><div class="grid">${op.map(cardHTML).join("")}</div>`;
  }
  // le figure chiuse stanno tutte insieme in fondo, in ordine di livello: né la sezione né il filtro dicono se salgono o scendono
  const lk = q ? [] : P.filter(p => !isOpen(p, bi)).sort((a, b) => GROUP_OF[a.id] - GROUP_OF[b.id] || (a.id < b.id ? -1 : 1));
  if(lk.length) h += `<div class="sect"><h2>Figure chiuse</h2><span class="eyebrow">${lk.length} figure · si aprono salendo di livello</span></div><div class="grid">${lk.map(lockedCardHTML).join("")}</div>`;
  $("#study").innerHTML = h || `<p class="empty">Nessuna figura trovata. Prova con un altro nome.</p>`;
  bindTwinLinks($("#study"));
}
$("#search").addEventListener("input", renderStudy);

/* ---------- schermata di accesso ---------- */
const AUTH = {step: "in", email: ""};
const weakPw = p => p.length < 8 || !/[a-z]/i.test(p) || !/\d/.test(p);
const fieldHTML = (id, label, attrs) => `<label for="${id}">${label}</label><input id="${id}" ${attrs}>`;
/* pagina d'ingresso per chi non è iscritto: nasconde l'app finché non si sceglie Accedi o Iscriviti */
function showLanding(){
  view = "landing";
  document.body.classList.add("is-landing"); $("#landing").hidden = false;
  heroAnim.stop();
  const fig = (id, ctx) => { const p = BYID[id]; return chartSVG(p, {context: ctx ? makeContext(p) : [], w: 320, h: 200, maxSlot: 30, maxBody: 14, aria: p.name}); };
  $("#lp-gear").innerHTML = GEAR; if(window.DojoSuoni) DojoSuoni.paint();
  $("#lp-1").innerHTML = fig("hammer_p", true); $("#lp-2").innerHTML = fig("mstar_p", true);
  window.scrollTo({top:0});
}
function leaveLanding(){ document.body.classList.remove("is-landing"); $("#landing").hidden = true; }
document.addEventListener("click", e => { const b = e.target.closest("#landing [data-go]"); if(b) showAuth(b.dataset.go); });
document.addEventListener("keydown", e => { const s = $("#lp-set"); if(e.key === "Escape" && s && !s.hidden){ s.hidden = true; $("#lp-gear").setAttribute("aria-expanded", "false"); $("#lp-gear").focus(); } });
document.addEventListener("click", e => { const g = $("#lp-gear"), s = $("#lp-set"); if(!g || !s) return; if(e.target.closest("#lp-gear")){ s.hidden = !s.hidden; g.setAttribute("aria-expanded", String(!s.hidden)); } else if(!e.target.closest("#lp-set")){ s.hidden = true; g.setAttribute("aria-expanded", "false"); } });
function showAuth(step){
  leaveLanding();
  view = "auth";
  ["#view-home", "#view-quiz", "#view-studia", "#view-account", "#bar"].forEach(s => $(s).hidden = true);
  $("#view-auth").hidden = false;
  heroAnim.stop();
  paintAuth(step || "in");
}
function paintAuth(step){
  AUTH.step = step;
  const card = $("#authCard");
  const tabs = step === "in" || step === "up";
  const T = {
    in: ["Bentornato nel dojo", "Con un account i tuoi progressi ti seguono su ogni dispositivo."],
    up: ["Crea il tuo account", "Ti mandiamo un codice via email per confermare che l'indirizzo è tuo."],
    code: ["Controlla la tua email", ""],
    forgot: ["Password dimenticata", "Scrivi l'email del tuo account: ti mandiamo un codice per sceglierne una nuova."],
    reset: ["Scegli la nuova password", ""],
    mfa: ["Verifica in due passaggi", "Apri l'app di autenticazione e scrivi il codice a 6 cifre del Dojo."]
  }[step];
  const code = `inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]*" placeholder="123456"`;
  let f = "";
  if(step === "in") f = fieldHTML("au-id", "Email o username", `autocomplete="username" autocapitalize="none" spellcheck="false"`) + fieldHTML("au-pw", "Password", `type="password" autocomplete="current-password"`);
  if(step === "up") f = fieldHTML("au-name", "Username", `autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="24"`) +
    fieldHTML("au-email", "Email", `type="email" autocomplete="email" autocapitalize="none" spellcheck="false"`) +
    fieldHTML("au-pw", "Password", `type="password" autocomplete="new-password"`) + fieldHTML("au-pw2", "Ripeti la password", `type="password" autocomplete="new-password"`) +
    `<label class="check"><input type="checkbox" id="au-mkt"> <span>Voglio ricevere via email novità e consigli dal Dojo. Puoi disiscriverti quando vuoi.</span></label>
    <p class="hint">Creando l'account confermi di aver letto l'<a href="privacy.html" target="_blank" rel="noopener">informativa privacy</a>.</p>`;
  if(step === "code" || step === "mfa") f = fieldHTML("au-code", "Codice a 6 cifre", code);
  if(step === "forgot") f = fieldHTML("au-email", "Email", `type="email" autocomplete="email" autocapitalize="none" spellcheck="false"`);
  if(step === "reset") f = fieldHTML("au-code", "Codice a 6 cifre", code) + fieldHTML("au-pw", "Nuova password", `type="password" autocomplete="new-password"`) + fieldHTML("au-pw2", "Ripeti la password", `type="password" autocomplete="new-password"`);
  const go = {in: "Entra", up: "Crea account", code: "Conferma", forgot: "Mandami il codice", reset: "Salva e entra", mfa: "Verifica"}[step];
  card.innerHTML = `<div class="eyebrow">Dojo delle candele · 道場</div><h2></h2><p class="hint au-sub"></p>
    ${tabs ? `<div class="seg" id="authSeg" role="group" aria-label="Accedi o registrati"><button type="button" data-v="in">Accedi</button><button type="button" data-v="up">Registrati</button></div>` : ""}
    <form id="authForm" novalidate>${f}${["in", "up", "code", "forgot"].includes(step) ? `<div class="cf-ts" id="au-ts"></div>` : ""}<p class="au-err" id="au-err" role="alert"></p><p class="au-ok" id="au-ok" role="status"></p><button class="btn big" id="au-go" type="submit">${go}</button></form>
    <div class="au-links">
      ${step === "in" ? `<button class="linkbtn" type="button" data-s="forgot">Password dimenticata?</button>` : ""}
      ${step === "code" ? `<button class="linkbtn" type="button" id="au-resend">Mandami un altro codice</button>` : ""}
      ${tabs ? `<button class="linkbtn" id="au-guest" type="button">Continua senza account</button>` : `<button class="linkbtn" type="button" data-s="in">Torna all'accesso</button>`}
    </div>`;
  card.querySelector("h2").textContent = T[0];
  card.querySelector(".au-sub").textContent = step === "code" ? `Abbiamo mandato un codice a 6 cifre a ${AUTH.email}. Scrivilo qui per attivare l'account.` :
    step === "reset" ? `Scrivi il codice che abbiamo mandato a ${AUTH.email} e la nuova password.` : T[1];
  card.querySelectorAll("#authSeg button").forEach(b => { b.setAttribute("aria-pressed", b.dataset.v === step); b.onclick = () => paintAuth(b.dataset.v); });
  card.querySelectorAll("[data-s]").forEach(b => b.onclick = async () => { if(step === "mfa") await cloud.sb.auth.signOut(); paintAuth(b.dataset.s); });
  const guest = $("#au-guest"); if(guest) guest.onclick = () => { store.set("dojo-guest", true); goHome(); };
  const resend = $("#au-resend"); if(resend) resend.onclick = async () => {
    try{ await cloud.resendSignup(AUTH.email); $("#au-ok").textContent = "Codice rimandato: controlla anche lo spam."; $("#au-err").textContent = ""; }
    catch(m){ $("#au-err").textContent = m; }
  };
  $("#authForm").addEventListener("submit", submitAuth);
  captcha.mount($("#au-ts"));
  const first = card.querySelector("input"); if(first) first.focus({preventScroll:true});
}
async function submitAuth(e){
  e.preventDefault();
  const v = id => { const el = document.getElementById(id); return el ? el.value.trim() : ""; };
  const err = $("#au-err"), go = $("#au-go"), step = AUTH.step;
  const fail = m => { err.textContent = m; };
  const okEmail = s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  const pw = (document.getElementById("au-pw") || {}).value || "";
  if(step === "in" && (!v("au-id") || !pw)) return fail("Scrivi email (o username) e password.");
  if(step === "up"){
    if(!/^[a-z0-9_.-]{3,24}$/.test(v("au-name").toLowerCase())) return fail("Lo username va da 3 a 24 caratteri: lettere, numeri, punto, trattino o trattino basso.");
    if(!okEmail(v("au-email"))) return fail("Scrivi un indirizzo email valido.");
  }
  if((step === "up" || step === "reset") && weakPw(pw)) return fail("La password deve avere almeno 8 caratteri, con lettere e numeri.");
  if((step === "up" || step === "reset") && pw !== $("#au-pw2").value) return fail("Le due password non coincidono.");
  if((step === "code" || step === "reset" || step === "mfa") && !/^\d{6}$/.test(v("au-code"))) return fail("Il codice è fatto di 6 cifre.");
  if(step === "forgot" && !okEmail(v("au-email"))) return fail("Scrivi l'email del tuo account.");
  go.disabled = true; err.textContent = "";
  try{
    if(step === "in"){
      await cloud.signIn(v("au-id").toLowerCase(), pw);
    }
    if(step === "up"){
      AUTH.email = v("au-email").toLowerCase();
      const pending = await cloud.signUp(v("au-name").toLowerCase(), AUTH.email, pw, $("#au-mkt").checked);
      if(pending) return paintAuth("code");
    }
    if(step === "code") await cloud.verifySignup(AUTH.email, v("au-code"));
    if(step === "forgot"){ AUTH.email = v("au-email").toLowerCase(); await cloud.sendReset(AUTH.email); return paintAuth("reset"); }
    if(step === "reset" && await cloud.resetWithCode(AUTH.email, v("au-code"), pw) === "mfa"){ AUTH.newPw = pw; return paintAuth("mfa"); }
    if(step === "mfa"){ await cloud.verifyMfa(v("au-code"), AUTH.newPw); AUTH.newPw = ""; }
  }catch(m){ fail(typeof m === "string" ? (/email not confirmed/i.test(m) ? "Conferma prima la tua email." : m) : "Connessione non riuscita: controlla la rete e riprova."); }
  if(document.body.contains(go)) go.disabled = false;
}

/* ---------- newsletter: la funzione "newsletter" su Supabase allinea la lista Brevo con il consenso ----------
   Si chiama quando cambi il consenso o l'email, e una volta per dispositivo all'accesso. A Brevo vanno solo email e username. */
function nlSync(u, force){
  try{
    // sul dispositivo resta solo un'impronta dell'email, per accorgersi se cambia
    const k = "dojo-nl-v1:" + u.id, tag = String([...(u.email || "")].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7));
    if(!force && localStorage.getItem(k) === tag) return;
    cloud.sb.functions.invoke("newsletter", {body: {action: "sync"}})
      .then(r => { if(!r.error) try{ localStorage.setItem(k, tag); }catch(e){} }).catch(() => {});
  }catch(e){}
}

/* ---------- pagina impostazioni (account + suoni) ---------- */
function trainHTML(){
  const n = perSession();
  return `<section class="panel acard"><div class="eyebrow">Allenamento</div>
    <p>Quante figure al massimo in una sessione di Studia e ripassa e in un giro libero. Se ti senti sotto pressione, abbassale: le figure da ripassare aspettano il giorno dopo.</p>
    <div class="seg" id="perSeg" role="group" aria-label="Figure per sessione">${PER_SESSION.map(v => `<button type="button" data-v="${v}" aria-pressed="${v === n}">${v}</button>`).join("")}</div>
    <p class="hint" id="m-per" role="status"></p>
  </section>`;
}
function bindTrain(){
  document.querySelectorAll("#perSeg button").forEach(b => b.onclick = () => {
    prefs.perSession = +b.dataset.v; savePrefs();
    document.querySelectorAll("#perSeg button").forEach(x => x.setAttribute("aria-pressed", x === b));
    $("#m-per").textContent = `Fatto: al massimo ${b.dataset.v} figure per sessione.`;
  });
}
function soundHTML(){
  return `<section class="panel acard"><div class="eyebrow">Suoni</div>
    <p>Un suono breve per risposta giusta, risposta sbagliata e salita di livello. Sono spenti all'inizio.</p>
    <button class="btn ghost" type="button" data-suoni aria-pressed="false">Suoni spenti</button>
  </section>`;
}
async function showAccount(){
  view = "account";
  ["#view-home", "#view-quiz", "#view-studia", "#view-auth"].forEach(s => $(s).hidden = true);
  $("#bar").hidden = false; $("#barTitle").textContent = "Impostazioni"; $("#barCfg").innerHTML = "";
  $("#view-account").hidden = false;
  heroAnim.stop(); window.scrollTo({top:0});
  if(!cloud.user){
    $("#accountBox").innerHTML = trainHTML() + soundHTML() + `<section class="panel acard"><div class="eyebrow">Account</div><p>Senza account i progressi restano solo su questo dispositivo. Con un account ti seguono ovunque.</p><button class="btn" type="button" id="st-login">Accedi o registrati</button></section>
      <section class="panel acard danger-zone" id="dangerZone"><div class="eyebrow">Danger zone</div>
      <h3>Azzera i progressi</h3>
      ${dangerHTML("dz", "Cancello tutti i progressi su questo dispositivo: figure imparate, ripasso, statistiche, scenari, livello e record della Prova.")}
      </section>`;
    $("#st-login").onclick = () => showAuth("in"); bindTrain();
    bindDanger("dz", () => { wipeProgress(Date.now()); $("#dz-m").textContent = "Fatto: i progressi sono azzerati. Si riparte dal livello 1."; });
    if(window.DojoSuoni) DojoSuoni.paint();
    return;
  }
  const sb = cloud.sb, u = cloud.user, legacy = isLegacy(u.email);
  const [{data: prof}, {data: fac}] = await Promise.all([
    sb.from("profiles").select("username, marketing").eq("id", u.id).maybeSingle(),
    sb.auth.mfa.listFactors()
  ]);
  const totp = ((fac && fac.totp) || []).find(f => f.status === "verified");
  const box = $("#accountBox");
  box.innerHTML = trainHTML() + soundHTML() + `
    <section class="panel acard"><div class="eyebrow">Profilo</div>
      <p><span class="hint">Username</span><br><b class="u-name"></b></p>
      <p><span class="hint">Email</span><br><b class="u-mail"></b></p>
      <form id="f-mail" class="row" novalidate><input id="ac-mail" type="email" autocomplete="email" autocapitalize="none" placeholder="${legacy ? "La tua email" : "Nuova email"}" aria-label="Email"><button class="btn" type="submit">${legacy ? "Aggiungi email" : "Cambia email"}</button></form>
      <form id="f-mailcode" class="row" novalidate hidden><input id="ac-mailcode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="Codice a 6 cifre" aria-label="Codice"><button class="btn" type="submit">Conferma</button></form>
      <p class="au-err" id="m-mail" role="status"></p>
    </section>
    <section class="panel acard"><div class="eyebrow">Newsletter</div>
      <label class="check"><input type="checkbox" id="ac-mkt" ${prof && prof.marketing ? "checked" : ""} ${legacy ? "disabled" : ""}> <span>Voglio ricevere via email novità e consigli dal Dojo.</span></label>
      <p class="hint">${legacy ? "Aggiungi prima la tua email." : "Puoi cambiare idea quando vuoi, anche dal link in fondo a ogni email."}</p>
      <p class="au-err" id="m-mkt" role="status"></p>
    </section>
    <section class="panel acard"><div class="eyebrow">Verifica in due passaggi</div>
      <p>${totp ? "<b>Attiva.</b> Ogni volta che entri, oltre alla password ti chiediamo il codice dell'app di autenticazione." : "Oltre alla password, all'accesso ti chiediamo un codice da un'app come Google Authenticator, Microsoft Authenticator o 1Password."}</p>
      <div id="mfaBox"><button class="btn ${totp ? "ghost" : ""}" type="button" id="ac-mfa">${totp ? "Disattiva" : "Attiva"}</button></div>
      <p class="au-err" id="m-mfa" role="status"></p>
    </section>
    <section class="panel acard"><div class="eyebrow">Password</div>
      <form id="f-pw" class="stack" novalidate>
        <input id="ac-pw" type="password" autocomplete="new-password" placeholder="Nuova password" aria-label="Nuova password">
        <input id="ac-pw2" type="password" autocomplete="new-password" placeholder="Ripeti la nuova password" aria-label="Ripeti la nuova password">
        <button class="btn" type="submit">Cambia password</button>
      </form>
      <p class="au-err" id="m-pw" role="status"></p>
    </section>
    <section class="panel acard danger-zone" id="dangerZone"><div class="eyebrow">Danger zone</div>
      <h3>Azzera i progressi</h3>
      ${dangerHTML("dz", "Cancello tutti i tuoi progressi, sul tuo account e su tutti i tuoi dispositivi: figure imparate, ripasso, statistiche, scenari, livello e record della Prova. L'account, l'email e la newsletter restano come sono.")}
    </section>
    <section class="panel acard danger-zone" id="deleteZone"><div class="eyebrow">Danger zone</div>
      <h3>Elimina l'account</h3>
      ${dangerHTML("da", "Elimino per sempre il tuo account: username, email, progressi e iscrizione alla newsletter, su tutti i dispositivi.", "Elimina il mio account", DELETE_WORD)}
    </section>
    <div class="actions"><button class="btn ghost" type="button" id="ac-out">Esci dall'account</button></div>`;
  if(window.DojoSuoni) DojoSuoni.paint();
  bindTrain();
  box.querySelector(".u-name").textContent = (prof && prof.username) || (u.user_metadata && u.user_metadata.username) || "";
  box.querySelector(".u-mail").textContent = legacy ? "Nessuna: aggiungila per recuperare la password e ricevere le email" : u.email;
  const say = (id, m, ok) => { const el = $(id); el.textContent = m; el.className = ok ? "au-ok" : "au-err"; };
  bindDanger("dz", async () => { wipeProgress(Date.now()); await cloud.flush(); $("#dz-m").textContent = "Fatto: i progressi sono azzerati. Si riparte dal livello 1."; });
  bindDanger("da", async () => {
    try{ await cloud.deleteAccount(); }
    catch(e){ $("#da-m").textContent = /admin/i.test((e && e.message) || "") ? "Questo è un account admin: prima va tolto il ruolo admin." : cloud.errText(e); }
  }, DELETE_WORD);
  let newMail = "";
  $("#f-mail").onsubmit = async e => {
    e.preventDefault(); newMail = $("#ac-mail").value.trim().toLowerCase();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newMail)) return say("#m-mail", "Scrivi un indirizzo email valido.");
    const {error} = await sb.auth.updateUser({email: newMail});
    if(error) return say("#m-mail", cloud.errText(error));
    $("#f-mailcode").hidden = false; say("#m-mail", `Ti abbiamo mandato un codice a ${newMail}.`, true);
  };
  $("#f-mailcode").onsubmit = async e => {
    e.preventDefault();
    const {error} = await sb.auth.verifyOtp({email: newMail, token: $("#ac-mailcode").value.trim(), type: "email_change"});
    if(error) return say("#m-mail", cloud.errText(error));
    const {data: ref} = await sb.auth.refreshSession(); if(ref && ref.user) nlSync(ref.user, true);
    showAccount();
  };
  $("#ac-mkt").onchange = async e => {
    const on = e.target.checked;
    const {error} = await sb.from("profiles").update({marketing: on, marketing_at: new Date().toISOString()}).eq("id", u.id);
    if(error){ e.target.checked = !on; return say("#m-mkt", "Non riuscito: " + error.message); }
    say("#m-mkt", on ? "Iscritto alla newsletter." : "Non riceverai più la newsletter.", true);
    nlSync(u, true);
  };
  $("#ac-mfa").onclick = async () => {
    if(totp){
      const {error} = await sb.auth.mfa.unenroll({factorId: totp.id});
      if(error) return say("#m-mfa", cloud.errText(error));
      await sb.auth.refreshSession(); return showAccount();
    }
    // toglie eventuali attivazioni lasciate a metà, poi ne crea una nuova
    for(const f of ((fac && fac.all) || []).filter(f => f.status !== "verified")) await sb.auth.mfa.unenroll({factorId: f.id});
    const {data, error} = await sb.auth.mfa.enroll({factorType: "totp", issuer: "Dojo delle candele", friendlyName: "Dojo " + Date.now()});
    if(error) return say("#m-mfa", cloud.errText(error));
    $("#mfaBox").innerHTML = `<ol class="mfasteps"><li>Inquadra il codice QR con l'app di autenticazione.</li><li>Se non puoi inquadrarlo, inserisci a mano la chiave <code class="secret"></code></li><li>Scrivi qui il codice a 6 cifre che compare nell'app.</li></ol>
      <img class="qr" alt="Codice QR per l'app di autenticazione"><form id="f-mfa" class="row" novalidate><input id="ac-mfacode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="123456" aria-label="Codice dell'app"><button class="btn" type="submit">Attiva</button></form>`;
    $("#mfaBox .qr").src = data.totp.qr_code; $("#mfaBox .secret").textContent = data.totp.secret;
    $("#f-mfa").onsubmit = async e => {
      e.preventDefault();
      const r = await sb.auth.mfa.challengeAndVerify({factorId: data.id, code: $("#ac-mfacode").value.trim()});
      if(r.error) return say("#m-mfa", "Codice sbagliato: controlla l'orario del dispositivo e riprova.");
      showAccount();
    };
  };
  $("#f-pw").onsubmit = async e => {
    e.preventDefault();
    const a = $("#ac-pw").value, b = $("#ac-pw2").value;
    if(weakPw(a)) return say("#m-pw", "La password deve avere almeno 8 caratteri, con lettere e numeri.");
    if(a !== b) return say("#m-pw", "Le due password non coincidono.");
    try{ await cloud.setPassword(a); }catch(err){ return say("#m-pw", typeof err === "string" ? err : cloud.errText(err)); }
    $("#f-pw").reset(); say("#m-pw", "Password cambiata.", true);
  };
  $("#ac-out").onclick = () => cloud.logout();
}

/* ---------- boot ---------- */
function start(data){
  bindSeg("#famSeg", "fam", () => {});
  bindSeg("#studySeg", "sfilter", renderStudy);
  $("#hlToggle").checked = prefs.hl;
  $("#hlToggle").onchange = e => { prefs.hl = e.target.checked; savePrefs(); };
  selectMode(["srs","f2n","n2f","scen","prova"].includes(prefs.mode) ? prefs.mode : "srs");
  renderIllustrations();
  if(data && data.view && data.view !== "home") setTab(data.view); else goHome();
}
start({});
cloud.init();

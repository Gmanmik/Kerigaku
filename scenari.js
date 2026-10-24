/* Dojo delle candele · modulo Scenari (scenari.js, caricato dopo app.js).
   Usa le funzioni e i dati di app.js (P, BYID, chartSVG, makeContext, store, Q...) ed espone window.Scenari. */
(() => {
"use strict";
/* ---------- scenari: 2-3 figure in fila ----------
   Ogni scenario mette in sequenza figure dell'array P (più qualche candela di raccordo, "+2u" = 2 candele
   in salita, "+1d" = 1 in discesa). Chi studia riconosce le figure una per una, poi dice cosa raccontano
   insieme; alla fine si scoprono le candele successive. Hanno una loro Leitner (scen) separata dalle figure. */
const VERDICT = {up:"Svolta al rialzo confermata", down:"Svolta al ribasso confermata", wait:"Segnali opposti: meglio aspettare", cont:"Il trend in corso continua"};
const VORDER = ["up", "down", "wait", "cont"];
const SCEN = [
  {id:"s01", t:"d", seq:["hammer_p","belthold_p"], v:"up", title:"Martello confermato da un belt hold",
   x:"Il martello dice che i compratori hanno difeso il minimo. Il giorno dopo una candela verde lunga parte proprio da lì e sale per tutta la seduta: è la conferma che il martello da solo non dava."},
  {id:"s02", t:"u", seq:["hanging_m","engulf_m"], v:"down", title:"Impiccato confermato da un engulfing",
   x:"L'impiccato è solo un avvertimento: va confermato. Il giorno dopo arriva un engulfing ribassista che cancella tutta la candela verde precedente. Due segnali nella stessa direzione: la svolta è confermata."},
  {id:"s03", t:"d", seq:["haramix_p","3soldiers_p"], v:"up", title:"Harami cross seguito da tre soldati",
   x:"L'harami cross ferma il ribasso nell'indecisione. I tre soldati bianchi che seguono, con chiusure sempre più alte, dicono chi ha vinto: i compratori."},
  {id:"s04", t:"u", seq:["shooting_m","belthold_m"], v:"down", title:"Shooting star confermata da un belt hold",
   x:"La shooting star mostra che i prezzi alti sono stati respinti. La candela rossa lunga che apre sul massimo e scende tutta la seduta è la conferma."},
  {id:"s05", t:"d", seq:["matchlow_p","belthold_p"], v:"up", title:"Supporto del matching low, poi belt hold",
   x:"Il matching low disegna un supporto: due chiusure allo stesso prezzo. La candela verde lunga che parte da quel livello conferma che il supporto tiene."},
  {id:"s06", t:"u", seq:["matchhigh_m","3crows_m"], v:"down", title:"Resistenza del matching high, poi tre corvi",
   x:"Il matching high disegna una resistenza. Subito dopo tre corvi neri scendono con decisione da quel livello: la resistenza ha fermato il rialzo."},
  {id:"s07", t:"d", seq:["mstar_p","+2u","seplines_p"], v:"up", title:"Morning star, poi separating lines",
   x:"La morning star gira il mercato al rialzo. Qualche seduta dopo le separating lines rialziste dicono che il nuovo rialzo continua: la svolta regge."},
  {id:"s08", t:"u", seq:["estar_m","+2d","seplines_m"], v:"down", title:"Evening star, poi separating lines",
   x:"La evening star gira il mercato al ribasso. Le separating lines ribassiste che arrivano dopo confermano che il nuovo ribasso continua."},
  {id:"s09", t:"u", seq:["advblock_m","edoji_m"], v:"down", title:"Advance block e evening doji star",
   x:"Con l'advance block i compratori si stancano: corpi sempre più piccoli. La evening doji star subito dopo trasforma la stanchezza in svolta."},
  {id:"s10", t:"d", seq:["ladderbot_p","+1u","rising3_p"], v:"up", title:"Ladder bottom, poi rising three methods",
   x:"Il ladder bottom chiude il ribasso con una verde in gap. Il rising three methods che segue è una pausa dentro il nuovo rialzo, non una ricaduta."},
  {id:"s11", t:"u", seq:["dojistar_m","3crows_m"], v:"down", title:"Doji star seguita da tre corvi",
   x:"La doji star mostra esitazione sui massimi. I tre corvi neri trasformano l'esitazione in un ribasso deciso."},
  {id:"s12", t:"d", seq:["invhammer_p","+1u","uptasuki_p"], v:"up", title:"Martello invertito, poi upside tasuki gap",
   x:"Il martello invertito è il primo tentativo dei compratori. Dopo, un gap al rialzo che non viene chiuso (upside tasuki gap) dice che il rialzo ha preso forza."},
  {id:"s13", t:"u", seq:["haramix_m","engulf_m"], v:"down", title:"Harami cross confermato da un engulfing",
   x:"L'harami cross blocca il rialzo nell'indecisione. Poco dopo un engulfing ribassista risolve l'indecisione verso il basso."},
  {id:"s14", t:"d", seq:["belthold_p","3outside_p"], v:"up", title:"Belt hold, poi three outside up",
   x:"Il belt hold rialzista è il primo colpo dei compratori. Il three outside up, cioè un engulfing confermato, chiude la questione."},
  {id:"s15", t:"u", seq:["belthold_m","3outside_m"], v:"down", title:"Belt hold, poi three outside down",
   x:"Il belt hold ribassista è il primo colpo dei venditori. Il three outside down conferma con un engulfing seguito da una chiusura più bassa."},
  {id:"s16", t:"d", seq:["abandoned_p","+1u","seplines_p"], v:"up", title:"Abandoned baby, poi separating lines",
   x:"L'abandoned baby è una svolta rara e forte. Le separating lines che seguono dicono che il rialzo nato lì continua."},
  {id:"s17", t:"u", seq:["abandoned_m","+1d","seplines_m"], v:"down", title:"Abandoned baby, poi separating lines",
   x:"L'abandoned baby ribassista isola i massimi con due gap. Le separating lines ribassiste confermano che il ribasso continua."},
  {id:"s18", t:"d", seq:["sandwich_p","+1u","rising3_p"], v:"up", title:"Stick sandwich, poi rising three methods",
   x:"Lo stick sandwich segna un supporto con due chiusure uguali. Il rising three methods successivo mostra un rialzo che fa solo una pausa."},
  {id:"s19", t:"u", seq:["upgap2crows_m","3crows_m"], v:"down", title:"Upside gap two crows, poi tre corvi",
   x:"I due corvi sopra il gap sono un primo cedimento. I tre corvi neri che seguono lo confermano con forza."},
  {id:"s20", t:"u", seq:["harami_m","3crows_m"], v:"down", title:"Harami seguito da tre corvi",
   x:"L'harami ribassista dice che il rialzo rallenta. I tre corvi neri confermano che i venditori hanno preso il controllo."},
  {id:"s21", t:"d", seq:["engulf_p","haramix_m"], v:"wait", title:"Engulfing rialzista, poi harami cross ribassista",
   x:"L'engulfing promette la svolta al rialzo, ma subito dopo un harami cross mostra indecisione e un possibile stop. I due segnali tirano in direzioni opposte: meglio aspettare una conferma."},
  {id:"s22", t:"u", seq:["shooting_m","engulf_p"], v:"wait", title:"Shooting star, poi engulfing rialzista",
   x:"La shooting star avverte che il rialzo è stanco, ma il giorno dopo un engulfing rialzista dice il contrario. Segnali opposti: chi aspetta una candela in più non sbaglia."},
  {id:"s23", t:"d", seq:["homing_p","dojistar_p"], v:"wait", title:"Homing pigeon e doji star",
   x:"Homing pigeon e doji star dicono entrambe che il ribasso rallenta, ma nessuna delle due è una conferma. Due segnali deboli non fanno una svolta: si aspetta una candela verde decisa."},
  {id:"s24", t:"u", seq:["deliberation_m","sbswhite_p"], v:"wait", title:"Deliberation, poi side by side white lines",
   x:"Il deliberation dice che il rialzo perde slancio, le side by side white lines che continua. I segnali si contraddicono: meglio aspettare."},
  {id:"s25", t:"d", seq:["harami_p","+1u","harami_m"], v:"wait", title:"Harami rialzista, poi harami ribassista",
   x:"Prima un harami rialzista, poi uno ribassista: il mercato è chiuso in un'indecisione sempre più stretta. Finché non esce da lì, meglio non scegliere una direzione."},
  {id:"s26", t:"u", seq:["harami_m","engulf_p"], v:"wait", title:"Harami ribassista, poi engulfing rialzista",
   x:"L'harami avverte che il rialzo rallenta, ma l'engulfing rialzista lo smentisce subito. Due segnali opposti uno dopo l'altro: meglio aspettare."},
  {id:"s27", t:"d", seq:["hammer_p","onneck_m"], v:"cont", title:"Martello non confermato: on neck line",
   x:"Il martello faceva sperare in una svolta, ma il giorno dopo arriva una rossa lunga e il rimbalzo si ferma al suo minimo (on neck line). Il martello non è confermato: il ribasso continua."},
  {id:"s28", t:"d", seq:["dojistar_p","dntasuki_m"], v:"cont", title:"Doji star smentita da un downside tasuki gap",
   x:"La doji star segnalava esitazione, ma poi il prezzo scende in gap e il rimbalzo non chiude il gap (downside tasuki gap). Il ribasso continua."},
  {id:"s29", t:"u", seq:["harami_m","uptasuki_p"], v:"cont", title:"Harami smentito da un upside tasuki gap",
   x:"L'harami ribassista avvertiva di un rallentamento, ma subito dopo il prezzo sale in gap e il gap regge (upside tasuki gap). Il rialzo continua."},
  {id:"s30", t:"u", seq:["haramix_m","+1u","rising3_p"], v:"cont", title:"Harami cross smentito dal rising three methods",
   x:"L'harami cross metteva in dubbio il rialzo, ma il rising three methods che segue mostra solo una pausa e poi un nuovo massimo. Il rialzo continua."},
  {id:"s31", t:"d", seq:["harami_p","falling3_m"], v:"cont", title:"Harami smentito dal falling three methods",
   x:"L'harami rialzista faceva pensare a un rallentamento, ma il falling three methods mostra una breve risalita e poi un nuovo minimo. Il ribasso continua."},
  {id:"s32", t:"u", seq:["hanging_m","+1u","seplines_p"], v:"cont", title:"Impiccato non confermato, poi separating lines",
   x:"L'impiccato va sempre confermato. Qui la conferma non arriva: il prezzo riparte e le separating lines rialziste dicono che il rialzo continua."},
  {id:"s33", t:"d", seq:["onneck_m","+1d","inneck_m"], v:"cont", title:"On neck e in neck: rimbalzi deboli",
   x:"Due rimbalzi di fila (on neck, poi in neck) che non riescono a risalire nel corpo rosso precedente. Sono rimbalzi deboli: il ribasso continua."}
];
const SCEN_BY = Object.fromEntries(SCEN.map(s => [s.id, s]));
const SCEN_NEW = 3, SCEN_MAX = 10;
let scen = {}, scenDaily = {day:0, newCount:0};          // id -> {b, due}, come srs; una copia per utente come gli altri dati
function load(){ scen = store.get(K("dojo-scen-v1"), {}); scenDaily = store.get(K("dojo-scen-daily-v1"), {day:0, newCount:0}); }
function saveScen(){ store.set(K("dojo-scen-v1"), scen); store.set(K("dojo-scen-daily-v1"), scenDaily); cloud.schedule(); }
const ss = id => scen[id] || {b:0, due:0};
function scenNewLeft(){ const t = today(); if(scenDaily.day !== t) scenDaily = {day:t, newCount:0}; return Math.max(0, SCEN_NEW - scenDaily.newCount); }
function scenQueue(){
  const t = today();
  const due = SCEN.filter(s => ss(s.id).b > 0 && ss(s.id).due <= t).sort((a, b) => ss(a.id).due - ss(b.id).due).slice(0, SCEN_MAX);
  const fresh = SCEN.filter(s => ss(s.id).b === 0).slice(0, scenNewLeft());
  return {due, fresh};
}
function scenHint(){
  const {due, fresh} = scenQueue(), known = SCEN.filter(s => ss(s.id).b >= 3).length;
  const tail = ` Ne conosci ${known} su ${SCEN.length}.`;
  if(!due.length && !fresh.length) return "Per oggi gli scenari sono finiti: puoi rifarne qualcuno a caso." + tail;
  const parts = [];
  if(due.length) parts.push(due.length === 1 ? "1 scenario da ripassare" : `${due.length} scenari da ripassare`);
  if(fresh.length) parts.push(fresh.length === 1 ? "1 nuovo" : `${fresh.length} nuovi`);
  return "Oggi: " + parts.join(" e ") + "." + tail;
}

// costruisce le candele: trend iniziale, figure in fila, raccordi e 3 candele "dopo" da scoprire alla fine
const cOpen = c => c[0] === "w" ? c[2] : c[3], cClose = c => c[0] === "w" ? c[3] : c[2];
const lift = (cs, d) => cs.map(([k, l, b, t, h]) => [k, l + d, b + d, t + d, h + d]);
function walk(from, n, dir){
  const out = []; let o = from;
  for(let i = 0; i < n; i++){
    const size = rnd(6, 11), up = dir === "u" || (dir === "s" && i % 2 === 0);
    const c = up ? o + size : o - size;
    const k = up ? "w" : "b", b = Math.min(o, c), t = Math.max(o, c);
    out.push([k, b - rnd(1, 4), b, t, t + rnd(1, 4)]);
    o = dir === "s" ? (up ? c - size * .3 : c + size * .3) : c + (up ? rnd(-1.5, .5) : rnd(-.5, 1.5));
  }
  return out;
}
function buildScen(s){
  let cs = [], zones = [], low = null, high = null;
  for(const tok of s.seq){
    const last = cs.length ? cClose(cs[cs.length - 1]) : 0;
    if(tok[0] === "+"){ cs = cs.concat(walk(last, +tok[1], tok[2])); continue; }
    const p = BYID[tok];
    let d = cs.length ? last - cOpen(p.c[0]) + rnd(-1, 1) : 0;
    const lo = Math.min(...p.c.map(c => c[1])), hi = Math.max(...p.c.map(c => c[4]));
    // una conferma non rompe il minimo (rialzo) o il massimo (ribasso) della prima figura
    if(s.v === "up" && low !== null) d = Math.max(d, low - lo + rnd(.5, 2));
    if(s.v === "down" && high !== null) d = Math.min(d, high - hi - rnd(.5, 2));
    if(low === null){ low = lo + d; high = hi + d; }
    zones.push({a: cs.length, b: cs.length + p.c.length - 1, id: p.id});
    cs = cs.concat(lift(p.c, d));
  }
  const lead = makeContext({trend: s.t, c: cs.slice(0, zones[0].b + 1)});
  lead.unshift(...makeContext({trend: s.t, c: lead.length ? [lead[0]] : cs}).slice(0, 1));
  const after = s.v === "up" ? "u" : s.v === "down" ? "d" : s.v === "wait" ? "s" : s.t;
  const tail = walk(cClose(cs[cs.length - 1]), 3, after);
  zones.forEach(z => { z.a += lead.length; z.b += lead.length; });
  return {c: lead.concat(cs, tail), zones, tailN: tail.length};
}

function scenSVG(B, o = {}){
  const all = B.c, n = all.length, shown = o.reveal ? n : n - B.tailN;
  const W = o.w || 640, H = o.h || 280, padX = 14, padY = 26;
  const lo = Math.min(...all.map(c => c[1])), hi = Math.max(...all.map(c => c[4]));
  const slot = Math.min(o.maxSlot || 40, (W - 2*padX) / n), x0 = (W - slot * n) / 2 + slot / 2;
  const s = (H - 2*padY) / Math.max(hi - lo, 20), yOff = padY + ((H - 2*padY) - (hi - lo) * s) / 2;
  const Y = v => H - yOff - (v - lo) * s;
  const bw = Math.max(4, Math.min(o.maxBody || 18, slot * .58)), sw = Math.max(1.2, Math.min(2, bw / 8));
  let g = "";
  for(let i=1;i<5;i++){ const y = (H*i/5).toFixed(1); g += `<line x1="0" x2="${W}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-width="1" stroke-dasharray="2 4" opacity=".7"/>`; }
  B.zones.forEach((z, i) => {
    const on = i === o.active, xa = x0 + z.a*slot - slot/2 + 2, xb = x0 + z.b*slot + slot/2 - 2;
    g += `<rect x="${xa.toFixed(1)}" y="3" width="${(xb-xa).toFixed(1)}" height="${H-6}" rx="7" fill="${on ? "var(--hl)" : "transparent"}" stroke="var(--hl-line)" stroke-width="1" stroke-dasharray="3 3" opacity="${on || o.active == null ? 1 : .55}"/>`;
    g += `<circle cx="${((xa+xb)/2).toFixed(1)}" cy="15" r="9" fill="${on ? "var(--seal)" : "var(--card)"}" stroke="${on ? "var(--seal)" : "var(--hl-line)"}"/><text x="${((xa+xb)/2).toFixed(1)}" y="19" text-anchor="middle" font-size="11" font-weight="700" font-family="var(--body)" fill="${on ? "var(--seal-ink)" : "var(--muted)"}">${i+1}</text>`;
  });
  if(!o.reveal){
    const xa = x0 + shown*slot - slot/2 + 2, xb = x0 + (n-1)*slot + slot/2 - 2;
    g += `<rect x="${xa.toFixed(1)}" y="3" width="${(xb-xa).toFixed(1)}" height="${H-6}" rx="7" fill="var(--well)" stroke="var(--line2)" stroke-width="1" stroke-dasharray="3 3"/><text x="${((xa+xb)/2).toFixed(1)}" y="${H/2+8}" text-anchor="middle" font-size="24" font-family="var(--display)" fill="var(--line2)">?</text>`;
  }
  all.slice(0, shown).forEach((c, i) => {
    const cx = x0 + i*slot, [k, l, b, t, h] = c, fade = i >= n - B.tailN ? ` opacity=".85"` : "";
    if(k === "d"){
      g += `<g${fade}><line x1="${cx}" x2="${cx}" y1="${Y(h)}" y2="${Y(l)}" stroke="var(--doji)" stroke-width="${sw}"/><line x1="${cx-bw*.62}" x2="${cx+bw*.62}" y1="${Y(b)}" y2="${Y(b)}" stroke="var(--doji)" stroke-width="${sw*1.1}"/></g>`;
      return;
    }
    const col = k === "w" ? "var(--bull)" : "var(--bear)", yt = Y(t), hh = Math.max(1.6, (t - b) * s);
    g += `<g${fade}><line x1="${cx}" x2="${cx}" y1="${Y(h)}" y2="${Y(l)}" stroke="${col}" stroke-width="${sw}"/><rect x="${(cx-bw/2).toFixed(1)}" y="${yt.toFixed(1)}" width="${bw.toFixed(1)}" height="${hh.toFixed(1)}" rx="1.5" fill="${col}"/></g>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.aria || "Scenario a candele")}">${g}</svg>`;
}

function scenRound(only){
  let qs, free = false;
  if(only) qs = only.map(id => SCEN_BY[id]);
  else {
    const {due, fresh} = scenQueue();
    if(!due.length && !fresh.length) return renderScenDone();
    qs = shuffle(due.slice()).concat(fresh);
  }
  if(only) free = true;
  Q = {mode:"scen", qs, free, fresh: new Set(qs.filter(s => ss(s.id).b === 0).map(s => s.id)), requeued:{}, i:0, res:[], streak:0, best:0};
  renderScen();
}
function scenStart(){
  const s = Q.qs[Q.i];
  Q.cur = {s, B: buildScen(s), step: 0, picks: [], answered: false,
    opts: s.seq.filter(t => t[0] !== "+").map(id => shuffle([BYID[id], ...distractors(BYID[id], P, 3)]))};
}
function renderScen(){
  if(Q.i >= Q.qs.length) return renderScenSummary();
  if(!Q.cur || Q.cur.s !== Q.qs[Q.i] || Q.cur.i !== Q.i){ scenStart(); Q.cur.i = Q.i; }
  const {s, B, step, answered} = Q.cur, nz = B.zones.length, last = step === nz;
  const pips = Q.qs.map((_, i) => `<span class="pip ${i < Q.res.length ? (Q.res[i] ? "ok" : "ko") : (i === Q.i ? "cur" : "")}"></span>`).join("");
  const steps = Array.from({length: nz + 1}, (_, i) => `<span class="${i < step || (i === step && answered) ? (Q.cur.picks[i] ? "ok" : "ko") : i === step ? "cur" : ""}">${i < nz ? i + 1 : "?"}</span>`).join("");
  let body = `<div class="scen-top"><span class="eyebrow">${Q.fresh.has(s.id) && !Q.free ? "Scenario nuovo" : "Scenario"} · ${s.t === "d" ? "dopo un ribasso" : "dopo un rialzo"}</span><span class="scen-steps" aria-label="Passo ${step + 1} di ${nz + 1}">${steps}</span></div>`;
  if(!last) body += `<h2 class="prompt">Quale figura c'è nella zona ${step + 1}?<small>Le figure sono ${nz}, una per zona. Le candele dopo il punto di domanda le scopri alla fine.</small></h2>`;
  else body += `<h2 class="prompt">Lette insieme, cosa dicono queste figure?<small>${B.zones.map((z, i) => `${i + 1}: ${esc(BYID[z.id].name)} ${BYID[z.id].bull ? "▲" : "▼"}`).join(" · ")}</small></h2>`;
  const narrow = window.innerWidth < 640;
  body += `<div class="bigchart">${scenSVG(B, {active: last ? null : step, reveal: last && answered, w: narrow ? 380 : 640, h: narrow ? 300 : 280, aria: "Scenario da leggere"})}</div>`;
  if(!last){
    const t = BYID[B.zones[step].id], pick = Q.cur.picks[step];
    body += `<div class="opts">${Q.cur.opts[step].map((p, i) => `<button class="opt ${answered ? (p.id === t.id ? "right" : p.id === Q.cur.pick ? "wrong" : "") : ""}" data-id="${p.id}" ${answered ? "disabled" : ""}><span class="nm">${esc(p.name)}</span><span style="display:flex;gap:6px;align-items:center">${chipDir(p)}<span class="k">${i+1}</span></span></button>`).join("")}</div>`;
    if(answered) body += `<div class="fb ${pick ? "ok" : "ko"}" role="status"><h3>${pick ? "Giusto!" : "Non proprio."} ${esc(t.name)} ${chipDir(t)}</h3><p>${esc(t.d)}</p><div class="actions"><button class="btn" id="next">Continua</button><span class="hint">oppure premi Invio</span></div></div>`;
  } else {
    body += `<div class="opts verdicts">${VORDER.map((v, i) => `<button class="opt ${answered ? (v === s.v ? "right" : v === Q.cur.pick ? "wrong" : "") : ""}" data-id="${v}" ${answered ? "disabled" : ""}><span class="nm">${VERDICT[v]}</span><span class="k">${i+1}</span></button>`).join("")}</div>`;
    if(answered){
      const ok = Q.cur.picks[nz], all = Q.cur.picks.every(Boolean), g = Q.cur.grade;
      body += `<div class="fb ${ok ? "ok" : "ko"}" role="status"><h3>${ok ? "Giusto!" : "Non proprio."} ${esc(VERDICT[s.v])}</h3><p><b>${esc(s.title)}.</b> ${esc(s.x)}</p><p class="hint" style="margin:0">Le candele nella zona del punto di domanda mostrano come è andata dopo. Uno scenario è un esempio di scuola: sui mercati veri nessuna figura è una garanzia.</p>`;
      if(g) body += `<span class="nextchip">${all ? "Lo rivedrai " + whenText(g.due) : Q.requeued[s.id] ? "Te lo richiedo tra poco" : "Lo rivedrai oggi stesso"}</span>`;
      body += `<div class="actions"><button class="btn" id="next">${Q.i + 1 >= Q.qs.length ? "Vedi il risultato" : "Prossimo scenario"}</button><span class="hint">oppure premi Invio</span></div></div>`;
    }
  }
  $("#quiz").innerHTML = `<div class="qhead"><div class="pips" aria-label="Avanzamento">${pips}</div><div class="streak">Di fila <b>${Q.streak}</b> · Record <b>${Q.best}</b></div></div><div class="panel qcard scen">${body}</div>`;
  $("#quiz").querySelectorAll(".opt").forEach(b => b.onclick = () => scenAnswer(b.dataset.id));
  const nx = $("#next"); if(nx){ nx.onclick = scenNext; nx.focus({preventScroll:true}); }
}
function scenAnswer(id){
  const c = Q.cur; if(c.answered) return;
  const nz = c.B.zones.length;
  c.answered = true; c.pick = id;
  if(c.step < nz){
    const t = c.B.zones[c.step].id, ok = id === t;
    c.picks[c.step] = ok;
    const st = stats[t] || (stats[t] = {r:0, w:0}); ok ? st.r++ : st.w++; saveStats();
  } else {
    c.picks[nz] = id === c.s.v;
    const all = c.picks.every(Boolean), s = c.s;
    Q.res.push(all);
    Q.streak = all ? Q.streak + 1 : 0; Q.best = Math.max(Q.best, Q.streak);
    if(!Q.free){
      if(Q.fresh.has(s.id) && !ss(s.id).b){ scenNewLeft(); scenDaily.newCount++; }
      const v = Object.assign({b:0, due:0}, scen[s.id]);
      v.b = all ? (Q.requeued[s.id] ? 1 : Math.min(5, v.b + 1)) : 1;
      v.due = today() + (all ? INT[v.b] : 0);
      scen[s.id] = v; saveScen(); c.grade = v;
      if(!all && !Q.requeued[s.id]){ Q.requeued[s.id] = 1; Q.qs.splice(Math.min(Q.qs.length, Q.i + 3), 0, s); }
    }
  }
  renderScen();
}
function scenNext(){
  const c = Q.cur;
  if(c.step < c.B.zones.length){ c.step++; c.answered = false; c.pick = null; }
  else { Q.i++; Q.cur = null; }
  renderScen();
  window.scrollTo({top: Math.min(window.scrollY, $("#quiz").offsetTop - 80), behavior:"smooth"});
}
function scenKey(e){
  const c = Q.cur; if(!c) return;
  if(!c.answered && /^[1-4]$/.test(e.key)){
    const k = +e.key - 1;
    const id = c.step < c.B.zones.length ? (c.opts[c.step][k] || {}).id : VORDER[k];
    if(id) scenAnswer(id);
  } else if(c.answered && e.key === "Enter" && document.activeElement?.id !== "next") scenNext();
}
function renderScenDone(){
  const nd = Object.values(scen).filter(c => c.b > 0).map(c => c.due);
  $("#quiz").innerHTML = `<div class="panel summary"><div class="eyebrow">Scenari</div><p class="score">Per oggi hai finito.</p>
    <p style="margin:0;color:var(--muted);max-width:60ch">${nd.length ? `I prossimi scenari da ripassare arrivano ${whenText(Math.min(...nd))}. ` : ""}Domani ne arrivano ${SCEN_NEW} nuovi. Intanto puoi rifarne 5 a caso, senza che contino per il ripasso.</p>
    <div class="actions"><button class="btn" id="freeGo">5 scenari a caso</button><button class="btn ghost" id="homeGo">Torna al menu</button></div></div>`;
  $("#freeGo").onclick = () => scenRound(shuffle(SCEN.map(s => s.id)).slice(0, 5));
  $("#homeGo").onclick = goHome;
}
function renderScenSummary(){
  const good = Q.res.filter(Boolean).length, tot = Q.res.length;
  const wrong = [...new Set(Q.qs.filter((_, i) => !Q.res[i]).map(s => s.title))];
  $("#quiz").innerHTML = `<div class="panel summary"><div class="eyebrow">${Q.free ? "Fine del giro" : "Scenari di oggi finiti"}</div>
    <p class="score">${good === tot ? "Tutto giusto, ottimo." : good >= tot * .6 ? "Buon lavoro." : "Si impara sbagliando."}</p>
    <div class="pips">${Q.res.map(r => `<span class="pip ${r ? "ok" : "ko"}"></span>`).join("")}</div>
    <p style="margin:0;color:var(--muted)">Letti senza errori: ${good} su ${tot}. Uno scenario conta giusto solo se riconosci tutte le figure e la lettura finale.</p>
    ${wrong.length ? `<div><div class="eyebrow" style="margin-bottom:8px">Da rivedere</div><div class="sched">${wrong.map(t => `<div><span>${esc(t)}</span></div>`).join("")}</div></div>` : ""}
    <div class="actions"><button class="btn" id="homeGo">Torna al menu</button><button class="btn ghost" id="freeGo">5 scenari a caso</button></div></div>`;
  $("#homeGo").onclick = goHome;
  $("#freeGo").onclick = () => scenRound(shuffle(SCEN.map(s => s.id)).slice(0, 5));
}

// dati che app.js salva nell'account e unisce al login: per ogni scenario vince quello più avanti
const num = v => Number.isFinite(+v) ? +v : 0;
function merge(raw){
  let changed = false;
  const rs = {}, r = raw && typeof raw.scen === "object" && raw.scen ? raw.scen : {};
  for(const [id, c] of Object.entries(r)) if(Object.hasOwn(SCEN_BY, id) && c && typeof c === "object") rs[id] = {b: Math.max(0, Math.min(5, num(c.b))), due: num(c.due)};
  const out = Object.assign({}, rs);
  for(const [id, c] of Object.entries(scen)){
    const o = rs[id];
    if(!o || c.b > o.b || (c.b === o.b && c.due > o.due)){ out[id] = c; changed = true; }
  }
  const rd = raw && raw.scenDaily || {}, d = {day: num(rd.day), newCount: num(rd.newCount)};
  scenDaily = scenDaily.day > d.day || (scenDaily.day === d.day && scenDaily.newCount > d.newCount) ? (changed = true, scenDaily) : d;
  scen = out; store.set(K("dojo-scen-v1"), scen); store.set(K("dojo-scen-daily-v1"), scenDaily);
  return changed;
}
function ill(){
  const box = $("#ill-scen"); if(!box) return;
  const B = buildScen(SCEN[0]);
  box.innerHTML = scenSVG(B, {active: 1, w: 260, h: 104, maxSlot: 22, maxBody: 11});
}
load(); ill();
window.Scenari = {
  round: () => scenRound(), key: scenKey, render: renderScen, hint: scenHint, load, merge, ill,
  data: () => ({scen, scenDaily}),
  reset(){ scen = {}; scenDaily = {day:0, newCount:0}; saveScen(); }
};
if(prefs.mode === "scen" && view === "home") selectMode("scen", true);
})();

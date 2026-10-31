/* Rinforzo positivo "D · Unione". Nessuno script inline: carica questo file con defer.
   Uso:   DojoFesta.giusto({host, streak, n})   dopo ogni risposta GIUSTA (non dopo quelle sbagliate, e mai nella schermata di fallimento)
          DojoFesta.reset(host)                 a inizio sessione (svuota fila di tavolette e timbri)
   host  = elemento dove vive la fila (di solito il contenitore sotto l'intestazione della domanda); viene creato dentro .wall e .sigs.
   streak = risposte giuste di fila (Q.streak); n = risposte giuste nella sessione.
   Il suono usa DojoSuoni (già nel sito, spento di default, tasto Suoni): "giusto" resta come ora, qui si aggiunge "livello" per le feste grandi. */
(function(){
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var COL = ["var(--seal)","var(--bull)","var(--gold)","var(--ink)","#fff"];
  var busyUntil = 0;   // anti-spam: una festa grande alla volta, poi una pausa
  var TXT = {                                   // da spostare nei file di lingua se serve
    grades: [["大吉","Fortuna enorme","Un giorno intero di fortuna.",6,1],["中吉","Fortuna alta","La mano oggi è buona.",14,0],
             ["小吉","Piccola fortuna","Una alla volta, e il grafico si apre.",25,0],["吉","Fortuna","Giusto. Avanti così.",55,0]],
    di_fila: "DI FILA", sessione: "Sessione completa: dieci tavolette!"
  };
  var T = function(s){ return window.t ? window.t(s) : s; };   // testi nella lingua del sito (dizionari lingue/*.js)
  function pickGrade(){ var r = Math.random() * 100, a = 0, G = TXT.grades; for(var i = 0; i < G.length; i++){ a += G[i][3]; if(r < a) return G[i]; } return G[3]; }
  function el(tag, cls, html){ var d = document.createElement(tag); if(cls) d.className = cls; if(html) d.innerHTML = html; return d; }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function overlay(html, cls, ms){ var d = el("div", "fs " + (cls || ""), html); d.setAttribute("aria-hidden", "true"); document.body.appendChild(d); if(ms) setTimeout(function(){ d.remove(); }, ms); return d; }
  function suono(big){ if(big && window.DojoSuoni) try{ DojoSuoni.play("livello"); }catch(e){} }

  function fly(node, target, after){
    if(still || !target || !node.animate){ node.remove(); if(after) after(); return; }
    var a = node.getBoundingClientRect(), t = target.getBoundingClientRect();
    var dx = t.left + t.width / 2 - (a.left + a.width / 2), dy = t.top + t.height / 2 - (a.top + a.height / 2), sc = Math.max(.2, t.width / a.width);
    var an = node.animate([{transform:"translate(0,0) scale(1)", opacity:1},{transform:"translate(" + dx + "px," + dy + "px) scale(" + sc + ")", opacity:.9}],
      {duration:520, easing:"cubic-bezier(.6,0,.3,1)", fill:"forwards"});
    an.onfinish = function(){ node.remove(); if(after) after(); };
  }

  // effetti: liv 1 piccola, 2 media, 3 grande
  function fx(liv){
    if(still || document.hidden) return;
    var d = el("div", "star"); d.style.setProperty("--d", (1.6 + liv * .5) + "s"); document.body.appendChild(d); setTimeout(function(){ d.remove(); }, 3000);
    if(liv >= 2){
      var dm = el("div", "dim"); dm.style.setProperty("--d", (1.4 + liv * .5) + "s"); document.body.appendChild(dm); setTimeout(function(){ dm.remove(); }, 3000);
      var f = el("div", "flash"); document.body.appendChild(f); setTimeout(function(){ f.remove(); }, 1000);
    }
    var N = [16, 44, 90][liv - 1], W = innerWidth, H = innerHeight;
    for(var i = 0; i < N; i++) (function(i){
      var c = el("i", "cf"), side = liv > 1 && i % 2, x0 = side ? (i % 4 === 1 ? 0 : W) : W / 2, y0 = side ? H * .7 : H * .55;
      c.style.left = x0 + "px"; c.style.top = y0 + "px"; c.style.background = COL[Math.floor(Math.random() * COL.length)];
      if(Math.random() < .4) c.style.borderRadius = "50%";
      document.body.appendChild(c);
      var ang = (side ? (x0 === 0 ? -.6 : -2.54) : -1.57) + (Math.random() - .5) * 1.5, v = 260 + Math.random() * 420, dx = Math.cos(ang) * v, dy = Math.sin(ang) * v;
      var an = c.animate([{transform:"translate(0,0) rotate(0)", opacity:1},
        {transform:"translate(" + dx + "px," + dy + "px) rotate(" + (Math.random() * 360) + "deg)", opacity:1, offset:.35},
        {transform:"translate(" + (dx * 1.25) + "px," + (dy + H * .9) + "px) rotate(" + (Math.random() * 900) + "deg)", opacity:0}],
        {duration:1500 + Math.random() * 1100, easing:"cubic-bezier(.2,.7,.4,1)"});
      an.onfinish = function(){ c.remove(); };
    })(i);
    if(liv === 3) [.08, .92].forEach(function(p, k){ for(var j = 0; j < 3; j++){
      var s = el("div", "fest"); s.style.left = (p * 100 + (k ? -1 : 1) * j * 3) + "%"; s.style.setProperty("--c", COL[(j + k) % 4]); s.style.animationDelay = (j * .08) + "s";
      document.body.appendChild(s); setTimeout(function(x){ x.remove(); }, 2600, s); } });
  }

  function parts(host){
    var wall = host.querySelector(".wall"), sigs = host.querySelector(".sigs");
    if(!wall){ wall = el("div", "wall"); wall.setAttribute("aria-hidden", "true"); host.appendChild(wall); }
    if(!sigs){ sigs = el("div", "sigs"); sigs.setAttribute("aria-hidden", "true"); host.appendChild(sigs); }
    return {wall: wall, sigs: sigs};
  }
  function emaHTML(five, n, big){
    var svg = '<svg width="' + (big ? 40 : 14) + '" height="' + (big ? 64 : 22) + '" viewBox="0 0 14 22" aria-hidden="true"><line x1="7" x2="7" y1="1" y2="21" stroke="var(--ink)" stroke-width="1.2"/><rect x="3" y="6" width="8" height="10" fill="' + (n % 2 ? "var(--card)" : "var(--bull)") + '" stroke="var(--bull)" stroke-width="1.2"/></svg>';
    return big ? '<div class="ema big' + (five ? " cinque" : "") + '">' + svg + "</div>" : svg;
  }

  function tavoletta(host, n){
    var p = parts(host), slot = el("div", "ema" + (n % 5 === 0 ? " cinque" : ""), emaHTML(0, n, false));
    slot.style.visibility = "hidden"; p.wall.appendChild(slot);
    var big = overlay(emaHTML(n % 5 === 0, n, true), "drop");
    fx(1);
    setTimeout(function(){ fly(big, slot, function(){ slot.style.visibility = "visible"; }); }, still ? 0 : 650);
  }
  function striscia(streak){
    var g = streak % 5 === 0 ? TXT.grades[0] : pickGrade();
    fx(g[4] ? 3 : 2); suono(!!g[4]);
    overlay('<div class="omiBig' + (g[4] ? " dai" : "") + '"><div class="g">' + g[0] + '</div><div class="t"><b>' + esc(T(g[1])) + "</b><span>" + esc(T(g[2])) + "</span></div></div>", "strip", 1900);
  }
  function timbro(host, streak){
    var k = streak === 5 ? "五" : streak === 10 ? "十" : String(streak);
    if(streak !== 5 && streak % 10 === 0 && streak !== 10) k = String(streak);
    var p = parts(host);
    fx(3); suono(true);
    var big = overlay('<div class="sigBig"><div>' + esc(k) + "<small>" + esc(T(TXT.di_fila)) + "</small></div></div>", "stamp");
    setTimeout(function(){ var ph = el("i", "", esc(k)); ph.style.visibility = "hidden"; p.sigs.appendChild(ph); fly(big, ph, function(){ ph.style.visibility = "visible"; }); }, still ? 0 : 1100);
  }

  window.DojoFesta = {
    reset: function(host){ if(!host) return; var p = parts(host); p.wall.innerHTML = ""; p.sigs.innerHTML = ""; },
    giusto: function(o){
      if(!o || !o.host || document.hidden) return;
      var streak = o.streak | 0, n = o.n | 0, now = Date.now(), big = [];
      tavoletta(o.host, n);
      var milestone = streak === 5 || (streak >= 10 && streak % 10 === 0);
      var wait = Math.max(0, busyUntil - now);            // festa grande ancora in corso?
      if(wait && !milestone) return 0;                    // anti-spam: solo la tavoletta, ma il traguardo dei 5/10 di fila esce sempre (dopo)
      var omi = !wait && (streak % 5 === 0 || Math.random() < .17);
      if(omi) big.push(function(){ striscia(streak); });
      if(milestone) big.push(function(){ timbro(o.host, streak); });
      busyUntil = now + wait + (big.length ? big.length * 1250 + 1200 : 0);
      big.forEach(function(f, i){ setTimeout(f, wait + 700 + i * (still ? 0 : 1250)); });
      return big.length ? wait + 700 + big.length * 1250 + 600 : 0;   // ms di festa grande: chi chiama può aspettare prima di mostrare altro
    }
  };
})();

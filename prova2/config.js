/* Dojo · pagina ospite della Prova 2.0 (Go/WebAssembly). Prepara window.kerigakuConfig dai dati locali del giocatore
   e riceve il risultato a fine partita. Niente rete: il server non c'è ancora (prova_start/finish da definire col database nuovo). */
(function(){
"use strict";
function get(k, d){ try{ var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } }
// stesso "spazio" di app.js: chi ha l'accesso ha le chiavi con ":" + id utente, altrimenti le chiavi semplici
var space = "";
try{
  for(var i = 0; i < localStorage.length; i++){
    var k = localStorage.key(i);
    if(/^sb-.+-auth-token$/.test(k)){
      var s = JSON.parse(localStorage.getItem(k) || "null"), u = s && (s.user || (s.currentSession && s.currentSession.user));
      if(u && u.id){ space = ":" + u.id; break; }
    }
  }
}catch(e){}
var srs = get("dojo-srs-v1" + space, {});
var known = Object.keys(srs).filter(function(id){ return srs[id] && srs[id].b >= 1; });   // cintura gialla o più
var th = ""; try{ th = localStorage.getItem("dojo-theme") || ""; }catch(e){}
var night = th === "dark" || (th !== "light" && window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches);
var lang = "it"; try{ lang = localStorage.getItem("dojo-lang") || "it"; }catch(e){}
lang = lang === "pt" ? "pt-BR" : lang;
var done = get("dojo-prova2-v1" + space, {});
window.kerigakuConfig = {lang: lang, difficulty: done.tutorial ? "normale" : "tutorial", night: night, tutorialDone: !!done.tutorial, known: known, admin: false, suspended: ""};
// «Torna al Dojo» nel menu del gioco: va alla pagina principale del sito
window.kerigakuExit = function(){ location.href = "../"; };
// risultato della partita: per ora resta solo sul dispositivo (nessun punto assegnato finché il server non lo ricalcola)
window.kerigakuFinish = function(json){
  try{
    var r = JSON.parse(json), d = get("dojo-prova2-v1" + space, {});
    if(r.mode === "tutorial") d.tutorial = true;
    d.last = {mode: r.mode, won: !!r.won, net: r.net, turns: r.turns, at: Date.now()};
    localStorage.setItem("dojo-prova2-v1" + space, JSON.stringify(d));
  }catch(e){}
};
})();

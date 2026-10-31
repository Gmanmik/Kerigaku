/* Lingua del Dojo. Il sito è scritto in italiano; per le altre lingue carica lingue/<codice>.js, un dizionario
   "frase italiana → traduzione", e traduce la pagina mentre si disegna (anche quello che app.js aggiunge dopo).
   Si carica nell'<head>, subito dopo theme-init.js. La scelta resta nel browser (dojo-lang); al primo accesso segue la lingua del browser. */
(function(){
  var LANGS = {it: "Italiano", en: "English", es: "Español", pt: "Português", fr: "Français"};
  var lang = "it";
  try{ lang = localStorage.getItem("dojo-lang") || ""; }catch(e){}
  // un link con ?lang=en apre il sito in quella lingua e la ricorda
  var q = (location.search.match(/[?&]lang=([a-z]{2})/) || [])[1];
  if(q && LANGS[q]){ lang = q; try{ localStorage.setItem("dojo-lang", q); }catch(e){} }
  if(!LANGS[lang]){
    var nav = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "it"]);
    lang = "en";
    for(var i = 0; i < nav.length; i++){ var c = String(nav[i]).slice(0, 2).toLowerCase(); if(LANGS[c]){ lang = c; break; } }
  }
  document.documentElement.lang = lang;
  window.DOJO_LANG = lang;
  window.DOJO_LANGS = LANGS;
  window.setDojoLang = function(l){
    if(!LANGS[l]) return;
    try{ localStorage.setItem("dojo-lang", l); }catch(e){}
    location.href = location.pathname + location.search.replace(/[?&]lang=[a-z]{2}/, "").replace(/^&/, "?") + location.hash;
  };
  // pulsanti e link della lingua (in fondo alla pagina e nelle Impostazioni); quello della lingua in uso non si vede
  document.addEventListener("click", function(e){
    var b = e.target.closest && e.target.closest("[data-set-lang]");
    if(b){ e.preventDefault(); setDojoLang(b.getAttribute("data-set-lang")); }
  });
  document.addEventListener("DOMContentLoaded", function(){
    var ls = document.querySelectorAll("a[data-set-lang]");
    for(var i = 0; i < ls.length; i++) if(ls[i].getAttribute("data-set-lang") === lang && !ls[i].closest("[data-solo-tradotto]")) ls[i].hidden = true;
    if(lang !== "it"){ var n = document.querySelectorAll("[data-solo-tradotto]"); for(var j = 0; j < n.length; j++) n[j].hidden = false; }
  });
  // italiano: niente da tradurre, t() restituisce la frase così com'è
  window.t = function(s){ return s; };
  if(lang === "it") return;
  // il dizionario va caricato prima del resto della pagina (script dello stesso sito: la CSP lo permette)
  document.write('<script src="lingue/' + lang + '.js"><\/script><script src="lingua-traduci.js"><\/script>');
})();

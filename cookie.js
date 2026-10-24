/* Avviso cookie del Dojo delle candele.
   Il sito usa solo strumenti tecnici necessari (accesso, progressi, tema, controllo anti-robot):
   per le regole UE e le linee guida del Garante non serve un consenso, basta informare.
   Le statistiche sono Cloudflare Web Analytics, senza cookie né memoria sul dispositivo, quindi restano fuori dal consenso.
   L'avviso compare una volta per dispositivo; se un giorno aggiungi statistiche con cookie o pubblicità,
   qui dovrà diventare una richiesta di consenso con "Accetta" e "Rifiuta". */
(function(){
  var KEY = "dojo-cookie-info-v1";
  try{ if(localStorage.getItem(KEY)) return; }catch(e){}
  var css = document.createElement("style");
  css.textContent =
    ".ck-bar{position:fixed;left:12px;right:12px;bottom:max(12px,env(safe-area-inset-bottom,0px));z-index:50;max-width:620px;margin:0 auto;" +
    "background:var(--card,#FBF8F2);color:var(--ink,#1D1A16);border:1px solid var(--line,#DCD2C1);border-radius:4px;padding:14px 16px;" +
    "box-shadow:0 10px 30px rgba(0,0,0,.18);display:flex;gap:12px 16px;align-items:center;flex-wrap:wrap;font:14px/1.5 var(--body,system-ui,sans-serif)}" +
    ".ck-bar p{margin:0;flex:1 1 300px;color:var(--muted,#6E665A)}" +
    ".ck-bar b{color:var(--ink,#1D1A16);font-weight:600}" +
    ".ck-bar a{color:var(--accent,#BF3A22)}" +
    ".ck-bar button{font:inherit;font-weight:600;border:0;border-radius:2px;padding:8px 18px;cursor:pointer;background:var(--ink,#1D1A16);color:var(--paper,#F3EEE4)}" +
    ".ck-bar button:focus-visible{outline:2px solid var(--accent,#BF3A22);outline-offset:2px}";
  var bar = document.createElement("div");
  bar.className = "ck-bar"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", "Informativa sui cookie");
  bar.innerHTML = '<p><b>Niente cookie di profilazione.</b> Il Dojo salva sul tuo dispositivo solo ciò che serve a farlo funzionare: accesso, progressi, tema e controllo anti-robot. Le visite le contiamo in forma anonima, senza cookie. <a href="privacy.html#cookie">Dettagli</a></p><button type="button">Ho capito</button>';
  bar.querySelector("button").onclick = function(){
    try{ localStorage.setItem(KEY, new Date().toISOString()); }catch(e){}
    bar.remove(); document.body.style.paddingBottom = "";
  };
  // spazio in fondo alla pagina grande quanto l'avviso, così non copre mai i pulsanti (per esempio "Entra" sul telefono)
  function show(){ document.head.appendChild(css); document.body.appendChild(bar); document.body.style.paddingBottom = (bar.offsetHeight + 24) + "px"; }
  if(document.body) show(); else document.addEventListener("DOMContentLoaded", show);
})();

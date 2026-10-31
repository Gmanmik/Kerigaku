/* Traduce la pagina con il dizionario di lingue/<codice>.js (window.DOJO_I18N), caricato da lingua.js solo se la lingua non è l'italiano.
   Il dizionario ha tre parti:
   t: frase italiana → traduzione (testi semplici, title, placeholder, aria-label, alt)
   h: frase con grassetti o link (l'HTML interno dell'elemento) → traduzione con gli stessi tag nello stesso ordine
   p: [modello, traduzione] per le frasi con numeri o nomi dentro, es. ["Oggi ti aspettano (\\d+) nuove\\.", "Today: $1 new ones."]
   Un MutationObserver traduce sia l'HTML della pagina sia quello che app.js aggiunge dopo. */
(function(){
  var D = window.DOJO_I18N || {}, T = D.t || {}, H = D.h || {};
  var P = (D.p || []).map(function(x){ return [new RegExp("^" + x[0] + "$"), x[1]]; });
  var ATTRS = ["placeholder", "title", "aria-label", "alt"];
  var SKIP = {SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1, CODE: 1};
  var INLINE = {B: 1, I: 1, EM: 1, STRONG: 1, A: 1, SPAN: 1, BR: 1, SMALL: 1, U: 1, SUP: 1, SUB: 1, ABBR: 1, KBD: 1, MARK: 1, CODE: 1};
  var norm = function(s){ return String(s).replace(/\s+/g, " ").trim(); };
  function tr(s, depth){
    var k = norm(s); if(!k) return null;
    if(Object.prototype.hasOwnProperty.call(T, k)) return T[k];
    if((depth || 0) > 3) return null;
    for(var i = 0; i < P.length; i++){
      var m = k.match(P[i][0]);
      // i pezzi presi dal modello si traducono a loro volta (es. "Arriva tra 3 giorni" → "tra 3 giorni" → "in 3 days")
      if(m) return P[i][1].replace(/\$(\d)/g, function(_, n){ var v = m[+n] || "", x = tr(v, (depth || 0) + 1); return x === null ? v : x; });
    }
    return null;
  }
  window.t = function(s){ var x = tr(s); return x === null ? s : x; };
  function text(n){
    var x = tr(n.data); if(x === null) return;
    var lead = n.data.match(/^\s*/)[0], tail = n.data.match(/\s*$/)[0];
    if(n.data !== lead + x + tail) n.data = lead + x + tail;
  }
  function attrs(el){
    for(var i = 0; i < ATTRS.length; i++){ var v = el.getAttribute(ATTRS[i]); if(v){ var x = tr(v); if(x !== null && x !== v) el.setAttribute(ATTRS[i], x); } }
    if(el.tagName === "META" && el.name === "description"){ var c = tr(el.content); if(c !== null) el.content = c; }
  }
  // frase con tag dentro: copio i testi della traduzione nei nodi esistenti (così restano i collegamenti e i tasti),
  // e rifaccio l'HTML solo se i tag non coincidono e dentro non c'è niente di cliccabile
  function mixed(el){
    var k = norm(el.innerHTML); if(!k || !Object.prototype.hasOwnProperty.call(H, k)) return false;
    if(norm(H[k]) === k) return true;   // già tradotta (o uguale): non la riscrivo, sennò ogni scrittura ne fa partire un'altra
    var tpl = document.createElement("template"); tpl.innerHTML = H[k];
    var a = [], b = [];
    (function walk(src, out){ for(var c = src.firstChild; c; c = c.nextSibling){ out.push(c.nodeType === 3 ? "#" : c.nodeName); if(c.nodeType === 1) walk(c, out); } })(el, a);
    (function walk(src, out){ for(var c = src.firstChild; c; c = c.nextSibling){ out.push(c.nodeType === 3 ? "#" : c.nodeName); if(c.nodeType === 1) walk(c, out); } })(tpl.content, b);
    if(a.join() === b.join()){
      var ta = [], tb = [];
      (function walk(src, out){ for(var c = src.firstChild; c; c = c.nextSibling){ if(c.nodeType === 3) out.push(c); else if(c.nodeType === 1) walk(c, out); } })(el, ta);
      (function walk(src, out){ for(var c = src.firstChild; c; c = c.nextSibling){ if(c.nodeType === 3) out.push(c); else if(c.nodeType === 1) walk(c, out); } })(tpl.content, tb);
      for(var i = 0; i < ta.length; i++) if(ta[i].data !== tb[i].data) ta[i].data = tb[i].data;
      // gli attributi tradotti del modello (title, href diversi) li copio sugli elementi esistenti
      var ea = el.querySelectorAll("*"), eb = tpl.content.querySelectorAll("*");
      for(var j = 0; j < ea.length && j < eb.length; j++) for(var q = 0; q < ATTRS.length; q++){ var v = eb[j].getAttribute(ATTRS[q]); if(v && ea[j].getAttribute(ATTRS[q]) !== v) ea[j].setAttribute(ATTRS[q], v); }
      return true;
    }
    if(el.querySelector("button,input,select,textarea,[id],[onclick]")) return false;
    el.innerHTML = H[k];
    return true;
  }
  function isMixed(el){
    var hasText = false, hasInline = false;
    for(var c = el.firstChild; c; c = c.nextSibling){
      if(c.nodeType === 3 && c.data.trim()) hasText = true;
      else if(c.nodeType === 1){ if(!INLINE[c.nodeName]) return false; hasInline = true; }
    }
    return hasText && hasInline;
  }
  function walk(node){
    if(node.nodeType === 3){ if(node.parentNode && !SKIP[node.parentNode.nodeName] && !(node.parentNode.closest && node.parentNode.closest("[translate=no]"))) text(node); return; }
    if(node.nodeType !== 1 || SKIP[node.nodeName] || node.getAttribute("translate") === "no") return;
    attrs(node);
    if(isMixed(node) && mixed(node)) return;
    for(var c = node.firstChild; c; c = c.nextSibling) walk(c);
  }
  // una frase con tag cambiata in un pezzo solo: rivedo il genitore intero
  function visit(n){
    var p = n.parentNode;
    if(p && p.nodeType === 1 && isMixed(p) && mixed(p)) return;
    walk(n);
  }
  new MutationObserver(function(list){
    for(var i = 0; i < list.length; i++){
      var r = list[i];
      if(r.type === "attributes"){ if(ATTRS.indexOf(r.attributeName) >= 0) attrs(r.target); continue; }
      // testo cambiato dentro un nodo che c'era già (es. el.firstChild.textContent = "...")
      if(r.type === "characterData"){ var pn = r.target.parentNode; if(pn && !SKIP[pn.nodeName]) visit(r.target); continue; }
      for(var j = 0; j < r.addedNodes.length; j++) visit(r.addedNodes[j]);
    }
  }).observe(document.documentElement, {childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS});
  document.addEventListener("DOMContentLoaded", function(){ walk(document.head); walk(document.body); });
})();

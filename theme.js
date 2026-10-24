/* tema: automatico (segue il dispositivo), giorno o notte */
(function(){
  const seg = document.getElementById("themeSeg"); if(!seg) return;
  let t = "auto";
  try{ t = localStorage.getItem("dojo-theme") || "auto"; }catch(e){}
  function apply(v, save){
    t = v;
    if(v === "light" || v === "dark") document.documentElement.dataset.theme = v; else delete document.documentElement.dataset.theme;
    if(save) try{ v === "auto" ? localStorage.removeItem("dojo-theme") : localStorage.setItem("dojo-theme", v); }catch(e){}
    seg.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.t === v));
    window.dispatchEvent(new Event("dojo-theme"));
  }
  seg.querySelectorAll("button").forEach(b => b.onclick = () => apply(b.dataset.t, true));
  apply(t, false);
})();

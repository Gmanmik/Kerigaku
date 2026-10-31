/* Dojo delle candele · La Prova del Dojo: 5 grafici simulati, l'utente traccia il livello che la formazione difende
   (rialzista = minimo, supporto; ribassista = massimo, resistenza) e poi dice se è supporto o resistenza.
   50 punti alla linea (pieni entro ±2,5% del range, poi a scalare) e 50 alla risposta. 1 volta su 5 la formazione fallisce.
   Gratis dal livello 2. Usa i dati e le funzioni di app.js (openP, provaOpen, LEVELS, PROVA_LEVEL, goHome) ed espone window.Prova. */
(function(){
"use strict";
var W=600,H=330,X0=10,PW=532,TOP=14,BOT=316,TOL=0.025,ZERO=0.10,F=6,TOT=32,PART=5;
// sul telefono il grafico è più alto, così candele e prezzi restano leggibili
function sizeFor(narrow){H=narrow?520:330;BOT=H-14;TOP=narrow?18:14}
var NS="http://www.w3.org/2000/svg";
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var root,svg,pann,game,r,timer;

function rnd(a,b){return a+Math.random()*(b-a)}
function mix(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function fmt(u){return (80+u*0.3).toFixed(2).replace(".",",")}
function html(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function $$(id){return root.querySelector("[data-pd='"+id+"']")}
// formazioni con un trend (Kicking esclusa), solo tra quelle aperte
function pool(){return openP().filter(function(p){return p.trend})}
function unlocked(){return provaOpen()}

function patCandles(p){return p.c.map(function(k){
  var t=k[0],o=t==="w"?k[2]:k[3],c=t==="w"?k[3]:k[2];
  return {o:o,c:c,l:k[1],h:k[4],k:t};
})}
function mk(o,c,h,l){return {o:o,c:c,h:Math.max(h,o,c),l:Math.min(l,o,c),k:Math.abs(c-o)<0.6?"d":(c>o?"w":"b")}}

function genPrior(p,pc,N,L,Hh){
  var dir=p.trend==="d"?-1:1,target=pc[0].o,span=Math.max.apply(null,pc.map(function(x){return x.h}))-Math.min.apply(null,pc.map(function(x){return x.l}));
  var step=Math.max(1.8,span/4.5),out;
  for(var tries=0;tries<60;tries++){
    var q=0;out=[];
    for(var i=0;i<N;i++){
      var o=q+rnd(-.6,.6),c=o+dir*step*rnd(-.5,1.5)+rnd(-1,1)*step*.6;
      out.push(mk(o,c,Math.max(o,c)+rnd(0,step*.7),Math.min(o,c)-rnd(0,step*.7)));q=c;
    }
    var off=target-q;
    out.forEach(function(x){x.o+=off;x.c+=off;x.h+=off;x.l+=off});
    // filtro anti-ambiguità: nelle inversioni nessuna candela precedente supera il livello della formazione
    if(p.fam!=="inv") return out;
    var ok=p.bull?out.every(function(x){return x.l>L+span*.06}):out.every(function(x){return x.h<Hh-span*.06});
    if(ok) return out;
  }
  return out;
}
function genFuture(p,pc,lvl,span,fail){
  // successo: il livello tiene. Fallimento: prima rimbalza come da manuale, poi dalla 3a candela rompe il livello
  var exp=p.bull?1:-1,q=pc[pc.length-1].c,out=[],base=Math.max(1.6,span/7);
  for(var i=0;i<F;i++){
    var breaking=fail&&i>=2,dir=breaking?-exp:exp;
    var step=breaking?(Math.abs(q-lvl)+span*.35)/(F-i)*rnd(.9,1.3):base;
    var o=q+rnd(-.4,.4),c=o+dir*step*rnd(.6,1.3)+rnd(-.3,.3)*step;
    var h=Math.max(o,c)+rnd(0,base*.5),l=Math.min(o,c)-rnd(0,base*.5);
    if(!breaking){ if(p.bull){l=Math.max(l,lvl+span*.04);o=Math.max(o,l);c=Math.max(c,l)} else {h=Math.min(h,lvl-span*.04);o=Math.min(o,h);c=Math.min(c,h)} }
    var x=mk(o,c,h,l);out.push(x);q=x.c;
  }
  return out;
}

function newRound(p){
  var pc=patCandles(p),n=pc.length,N=TOT-F-n;
  var L=Math.min.apply(null,pc.map(function(x){return x.l})),Hh=Math.max.apply(null,pc.map(function(x){return x.h}));
  var lvl=p.bull?L:Hh,span=Hh-L;
  var prior=genPrior(p,pc,N,L,Hh),fail=Math.random()<.2,fut=genFuture(p,pc,lvl,span,fail);
  var all=prior.concat(pc,fut),lo=Infinity,hi=-Infinity;
  all.forEach(function(x){lo=Math.min(lo,x.l);hi=Math.max(hi,x.h)});
  var rg=hi-lo;lo-=rg*rnd(.06,.2);hi+=rg*rnd(.06,.2);
  return {p:p,prior:prior,pc:pc,fut:fut,N:N,n:n,lvl:lvl,lo:lo,hi:hi,fail:fail,
    user:(lo+hi)/2,moved:false,step:"line",sr:null,shown:0,pts:null};
}

function y(u){return TOP+(r.hi-u)/(r.hi-r.lo)*(BOT-TOP)}
function u(yy){return r.hi-(yy-TOP)/(BOT-TOP)*(r.hi-r.lo)}
function el(n,a){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);svg.appendChild(e);return e}

function draw(){
  while(svg.firstChild) svg.removeChild(svg.firstChild);
  var sw=PW/TOT;
  for(var i=1;i<4;i++){var gu=r.lo+(r.hi-r.lo)*i/4,gy=y(gu);
    el("line",{x1:X0,x2:X0+PW,y1:gy,y2:gy,"class":"pd-gl"});
    el("text",{x:X0+2,y:gy-4,"class":"pd-glt"}).textContent=fmt(gu);}
  // formazione evidenziata
  var px=X0+r.N*sw;
  el("rect",{x:px+1,y:TOP-6,width:r.n*sw-2,height:BOT-TOP+12,rx:3,"class":"hl"});
  // futuro nascosto
  var fx=X0+(r.N+r.n)*sw;
  if(r.shown<F){
    var hx=fx+r.shown*sw;
    el("rect",{x:hx+2,y:TOP-6,width:X0+PW-hx-2,height:BOT-TOP+12,rx:3,"class":"fut"});
    if(r.shown===0) el("text",{x:hx+(X0+PW-hx)/2,y:TOP+16,"text-anchor":"middle","class":"futt"}).textContent="il futuro";
  }
  // banda corretta
  if(r.step==="reveal"||r.step==="done"){
    var span=r.hi-r.lo,b1=y(r.lvl+span*TOL),b2=y(r.lvl-span*TOL),res=!r.p.bull?" res":"";
    el("rect",{x:X0,y:b1,width:PW,height:b2-b1,"class":"band"+res});
    el("line",{x1:X0,x2:X0+PW,y1:y(r.lvl),y2:y(r.lvl),"class":"bandl"+res});
  }
  // candele
  r.prior.concat(r.pc,r.fut.slice(0,r.shown)).forEach(function(x,i){
    var cx=X0+i*sw+sw/2,cl=x.k==="w"?"c-bull":x.k==="b"?"c-bear":"c-doji";
    el("line",{x1:cx,x2:cx,y1:y(x.h),y2:y(x.l),"class":cl,"stroke-width":1.4});
    var a=y(Math.max(x.o,x.c)),b=y(Math.min(x.o,x.c));
    el("rect",{x:cx-sw*.3,y:a,width:sw*.6,height:Math.max(b-a,1.6),"class":cl,"stroke-width":0});
  });
  // linea dell'utente
  var ly=y(r.user);
  el("line",{x1:X0,x2:W-30,y1:ly,y2:ly,"class":"uline"});
  el("text",{x:W-46,y:ly-12,"text-anchor":"end","class":"utag"}).textContent=r.moved||r.step!=="line"?fmt(r.user):"trascinami";
  if(r.step==="line") el("circle",{cx:W-24,cy:ly,r:6,"class":"handle"});
  svg.classList.toggle("locked",r.step!=="line");
}

// trascinamento: un tocco ovunque sul grafico porta lì la linea, poi si trascina
var dragging=false;
function toU(ev){var pt=svg.createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;var m=svg.getScreenCTM();if(!m)return r.user;return u(pt.matrixTransform(m.inverse()).y)}
function setUser(v){r.user=Math.min(r.hi,Math.max(r.lo,v));r.moved=true;draw()}
function bindDrag(){
  svg.addEventListener("pointerdown",function(ev){if(!r||r.step!=="line")return;dragging=true;try{svg.setPointerCapture(ev.pointerId)}catch(e){}setUser(toU(ev));ev.preventDefault()});
  svg.addEventListener("pointermove",function(ev){if(dragging)setUser(toU(ev))});
  ["pointerup","pointercancel"].forEach(function(t){svg.addEventListener(t,function(){dragging=false})});
}

function btn(label,cls,fn){var b=document.createElement("button");b.type="button";b.textContent=label;if(cls)b.className=cls;b.addEventListener("click",fn);return b}
function head(passo,dom,aiuto){
  pann.innerHTML="";
  var a=document.createElement("div");a.className="passo";a.textContent=passo;pann.appendChild(a);
  var d=document.createElement("p");d.className="dom";d.textContent=dom;pann.appendChild(d);
  if(aiuto){var h=document.createElement("p");h.className="aiuto";h.textContent=aiuto;pann.appendChild(h)}
}
function row(list,box){var d=document.createElement("div");d.className="btns";list.forEach(function(b){d.appendChild(b)});(box||pann).appendChild(d);return d}

function panel(){
  if(r.step==="line"){
    head("Passo 1 di 2","Traccia il livello che la formazione evidenziata difende.","Trascina la linea con il dito o tocca il grafico. Con − e + la sposti di poco.");
    var lg=document.createElement("div");lg.className="legenda";
    lg.innerHTML="<b>Legenda</b><span>Inversione o continuazione non cambia nulla. Chiediti solo: dopo questa formazione il prezzo dovrebbe <em>salire</em> o <em>scendere</em>?</span><span>Sale, quindi formazione <em>rialzista</em>: la linea va sul <em>minimo</em> della formazione. È il prezzo che i compratori hanno difeso.</span><span>Scende, quindi formazione <em>ribassista</em>: la linea va sul <em>massimo</em> della formazione. È il prezzo che i venditori hanno difeso.</span>";
    pann.appendChild(lg);
    if(r.help){var hp=document.createElement("p");hp.className="aiuto";hp.innerHTML="La formazione è <b>"+html(r.p.name)+"</b>, <span>"+(r.p.fam==="inv"?"inversione":"continuazione")+" <b>"+(r.p.bull?"rialzista":"ribassista")+"</b></span>.";pann.appendChild(hp)}
    else row([btn("Aiuto: dimmi che formazione è","indietro",function(){r.help=true;panel()})]);
    var stepU=(r.hi-r.lo)*0.005;
    row([btn("−","mini",function(){setUser(r.user-stepU)}),btn("+","mini",function(){setUser(r.user+stepU)}),
      btn("Conferma la linea","pri",function(){r.step="sr";draw();panel()})]);
  } else if(r.step==="sr"){
    head("Passo 2 di 2","Questa linea è…","Pensa a cosa fa il prezzo quando torna su quel livello.");
    var lg2=document.createElement("div");lg2.className="legenda";
    lg2.innerHTML="<b>Cosa vuol dire</b><span><em>Supporto</em>: un pavimento sotto il prezzo. Quando il prezzo scende fin lì, i compratori lo fermano e tende a risalire.</span><span><em>Resistenza</em>: un soffitto sopra il prezzo. Quando il prezzo sale fin lì, i venditori lo fermano e tende a riscendere.</span>";
    pann.appendChild(lg2);
    row([btn("Supporto","",function(){r.sr="s";reveal()}),btn("Resistenza","",function(){r.sr="r";reveal()})]);
    row([btn("← Torna a spostare la linea","indietro",function(){r.step="line";draw();panel()})]);
  } else if(r.step==="reveal"){
    head("Il futuro","Vediamo cosa è successo…");
  } else esito();
}

function score(){
  var span=r.hi-r.lo,dist=Math.abs(r.user-r.lvl)/span,prec=Math.max(0,1-Math.max(0,dist-TOL)/ZERO);
  var srOk=(r.sr==="s")===r.p.bull,pl=Math.round(50*prec);
  return {prec:Math.round(prec*100),pl:pl,srOk:srOk,ps:srOk?50:0,tot:pl+(srOk?50:0)};
}

function reveal(){
  r.step="reveal";r.pts=score();panel();draw();
  var cur=r;
  function next(){if(r!==cur||!root.isConnected)return;r.shown++;draw();if(r.shown<F)timer=setTimeout(next,170);else{r.step="done";draw();
    game.res.push({p:r.p,pts:r.pts});game.tot+=r.pts.tot;upd();panel();if(r.pts.tot>=80&&typeof memePop==="function")memePop()}}
  if(reduce){r.shown=F-1;next()}else timer=setTimeout(next,250);
}

function spiegazione(){
  var p=r.p,s;
  if(p.fam==="inv") s=p.bull?"Dopo il ribasso i compratori hanno fermato il prezzo sul minimo della formazione: quel livello diventa supporto."
                            :"Dopo il rialzo i venditori hanno respinto il prezzo sul massimo della formazione: quel livello diventa resistenza.";
  else s=p.bull?"È una pausa dentro il rialzo: il minimo della formazione è il punto che il trend non deve perdere, quindi fa da supporto."
               :"È una pausa dentro il ribasso: il massimo della formazione è il punto che il trend non deve superare, quindi fa da resistenza.";
  if(r.fail) return "Questa volta la formazione ha fallito. "+s+" Il prezzo all'inizio lo ha rispettato, poi lo ha rotto ed è andato "+(p.bull?"giù":"su")+". Succede: una formazione è una probabilità, non una certezza. La linea serve proprio a capire quando la formazione è smentita.";
  return s+" Il prezzo lo ha rispettato e ha proseguito "+(p.bull?"al rialzo":"al ribasso")+".";
}

function esito(){
  var t=r.pts;pann.innerHTML="";
  var box=document.createElement("div");box.className="esito";
  if(window.DojoSuoni)DojoSuoni.play(t.tot>=50?"giusto":"sbagliato");
  var st=t.tot>=80?["Giusto","timbro ok"]:t.tot>=50?["Quasi","timbro"]:["Da rivedere","timbro"];
  box.innerHTML="<span class=\""+st[1]+"\">"+st[0]+"</span>"+
    "<p class=\"nome\">"+html(r.p.name)+"<span>"+(r.p.fam==="inv"?"inversione":"continuazione")+" "+(r.p.bull?"rialzista":"ribassista")+"</span></p>"+
    "<p>"+html(spiegazione())+"</p>"+
    "<p class=\"aiuto\">"+html(r.p.d)+"</p>"+
    "<div class=\"punti\"><span>Linea (precisione "+t.prec+"%)</span><b>"+t.pl+" / 50</b>"+
    "<span>"+(t.srOk?"Supporto/resistenza giusto":"Era "+(r.p.bull?"supporto":"resistenza"))+"</span><b>"+t.ps+" / 50</b>"+
    "<span class=\"tot\">Totale</span><b class=\"tot\">"+t.tot+" / 100</b></div>";
  pann.appendChild(box);
  var last=game.i===PART-1;
  var b=btn(last?"Vedi il risultato":"Grafico successivo","pri",function(){last?fine():startRound(game.i+1)});
  row([b]);b.focus({preventScroll:true});
}

function upd(){
  $$("nGraf").textContent=Math.min(game.i+1,PART);
  $$("punti").textContent=game.tot;
  var d=$$("dots");d.innerHTML="";
  for(var i=0;i<PART;i++){var e=document.createElement("i");var rs=game.res[i];
    if(rs)e.className=rs.pts.tot>=80?"ok":rs.pts.tot>=50?"mid":"ko";else if(i===game.i)e.className="now";d.appendChild(e)}
}

function startRound(i){game.i=i;r=newRound(game.pats[i]);upd();draw();panel()}

function fine(){
  $$("gioco").hidden=true;
  var R=$$("riass");R.hidden=false;
  var srOk=game.res.filter(function(x){return x.pts.srOk}).length;
  var prec=Math.round(game.res.reduce(function(a,x){return a+x.pts.prec},0)/PART);
  var giud=game.tot>=400?"Occhio da Figlio di Buffett.":game.tot>=280?"Buona mano: la linea va dove deve.":"Il Dojo ti aspetta per un altro giro.";
  var rows=game.res.map(function(x){return "<tr><td>"+html(x.p.name)+"</td><td>"+(x.p.bull?"supporto":"resistenza")+"</td><td class=\"num\">"+x.pts.prec+"%</td><td class=\"num\">"+x.pts.tot+"</td></tr>"}).join("");
  R.innerHTML="<h2>Partita finita</h2><div class=\"grande\">"+game.tot+" <small>/ 500 punti</small></div>"+
    "<p>"+giud+" Precisione media della linea "+prec+"%, supporto o resistenza indovinato "+srOk+" volte su 5.</p>"+
    "<div class=\"tab\"><table><thead><tr><th>Formazione</th><th>Livello</th><th class=\"num\">Precisione</th><th class=\"num\">Punti</th></tr></thead><tbody>"+rows+"</tbody></table></div>";
  var b=btn("Gioca ancora","pri",nuova);
  row([b,btn("Torna al menu","",goHome)],R);
  if(game.tot>(+prefs.provaBest||0)){prefs.provaBest=game.tot;savePrefs()}
  b.focus({preventScroll:true});
}

function nuova(){
  clearTimeout(timer);
  var P2=pool(),bulls=mix(P2.filter(function(p){return p.bull})),bears=mix(P2.filter(function(p){return !p.bull}));
  var nb=Math.random()<.5?2:3;
  game={pats:mix(bulls.slice(0,nb).concat(bears.slice(0,PART-nb))),i:0,res:[],tot:0};
  $$("gioco").hidden=false;$$("riass").hidden=true;
  startRound(0);
}

function start(){
  var box=document.getElementById("quiz");
  clearTimeout(timer);
  if(!unlocked()){
    box.innerHTML="<div class=\"panel pd-locked\"><h2>La Prova del Dojo si apre al livello "+(PROVA_LEVEL+1)+": "+html(LEVELS[PROVA_LEVEL].n)+"</h2>"+
      "<p>È il gioco in cui tracci tu il supporto o la resistenza che una formazione difende, e poi scopri il futuro candela per candela. È gratis: basta salire di livello rispondendo giusto in Studia e ripassa.</p>"+
      "<div class=\"actions\"><button class=\"btn\" data-pd=\"go\">Vai a Studia e ripassa</button><button class=\"btn ghost\" data-pd=\"home\">Torna al menu</button></div></div>";
    box.querySelector("[data-pd='go']").onclick=function(){setTab("srs")};
    box.querySelector("[data-pd='home']").onclick=goHome;
    return;
  }
  var narrow=window.innerWidth<600;sizeFor(narrow);
  box.innerHTML="<div class=\"pd"+(narrow?" narrow":"")+"\">"+
    "<div class=\"pd-head\"><div class=\"stato\"><span>Grafico <b data-pd=\"nGraf\">1</b> di 5</span><span>Punti <b data-pd=\"punti\">0</b></span><span class=\"pd-dots\" data-pd=\"dots\"></span></div></div>"+
    "<div class=\"gioco\" data-pd=\"gioco\"><div class=\"carta grafico\"><svg class=\"pd-chart\" viewBox=\"0 0 600 "+H+"\" role=\"img\" aria-label=\"Grafico a candele con la formazione evidenziata e la linea da posizionare\"></svg></div><div class=\"carta pann\"></div></div>"+
    "<div class=\"carta riass\" data-pd=\"riass\" hidden></div>"+
    "<p class=\"nota\">Grafici simulati, generati a caso: non sono prezzi reali e non è consulenza finanziaria.</p></div>";
  root=box.querySelector(".pd");svg=root.querySelector("svg");pann=root.querySelector(".pann");
  bindDrag();nuova();
}
function hint(){
  if(!unlocked()) return "Si apre al livello "+(PROVA_LEVEL+1)+": "+LEVELS[PROVA_LEVEL].n+". Rispondi giusto in Studia e ripassa per salire.";
  var best=+prefs.provaBest||0;
  return "5 grafici: traccia il supporto o la resistenza che la formazione difende."+(best?" Il tuo record è "+best+" punti su 500.":"");
}
function ill(){
  var box=document.getElementById("ill-prova");if(!box)return;
  var c=[[60,44,50,30],[52,38,44,26],[44,30,36,20],[38,26,30,18],[30,24,27,20],[34,28,40,26],[42,36,48,34],[50,44,56,42]];
  var g="<line x1=\"8\" x2=\"252\" y1=\"84\" y2=\"84\" stroke=\"var(--ink)\" stroke-width=\"2.5\" stroke-linecap=\"round\"/><circle cx=\"240\" cy=\"84\" r=\"5\" fill=\"var(--card)\" stroke=\"var(--ink)\" stroke-width=\"2\"/>";
  c.forEach(function(k,i){var x=22+i*26,up=i>=5,col=up?"var(--bull)":"var(--bear)",hi=104-k[0],lo=104-k[3],bt=104-Math.max(k[1],k[2]),bb=104-Math.min(k[1],k[2]);
    g+="<line x1=\""+x+"\" x2=\""+x+"\" y1=\""+hi+"\" y2=\""+lo+"\" stroke=\""+col+"\" stroke-width=\"1.6\"/><rect x=\""+(x-6)+"\" y=\""+bt+"\" width=\"12\" height=\""+Math.max(2,bb-bt)+"\" rx=\"1.5\" fill=\""+col+"\"/>"});
  box.innerHTML="<svg viewBox=\"0 0 260 104\" aria-hidden=\"true\">"+g+"</svg>";
}
ill();
// tablet ruotato a metà partita: cambia formato senza ricominciare
window.addEventListener("resize",function(){
  if(!root||!root.isConnected||!r)return;
  var narrow=window.innerWidth<600;if(narrow===root.classList.contains("narrow"))return;
  sizeFor(narrow);root.classList.toggle("narrow",narrow);svg.setAttribute("viewBox","0 0 600 "+H);draw();
});
window.Prova={start:start,hint:hint,unlocked:unlocked};
// app.js disegna il menu prima che questo file sia caricato: aggiorna il riquadro della prova
if(typeof view!=="undefined"&&view==="home"){
  var pl=document.getElementById("provaLock");if(pl)pl.hidden=unlocked();
  if(prefs.mode==="prova")selectMode("prova",true);
}
})();

/* Pagina d'ingresso: le candele casuali sotto il titolo. I due grafici delle formazioni li disegna app.js. */
(function(){
function rnd(seed){var s=seed||Math.floor(Math.random()*1e9);return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function candele(svg,n,seed,w,h){var r=rnd(seed),p=h*.5,out='',sx=w/n;
for(var i=0;i<n;i++){var o=p,c=p+(r()-.5)*h*.55;c=Math.min(h*.82,Math.max(h*.18,c));p=c+(r()-.5)*h*.06;var H=Math.min(h-2,Math.max(o,c)+r()*h*.14),L=Math.max(2,Math.min(o,c)-r()*h*.14);
var up=c<=o,col=up?'var(--bull)':'var(--bear)',x=sx*i+sx/2,top=Math.min(o,c),bh=Math.max(Math.abs(o-c),1.5),bw=Math.min(14,sx*.45);
out+='<line x1="'+x+'" x2="'+x+'" y1="'+H+'" y2="'+L+'" stroke="var(--ink)" stroke-width="1.5"/><rect x="'+(x-bw/2)+'" y="'+top+'" width="'+bw+'" height="'+bh+'" rx="1" fill="'+(up?'var(--card)':col)+'" stroke="'+col+'" stroke-width="1.6"/>';}
svg.innerHTML=out}
// disegno alla misura vera del riquadro (niente stiramento): una candela ogni ~28 px, ridisegno se cambia la misura
var rg=document.getElementById('riga'),seed=Math.floor(Math.random()*1e9),last='';
function draw(){var b=rg.getBoundingClientRect(),w=Math.round(b.width),h=Math.round(b.height);if(!w||!h||w+'x'+h===last)return;last=w+'x'+h;
rg.setAttribute('viewBox','0 0 '+w+' '+h);candele(rg,Math.max(10,Math.min(30,Math.round(w/28))),seed,w,h)}
if(rg){rg.removeAttribute('preserveAspectRatio');if(window.ResizeObserver)new ResizeObserver(draw).observe(rg);else{draw();window.addEventListener('resize',draw)}}
})();

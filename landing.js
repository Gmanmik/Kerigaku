/* Pagina d'ingresso: le candele casuali sotto il titolo. I due grafici delle formazioni li disegna app.js. */
(function(){
function rnd(seed){var s=seed||Math.floor(Math.random()*1e9);return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function candele(svg,n,seed,w,h){var r=rnd(seed),p=h*.5,out='',sx=w/n;
for(var i=0;i<n;i++){var o=p,c=p+(r()-.5)*h*.30;c=Math.min(h*.78,Math.max(h*.22,c));p=c+(r()-.5)*h*.04;var H=Math.max(o,c)+r()*h*.1,L=Math.min(o,c)-r()*h*.1;
var up=c<=o,col=up?'var(--bull)':'var(--bear)',x=sx*i+sx/2,top=Math.min(o,c),bh=Math.max(Math.abs(o-c),1.5),bw=sx*.55;
out+='<line x1="'+x+'" x2="'+x+'" y1="'+H+'" y2="'+L+'" stroke="var(--ink)" stroke-width="1.5"/><rect x="'+(x-bw/2)+'" y="'+top+'" width="'+bw+'" height="'+bh+'" rx="1" fill="'+(up?'var(--card)':col)+'" stroke="'+col+'" stroke-width="1.6"/>';}
svg.innerHTML=out}
var rg=document.getElementById('riga');if(rg)candele(rg,26,0,600,120);
})();

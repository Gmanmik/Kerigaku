/* Applica subito il tema scelto, prima che la pagina compaia, per evitare un lampo di colore sbagliato. */
try{var t=localStorage.getItem("dojo-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}
/* Chi non è entrato e non ha scelto «senza account» vede subito la copertina (landing.css), senza il lampo della schermata del Dojo.
   app.js toglie la classe appena ha controllato l'accesso. */
try{var g=localStorage.getItem("dojo-guest")==="true",s=false;for(var i=0;i<localStorage.length;i++){if(/^sb-.*-auth-token$/.test(localStorage.key(i)||"")){s=true;break}}if(!g&&!s)document.documentElement.classList.add("pre-landing")}catch(e){}

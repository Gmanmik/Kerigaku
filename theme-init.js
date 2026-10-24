/* Applica subito il tema scelto, prima che la pagina compaia, per evitare un lampo di colore sbagliato. */
try{var t=localStorage.getItem("dojo-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}

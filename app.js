const P = [{"id":"hammer_p","name":"Hammer","bull":true,"fam":"inv","trend":"d","c":[["b",24,41,52,52]],"n":1,"d":"Dopo un ribasso: corpo piccolo in alto e ombra inferiore lunga almeno il doppio del corpo. I venditori spingono giù, ma i compratori recuperano tutto.","twin":"hanging_m"},{"id":"hanging_m","name":"Hanging man","bull":false,"fam":"inv","trend":"u","c":[["b",46,64,74,74]],"n":1,"d":"Stessa forma del martello, ma arriva dopo un rialzo. Avverte che la pressione di vendita sta crescendo: aspetta la conferma il giorno dopo.","twin":"hammer_p"},{"id":"invhammer_p","name":"Inverted hammer","bull":true,"fam":"inv","trend":"d","c":[["b",18,23,50,55],["b",8,8,18,38]],"n":1,"d":"Dopo un ribasso: corpo piccolo in basso e lunga ombra superiore. È il primo tentativo dei compratori, da confermare con una seduta rialzista.","twin":"shooting_m"},{"id":"shooting_m","name":"Shooting star","bull":false,"fam":"inv","trend":"u","c":[["w",19,28,61,71],["b",64,64,74,95]],"n":1,"d":"Dopo un rialzo: apre in gap, sale molto ma ricade. Corpo piccolo in basso e lunga ombra superiore: i prezzi alti sono stati respinti.","twin":"invhammer_p"},{"id":"belthold_p","name":"Belt hold","bull":true,"fam":"inv","trend":"d","c":[["w",18,18,43,52]],"n":1,"d":"Candela verde lunga che apre esattamente sul minimo (niente ombra inferiore) e sale per tutta la seduta. Più è lunga, più conta.","twin":"belthold_m"},{"id":"belthold_m","name":"Belt hold","bull":false,"fam":"inv","trend":"u","c":[["b",49,58,84,84]],"n":1,"d":"Candela rossa lunga che apre esattamente sul massimo (niente ombra superiore) e scende per tutta la seduta.","twin":"belthold_p"},{"id":"engulf_p","name":"Engulfing","bull":true,"fam":"inv","trend":"d","c":[["b",27,34,50,54],["w",20,24,59,64]],"n":2,"d":"Il corpo verde “ingoia” completamente il corpo rosso del giorno prima. Uno dei segnali d’inversione al rialzo più affidabili.","twin":"engulf_m"},{"id":"engulf_m","name":"Engulfing","bull":false,"fam":"inv","trend":"u","c":[["w",53,58,76,80],["b",49,53,83,87]],"n":2,"d":"Il corpo rosso ingoia completamente il corpo verde del giorno prima. I venditori prendono il controllo.","twin":"engulf_p"},{"id":"harami_p","name":"Harami","bull":true,"fam":"inv","trend":"d","c":[["b",14,21,51,57],["w",22,29,44,50]],"n":2,"d":"Dopo una lunga candela rossa, un piccolo corpo verde tutto dentro il corpo precedente (harami = “incinta”). Il ribasso perde forza.","twin":"harami_m"},{"id":"harami_m","name":"Harami","bull":false,"fam":"inv","trend":"u","c":[["w",35,40,70,75],["b",43,47,66,70]],"n":2,"d":"Dopo una lunga candela verde, un piccolo corpo rosso tutto dentro il corpo precedente. Il rialzo rallenta.","twin":"harami_p"},{"id":"haramix_p","name":"Harami cross","bull":true,"fam":"inv","trend":"d","c":[["b",13,20,55,62],["d",26,37,37,47]],"n":2,"d":"Come l’harami, ma la seconda candela è un doji. L’indecisione è totale: segnale più forte dell’harami normale.","twin":"haramix_m"},{"id":"haramix_m","name":"Harami cross","bull":false,"fam":"inv","trend":"u","c":[["w",43,49,80,86],["d",52,65,65,76]],"n":2,"d":"Un doji tutto dentro il corpo di una lunga candela verde. Il rialzo si blocca nell’indecisione.","twin":"haramix_p"},{"id":"piercing_p","name":"Piercing line","bull":true,"fam":"inv","trend":"d","c":[["b",16,20,49,54],["w",3,8,37,42]],"n":2,"d":"Dopo una candela rossa, la verde apre sotto il minimo e chiude oltre la metà del corpo rosso. Più “perfora”, più è forte.","twin":"darkcloud_m"},{"id":"darkcloud_m","name":"Dark cloud cover","bull":false,"fam":"inv","trend":"u","c":[["w",40,44,73,78],["b",49,54,83,88]],"n":2,"d":"Dopo una candela verde, la rossa apre sopra il massimo e chiude sotto la metà del corpo verde. Una nuvola scura sul rialzo.","twin":"piercing_p"},{"id":"dojistar_p","name":"Doji star","bull":true,"fam":"inv","trend":"d","c":[["b",21,26,55,60],["d",3,16,16,25]],"n":2,"d":"Dopo una lunga candela rossa, un doji che apre in gap al ribasso. Il mercato esita: possibile svolta, da confermare.","twin":"dojistar_m"},{"id":"dojistar_m","name":"Doji star","bull":false,"fam":"inv","trend":"u","c":[["w",34,39,67,72],["d",67,80,80,89]],"n":2,"d":"Dopo una lunga candela verde, un doji in gap al rialzo. Il mercato esita sui massimi.","twin":"dojistar_p"},{"id":"meeting_p","name":"Meeting line","bull":true,"fam":"inv","trend":"d","c":[["b",25,30,58,63],["w",-3,1,30,34]],"n":2,"d":"Candela rossa lunga, poi una verde che apre molto più in basso ma risale fino a chiudere allo stesso prezzo del giorno prima.","twin":"meeting_m"},{"id":"meeting_m","name":"Meeting line","bull":false,"fam":"inv","trend":"u","c":[["w",26,30,59,63],["b",54,59,88,93]],"n":2,"d":"Candela verde lunga, poi una rossa che apre molto più in alto ma ricade fino a chiudere allo stesso prezzo del giorno prima.","twin":"meeting_p"},{"id":"3soldiers_p","name":"Three white soldiers","bull":true,"fam":"inv","trend":"d","c":[["w",20,24,52,57],["w",34,38,67,72],["w",49,53,82,86]],"n":3,"d":"Tre candele verdi lunghe, con chiusure sempre più alte. Ognuna apre dentro il corpo della precedente. Ripresa decisa.","twin":"3crows_m"},{"id":"3crows_m","name":"Three black crows","bull":false,"fam":"inv","trend":"u","c":[["b",48,52,83,87],["b",32,36,67,71],["b",17,21,51,55]],"n":3,"d":"Tre candele rosse lunghe, con chiusure sempre più basse. Ognuna apre dentro il corpo della precedente.","twin":"3soldiers_p"},{"id":"mstar_p","name":"Morning star","bull":true,"fam":"inv","trend":"d","c":[["b",23,28,56,60],["w",4,9,18,23],["w",17,22,43,47]],"n":3,"d":"Candela rossa lunga, poi un piccolo corpo in gap al ribasso (la “stella”), poi una verde che chiude ben dentro il primo corpo.","twin":"estar_m"},{"id":"estar_m","name":"Evening star","bull":false,"fam":"inv","trend":"u","c":[["w",36,40,68,73],["b",71,75,85,90],["b",45,49,70,75]],"n":3,"d":"Candela verde lunga, poi un piccolo corpo in gap al rialzo, poi una rossa che chiude ben dentro il primo corpo.","twin":"mstar_p"},{"id":"mdoji_p","name":"Morning doji star","bull":true,"fam":"inv","trend":"d","c":[["b",20,24,52,57],["d",7,14,14,22],["w",14,18,40,44]],"n":3,"d":"Come la morning star, ma la stella centrale è un doji. Segnale ancora più forte.","twin":"edoji_m"},{"id":"edoji_m","name":"Evening doji star","bull":false,"fam":"inv","trend":"u","c":[["w",37,41,68,73],["d",74,80,80,87],["b",45,49,73,78]],"n":3,"d":"Come la evening star, ma la stella centrale è un doji. Segnale ancora più forte.","twin":"mdoji_p"},{"id":"abandoned_p","name":"Abandoned baby","bull":true,"fam":"inv","trend":"d","c":[["b",20,24,52,57],["d",7,14,14,21],["w",13,17,39,43]],"n":3,"d":"Il doji centrale è isolato da due gap: le sue ombre non toccano quelle delle candele vicine. Raro ma molto potente.","twin":"abandoned_m"},{"id":"abandoned_m","name":"Abandoned baby","bull":false,"fam":"inv","trend":"u","c":[["w",36,40,67,72],["d",81,86,86,92],["b",46,50,73,77]],"n":3,"d":"Doji isolato in alto da due gap, tra una candela verde e una rossa. Raro ma molto potente.","twin":"abandoned_p"},{"id":"tristar_p","name":"Tri-star","bull":true,"fam":"inv","trend":"d","c":[["d",37,43,43,50],["d",26,32,32,39],["d",33,39,39,46]],"n":3,"d":"Tre doji di fila, con quello centrale più in basso degli altri due. Rarissimo: indecisione estrema dopo il ribasso.","twin":"tristar_m"},{"id":"tristar_m","name":"Tri-star","bull":false,"fam":"inv","trend":"u","c":[["d",50,57,57,63],["d",61,68,68,74],["d",56,62,62,69]],"n":3,"d":"Tre doji di fila, con quello centrale più in alto degli altri due, dopo un rialzo.","twin":"tristar_p"},{"id":"breakaway_p","name":"Breakaway","bull":true,"fam":"inv","trend":"d","c":[["b",38,42,63,67],["b",20,23,33,36],["b",14,18,30,33],["b",11,15,24,28],["w",17,20,41,45]],"n":5,"d":"Rossa lunga, gap al ribasso, tre candele che scendono sempre più piano. La quinta, verde, risale e chiude dentro il gap.","twin":"breakaway_m"},{"id":"breakaway_m","name":"Breakaway","bull":false,"fam":"inv","trend":"u","c":[["w",36,39,60,65],["w",70,72,83,86],["b",71,74,85,89],["w",75,77,87,90],["b",57,61,82,84]],"n":5,"d":"Verde lunga, gap al rialzo, tre candele che salgono sempre più piano. La quinta, rossa, ricade e chiude dentro il gap.","twin":"breakaway_p"},{"id":"3inside_p","name":"Three inside up","bull":true,"fam":"inv","trend":"d","c":[["b",12,17,43,48],["w",19,23,36,40],["w",26,30,50,55]],"n":3,"d":"Un harami rialzista seguito da una terza candela verde che chiude sopra la prima. È l’harami confermato.","twin":"3inside_m"},{"id":"3inside_m","name":"Three inside down","bull":false,"fam":"inv","trend":"u","c":[["w",44,49,76,81],["b",51,56,69,73],["b",36,40,62,66]],"n":3,"d":"Un harami ribassista seguito da una terza candela rossa che chiude sotto la prima. È l’harami confermato.","twin":"3inside_p"},{"id":"3outside_p","name":"Three outside up","bull":true,"fam":"inv","trend":"d","c":[["b",13,18,33,37],["w",7,11,40,45],["w",21,26,51,55]],"n":3,"d":"Un engulfing rialzista seguito da una terza candela verde con chiusura più alta. È l’engulfing confermato.","twin":"3outside_m"},{"id":"3outside_m","name":"Three outside down","bull":false,"fam":"inv","trend":"u","c":[["w",46,50,64,69],["b",35,40,69,74],["b",27,32,57,61]],"n":3,"d":"Un engulfing ribassista seguito da una terza candela rossa con chiusura più bassa. È l’engulfing confermato.","twin":"3outside_p"},{"id":"kicking_p","name":"Kicking","bull":true,"fam":"inv","trend":null,"c":[["b",2,2,37,37],["w",48,48,86,86]],"n":2,"d":"Marubozu rosso (senza ombre) e poi marubozu verde in gap al rialzo. Cambio d’umore netto, conta poco il trend precedente.","twin":"kicking_m"},{"id":"kicking_m","name":"Kicking","bull":false,"fam":"inv","trend":null,"c":[["w",47,47,85,85],["b",1,1,36,36]],"n":2,"d":"Marubozu verde (senza ombre) e poi marubozu rosso in gap al ribasso. Cambio d’umore netto.","twin":"kicking_p"},{"id":"matchlow_p","name":"Matching low","bull":true,"fam":"inv","trend":"d","c":[["b",15,15,47,52],["b",14,14,35,43]],"n":2,"d":"Due candele rosse che chiudono esattamente allo stesso prezzo. Quel livello fa da supporto: il prezzo non scende oltre.","twin":"matchhigh_m"},{"id":"matchhigh_m","name":"Matching high","bull":false,"fam":"inv","trend":"u","c":[["w",41,48,80,80],["w",51,60,80,80]],"n":2,"d":"Due candele verdi che chiudono esattamente allo stesso prezzo. Quel livello fa da resistenza.","twin":"matchlow_p"},{"id":"ladderbot_p","name":"Ladder bottom","bull":true,"fam":"inv","trend":"d","c":[["b",43,43,67,67],["b",32,32,57,57],["b",22,22,47,47],["b",13,13,26,43],["w",28,28,62,62]],"n":5,"d":"Tre rosse in discesa, una quarta rossa con ombra superiore lunga, poi una verde che apre in gap al rialzo.","twin":"laddertop_m"},{"id":"laddertop_m","name":"Ladder top","bull":false,"fam":"inv","trend":"u","c":[["w",39,39,64,64],["w",50,50,75,75],["w",60,60,86,86],["w",64,80,92,92],["b",42,42,75,75]],"n":5,"d":"Tre verdi in salita, una quarta verde con ombra inferiore lunga, poi una rossa che apre in gap al ribasso.","twin":"ladderbot_p"},{"id":"u3river_p","name":"Unique three river bottom","bull":true,"fam":"inv","trend":"d","c":[["b",25,30,56,60],["b",13,44,52,53],["w",26,26,37,46]],"n":3,"d":"Rossa lunga, poi una rossa piccola con lunga ombra inferiore (nuovo minimo, subito respinto), infine una verde piccola.","twin":null},{"id":"upgap2crows_m","name":"Upside gap two crows","bull":false,"fam":"inv","trend":"u","c":[["w",29,33,63,67],["b",70,73,82,85],["b",64,68,84,88]],"n":3,"d":"Verde lunga, una rossa piccola in gap al rialzo, poi una rossa più grande che la avvolge ma resta sopra la verde.","twin":null},{"id":"3stars_p","name":"Three stars in the south","bull":true,"fam":"inv","trend":"d","c":[["b",8,36,68,68],["b",15,28,39,41],["b",22,22,30,30]],"n":3,"d":"Tre candele rosse sempre più piccole, con minimi sempre più alti. L’ultima è un piccolo marubozu: il ribasso si esaurisce.","twin":null},{"id":"ident3crows_m","name":"Identical three crows","bull":false,"fam":"inv","trend":"u","c":[["b",62,64,89,93],["b",37,40,64,68],["b",12,15,39,43]],"n":3,"d":"Tre rosse in discesa in cui ognuna apre proprio alla chiusura della precedente. Variante più dura dei three black crows.","twin":null},{"id":"swallow_p","name":"Concealing baby swallow","bull":true,"fam":"inv","trend":"d","c":[["b",42,42,67,67],["b",21,21,45,45],["b",4,4,14,25],["b",2,2,27,27]],"n":4,"d":"Due marubozu rossi, una rossa in gap con lunga ombra superiore, poi una rossa che la avvolge. I venditori si arrendono.","twin":null},{"id":"deliberation_m","name":"Deliberation","bull":false,"fam":"inv","trend":"u","c":[["w",24,28,54,58],["w",46,50,77,81],["w",77,80,89,93]],"n":3,"d":"Due verdi lunghe e poi una verde piccola, spesso in gap. Il rialzo “ci pensa su” e perde slancio.","twin":null},{"id":"sandwich_p","name":"Stick sandwich","bull":true,"fam":"inv","trend":"d","c":[["b",12,12,45,52],["w",26,26,59,59],["b",11,11,66,70]],"n":3,"d":"Due candele rosse con la stessa chiusura e in mezzo una verde. La chiusura uguale segna un supporto.","twin":null},{"id":"advblock_m","name":"Advance block","bull":false,"fam":"inv","trend":"u","c":[["w",26,30,63,67],["w",55,59,71,84],["w",63,67,75,86]],"n":3,"d":"Tre verdi in salita, ma con corpi sempre più piccoli e ombre superiori sempre più lunghe. I compratori si stancano.","twin":null},{"id":"homing_p","name":"Homing pigeon","bull":true,"fam":"inv","trend":"d","c":[["b",24,29,54,60],["b",34,37,50,53]],"n":2,"d":"Come l’harami, ma sono rosse entrambe: un piccolo corpo rosso dentro un corpo rosso lungo. Il ribasso rallenta.","twin":null},{"id":"2crows_m","name":"Two crows","bull":false,"fam":"inv","trend":"u","c":[["w",28,33,64,68],["b",73,77,88,91],["b",45,50,82,85]],"n":3,"d":"Verde lunga, una rossa piccola in gap al rialzo, poi una rossa che chiude dentro il corpo della verde.","twin":null},{"id":"seplines_p","name":"Separating lines","bull":true,"fam":"cont","trend":"u","c":[["b",21,25,57,62],["w",52,57,89,93]],"n":2,"d":"In un rialzo: una rossa e poi una verde che apre allo stesso prezzo d’apertura della rossa. Il rialzo riparte.","twin":"seplines_m"},{"id":"seplines_m","name":"Separating lines","bull":false,"fam":"cont","trend":"d","c":[["w",32,36,67,72],["b",0,4,36,40]],"n":2,"d":"In un ribasso: una verde e poi una rossa che apre allo stesso prezzo d’apertura della verde. Il ribasso riparte.","twin":"seplines_p"},{"id":"rising3_p","name":"Rising three methods","bull":true,"fam":"cont","trend":"u","c":[["w",37,41,70,74],["b",60,64,72,76],["b",50,52,64,67],["b",42,44,55,58],["w",40,44,82,86]],"n":5,"d":"Verde lunga, tre piccole candele in calo che restano nel suo range, poi una verde lunga con nuovo massimo. Solo una pausa.","twin":"falling3_m"},{"id":"falling3_m","name":"Falling three methods","bull":false,"fam":"cont","trend":"d","c":[["b",18,25,52,57],["w",18,22,34,37],["b",26,30,39,43],["w",39,42,50,54],["b",14,17,47,49]],"n":5,"d":"Rossa lunga, tre piccole candele in risalita che restano nel suo range, poi una rossa lunga con nuovo minimo.","twin":"rising3_p"},{"id":"uptasuki_p","name":"Upside tasuki gap","bull":true,"fam":"cont","trend":"u","c":[["w",32,37,65,70],["w",75,79,98,103],["b",64,68,83,87]],"n":3,"d":"Due verdi separate da un gap al rialzo, poi una rossa che scende nel gap senza chiuderlo. Il rialzo continua.","twin":"dntasuki_m"},{"id":"dntasuki_m","name":"Downside tasuki gap","bull":false,"fam":"cont","trend":"d","c":[["b",36,40,67,72],["b",8,11,28,32],["w",13,17,31,35]],"n":3,"d":"Due rosse separate da un gap al ribasso, poi una verde che sale nel gap senza chiuderlo. Il ribasso continua.","twin":"uptasuki_p"},{"id":"sbswhite_p","name":"Side by side white lines","bull":true,"fam":"cont","trend":"u","c":[["w",28,31,61,67],["w",67,70,88,91],["w",67,70,88,92]],"n":3,"d":"In un rialzo, dopo un gap, due candele verdi affiancate, simili per apertura e dimensione. Il rialzo continua.","twin":"sbswhite_m"},{"id":"sbswhite_m","name":"Side by side white lines","bull":false,"fam":"cont","trend":"d","c":[["b",26,30,57,62],["w",-2,2,18,24],["w",-1,3,18,22]],"n":3,"d":"In un ribasso, dopo un gap, due candele verdi affiancate e simili: il rimbalzo è debole, il ribasso continua.","twin":"sbswhite_p"},{"id":"3strike_p","name":"Three line strike","bull":true,"fam":"cont","trend":"u","c":[["w",38,43,66,72],["w",48,54,76,82],["w",58,65,85,92],["b",26,30,88,92]],"n":4,"d":"Tre verdi in salita, poi una rossa lunga che cancella tutto e chiude sotto la prima. Prese di profitto, poi si riparte.","twin":"3strike_m"},{"id":"3strike_m","name":"Three line strike","bull":false,"fam":"cont","trend":"d","c":[["b",31,37,57,63],["b",21,27,47,53],["b",12,17,36,42],["w",9,13,64,67]],"n":4,"d":"Tre rosse in discesa, poi una verde lunga che apre sotto e chiude sopra la prima. Ricoperture, poi si riscende.","twin":"3strike_p"},{"id":"upgap3m_p","name":"Upside gap three methods","bull":true,"fam":"cont","trend":"u","c":[["w",27,32,54,60],["w",63,67,90,94],["b",41,46,74,78]],"n":3,"d":"Due verdi separate da un gap al rialzo, poi una rossa che chiude il gap. Il gap è riempito, il rialzo riprende.","twin":"dngap3m_m"},{"id":"dngap3m_m","name":"Downside gap three methods","bull":false,"fam":"cont","trend":"d","c":[["b",33,37,58,62],["b",1,5,25,29],["w",14,18,46,50]],"n":3,"d":"Due rosse separate da un gap al ribasso, poi una verde che chiude il gap. Il ribasso riprende.","twin":"upgap3m_p"},{"id":"onneck_p","name":"On neck line","bull":true,"fam":"cont","trend":"u","c":[["w",37,42,72,78],["b",78,78,88,93]],"n":2,"d":"In un rialzo: verde lunga, poi una rossa che apre più in alto e chiude proprio al massimo della verde.","twin":"onneck_m"},{"id":"onneck_m","name":"On neck line","bull":false,"fam":"cont","trend":"d","c":[["b",21,26,55,60],["w",7,11,21,21]],"n":2,"d":"In un ribasso: rossa lunga, poi una verde piccola che apre più in basso e chiude solo al minimo della rossa. Rimbalzo debole.","twin":"onneck_p"},{"id":"inneck_p","name":"In neck line","bull":true,"fam":"cont","trend":"u","c":[["w",43,50,85,92],["b",81,82,98,103]],"n":2,"d":"In un rialzo: verde lunga, poi una rossa che apre più in alto e chiude appena dentro il corpo verde.","twin":"inneck_m"},{"id":"inneck_m","name":"In neck line","bull":false,"fam":"cont","trend":"d","c":[["b",17,23,59,65],["w",2,8,25,25]],"n":2,"d":"Come la on neck, ma la verde chiude appena dentro il corpo rosso, poco sopra la sua chiusura. Rimbalzo debole.","twin":"inneck_p"}];
const BYID = Object.fromEntries(P.map(p => [p.id, p]));
const ROUND = 10;

/* ---------- storage (best effort) ---------- */
const store = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};
// ogni utente ha la sua copia locale (chiave + ":" + id); senza account la chiave è quella semplice
let space = "";
const K = k => k + space;
const PREFS0 = {tab:"f2n", fam:"all", ans:"btn", hl:true, sfilter:"all"};
let stats = store.get(K("dojo-stats-v1"), {});
let prefs = Object.assign({}, PREFS0, store.get(K("dojo-prefs-v1"), {}));
function savePrefs(){ store.set(K("dojo-prefs-v1"), prefs); cloud.schedule(); }
function saveStats(){ store.set(K("dojo-stats-v1"), stats); cloud.schedule(); }
if(!prefs.srsSeen){ prefs.mode = "srs"; prefs.srsSeen = true; }
/* ---------- account: login su Supabase ----------
   Ci si registra con username, email e password; l'email riceve un codice a 6 cifre
   che conferma l'account. Chi si è registrato prima delle email ha un indirizzo
   interno <username>@USER_DOMAIN: entra con lo username e può aggiungere l'email
   dalla pagina Account. I progressi stanno nella tabella progress, una riga per
   utente, protetta da regole che fanno leggere e scrivere a ciascuno solo la
   propria (schema.sql, account.sql). Sul dispositivo resta una copia per ogni
   utente, più quella di chi usa il Dojo senza account. */
const CFG = window.DOJO_CONFIG || {};
const USER_DOMAIN = "utenti.dojo-delle-candele.app";
const isLegacy = email => !email || email.endsWith("@" + USER_DOMAIN);
/* controllo anti-robot di Cloudflare Turnstile, attivo solo se config.js ha turnstileSiteKey.
   Ogni gettone vale una volta sola: dopo l'uso il widget ne prepara subito un altro. */
const captcha = (() => {
  const key = CFG.turnstileSiteKey;
  let id = null, el = null, token = "", waiters = [];
  if(key){
    window.dojoTurnstile = () => mount(el);
    const sc = document.createElement("script");
    sc.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=dojoTurnstile"; sc.async = true;
    document.head.appendChild(sc);
  }
  function mount(box){
    el = box; token = "";
    if(id !== null && window.turnstile){ try{ turnstile.remove(id); }catch(e){} id = null; }
    if(!key || !box || !window.turnstile || !box.isConnected) return;
    id = turnstile.render(box, {sitekey: key, size: "flexible", appearance: "interaction-only", language: "it",
      theme: document.documentElement.dataset.theme || "auto",
      callback: t => { token = t; waiters.splice(0).forEach(f => f(t)); },
      "expired-callback": () => { token = ""; }, "error-callback": () => { token = ""; }});
  }
  async function take(){
    if(!key) return undefined;
    if(!window.turnstile) throw "Il controllo anti-robot non si è caricato: ricarica la pagina.";
    const t = token || await new Promise((res, rej) => { waiters.push(res); setTimeout(() => rej("Completa il controllo anti-robot qui sotto, poi riprova."), 10000); });
    token = ""; if(id !== null) try{ turnstile.reset(id); }catch(e){}
    return t;
  }
  return {mount, take};
})();
const cloud = (() => {
  const ready = !!(window.supabase && CFG.supabaseUrl && CFG.supabaseAnonKey && !/INSERISCI/.test(CFG.supabaseUrl + CFG.supabaseAnonKey));
  const sb = ready ? window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey) : null;
  let user = null, state = ready ? "guest" : "local", timer = 0, writing = false, dirty = false, lastErr = "";
  const uname = u => (u && u.user_metadata && u.user_metadata.username) || (u && u.email ? u.email.split("@")[0] : "");
  const payload = () => Object.assign({v:1, srs, stats, daily, prefs}, window.Scenari ? Scenari.data() : {});
  function paint(s){
    if(s) state = s;
    const box = $("#acct"); if(!box) return;
    const dot = {ok:"ok", saving:"busy", loading:"busy", error:"ko"}[state] || "";
    const msg = {
      local: !window.supabase ? "Login non attivo: la libreria di Supabase non si è caricata" : "Login non attivo: inserisci URL e chiave di Supabase in config.js",
      guest: "Senza account: progressi salvati solo su questo dispositivo",
      loading: "Carico i tuoi progressi…",
      saving: "Salvataggio…",
      ok: "Progressi salvati nel tuo account",
      error: "Non riesco a salvare online: riprovo alla prossima risposta"
    }[state];
    box.innerHTML = `<span class="who noav"><span class="st ${dot}"></span><span class="txt">${user ? "<b></b> · " : ""}<span class="m"></span></span></span>` +
      (ready ? (user ? `<button class="linkbtn" id="accountBtn">Account</button>` : `<button class="linkbtn" id="loginBtn">Accedi o registrati</button>`) : "");
    if(user) box.querySelector("b").textContent = uname(user);
    box.querySelector(".m").textContent = msg + (state === "error" && lastErr ? ` (${lastErr})` : "");
    const ab = $("#accountBtn"); if(ab) ab.onclick = showAccount;
    const li = $("#loginBtn"); if(li) li.onclick = () => showAuth("in");
  }
  async function flush(){
    clearTimeout(timer); timer = 0;
    if(!user) return;
    if(writing){ dirty = true; return; }
    writing = true; dirty = false; paint("saving");
    const {error} = await sb.from("progress").upsert({user_id: user.id, data: payload(), updated_at: new Date().toISOString()});
    if(error && await recover(error)){ writing = false; return; }
    if(!error) lastErr = "";
    paint(error ? "error" : "ok");
    writing = false;
    if(dirty && user) flush();
  }
  function schedule(){ if(!user) return; clearTimeout(timer); timer = setTimeout(flush, 700); }
  // unisce i progressi del server con quelli locali: per ogni figura vince quella più avanti
  // i dati arrivano dal server: tiene solo le figure conosciute e solo numeri
  const num = v => Number.isFinite(+v) ? +v : 0;
  function clean(r){
    const srs = {}, stats = {}, ids = new Set(P.map(p => p.id));
    for(const [id, c] of Object.entries(r.srs || {})) if(ids.has(id) && c) srs[id] = {b: num(c.b), due: num(c.due)};
    for(const [id, c] of Object.entries(r.stats || {})) if(ids.has(id) && c) stats[id] = {r: num(c.r), w: num(c.w)};
    const d = r.daily || {};
    return {srs, stats, daily: {day: num(d.day), newCount: num(d.newCount)}, prefs: r.prefs && typeof r.prefs === "object" ? r.prefs : null};
  }
  function merge(raw){
    let changed = false;
    const r = clean(raw);
    const rs = r.srs, out = Object.assign({}, rs);
    for(const [id, c] of Object.entries(srs)){
      const o = rs[id];
      if(!o || c.b > o.b || (c.b === o.b && c.due > o.due)){ out[id] = c; changed = true; }
    }
    const rst = r.stats || {}, st = Object.assign({}, rst);
    for(const [id, c] of Object.entries(stats)){
      const o = rst[id] || {r:0, w:0};
      const m = {r: Math.max(o.r, c.r), w: Math.max(o.w, c.w)};
      if(m.r !== o.r || m.w !== o.w) changed = true;
      st[id] = m;
    }
    let d = r.daily || {day:0, newCount:0};
    if(daily.day > d.day || (daily.day === d.day && daily.newCount > d.newCount)){ d = daily; changed = true; }
    srs = out; stats = st; daily = d;
    if(r.prefs) for(const k of Object.keys(prefs)) if(k in r.prefs && typeof r.prefs[k] === typeof prefs[k]) prefs[k] = r.prefs[k];
    saveLocal();
    if(window.Scenari && Scenari.merge(raw)) changed = true;
    return changed;
  }
  // il database ha rifiutato: l'accesso può essere scaduto, o la 2FA è stata attivata dopo questo accesso
  async function recover(err, loading){
    lastErr = (err && err.message) || "";
    const r = await sb.auth.refreshSession();
    if(r.error || !r.data.session){ await sb.auth.signOut().catch(() => {}); user = null; setSpace(null); paint("guest"); showAuth("in"); return true; }
    if(await needsMfa()){ if(loading) user = null; showAuth("mfa"); return true; }
    return false;
  }
  // dopo la password: se l'account ha la verifica in due passaggi, chiede il codice dell'app
  async function needsMfa(){
    const {data} = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
    return !!data && data.nextLevel === "aal2" && data.currentLevel !== "aal2";
  }
  async function enter(u){
    if(await needsMfa()) return showAuth("mfa");
    if(user && user.id === u.id){ goHome(); schedule(); return; }
    const guest = {srs, stats, daily};
    user = u; setSpace(u.id); paint("loading");
    const {data, error} = await sb.from("progress").select("data").eq("user_id", u.id).maybeSingle();
    if(error){ if(await recover(error, true)) return; paint("error"); }
    else if(data){ if(merge(data.data || {})) flush(); else paint("ok"); }
    else {
      // primo accesso: porta nell'account quello che hai fatto senza account
      merge(guest); flush();
    }
    goHome();
  }
  async function logout(){
    if(timer) await flush();
    await sb.auth.signOut();
    user = null; setSpace(null); paint("guest"); goHome();
  }
  function errText(e){
    const m = (e && e.message || "").toLowerCase();
    if(m.includes("captcha")) return "Il controllo anti-robot non è passato: riprova tra qualche secondo.";
    if(m.includes("invalid login")) return "Username, email o password sbagliati.";
    if(m.includes("banned")) return "Questo account è sospeso. Per informazioni scrivi ad admin@dojodellecandele.com.";
    if(m.includes("troppi tentativi")) return "Troppi tentativi sbagliati con questo username: riprova tra 15 minuti o entra con l'email.";
    if(m.includes("already registered") || m.includes("already been registered")) return "Questa email ha già un account: prova ad accedere.";
    if(m.includes("database error saving new user")) return "Questo username è già preso o non è valido: scegline un altro.";
    if(m.includes("token has expired") || m.includes("invalid") && m.includes("otp") || m.includes("token")) return "Codice sbagliato o scaduto: controlla l'ultima email o fattene mandare un altro.";
    if(m.includes("rate limit") || m.includes("security purposes")) return "Troppe richieste in poco tempo: aspetta un minuto e riprova.";
    if(m.includes("should be different")) return "La nuova password deve essere diversa da quella attuale.";
    if(m.includes("aal2")) return "Prima inserisci il codice della tua app di autenticazione.";
    if(m.includes("password")) return "La password deve avere almeno 8 caratteri, con lettere e numeri.";
    if(m.includes("email") && m.includes("invalid")) return "Questo indirizzo email non sembra valido.";
    return "Qualcosa non ha funzionato: " + (e && e.message || "riprova tra poco.");
  }
  const must = async p => { const {data, error} = await p; if(error) throw errText(error); return data; };
  window.addEventListener("pagehide", () => { if(timer) flush(); });
  // con lo username chiede al database l'email dell'account, che arriva solo se la password è giusta (login.sql)
  async function toLogin(id, pw){
    if(id.includes("@")) return id;
    const {data, error} = await sb.rpc("login_email", {u: id, pw});
    if(error) throw errText(error);
    if(!data) throw errText({message: "invalid login"});
    return data;
  }
  return {
    get ready(){ return ready; }, get on(){ return !!user; }, get user(){ return user; }, sb, schedule, flush, logout, errText,
    async signIn(id, pw){
      const email = await toLogin(id, pw);
      const {data, error} = await sb.auth.signInWithPassword({email, password: pw, options: {captchaToken: await captcha.take()}});
      if(error){ if(/email not confirmed/i.test(error.message)){ AUTH.email = email; await this.resendSignup(email); return paintAuth("code"); } throw errText(error); }
      await enter(data.user);
    },
    async signUp(name, email, pw, marketing){
      const free = await must(sb.rpc("username_available", {u: name}));
      if(!free) throw "Questo username è già preso: scegline un altro.";
      const d = await must(sb.auth.signUp({email, password: pw, options: {data: {username: name, marketing: !!marketing}, captchaToken: await captcha.take()}}));
      if(d.session) await enter(d.user);   // conferma email disattivata
      return !d.session;
    },
    async verifySignup(email, code){ const d = await must(sb.auth.verifyOtp({email, token: code, type: "signup"})); await enter(d.user); },
    resendSignup: async email => must(sb.auth.resend({type: "signup", email, options: {captchaToken: await captcha.take()}})),
    sendReset: async email => must(sb.auth.resetPasswordForEmail(email, {captchaToken: await captcha.take()})),
    async resetWithCode(email, code, pw){
      const d = await must(sb.auth.verifyOtp({email, token: code, type: "recovery"}));
      if(await needsMfa()) return "mfa";   // con la verifica in due passaggi la password si cambia dopo il codice dell'app
      await must(sb.auth.updateUser({password: pw}));
      await enter(d.user);
    },
    async verifyMfa(code, newPw){
      const f = await must(sb.auth.mfa.listFactors());
      const totp = (f.totp || [])[0]; if(!totp) throw "Nessuna app di autenticazione collegata a questo account.";
      await must(sb.auth.mfa.challengeAndVerify({factorId: totp.id, code}));
      if(newPw) await must(sb.auth.updateUser({password: newPw}));
      const {data} = await sb.auth.getUser(); await enter(data.user);
    },
    async init(){
      paint();
      if(!ready) return;
      const {data} = await sb.auth.getSession();
      if(data.session) await enter(data.session.user);
      else if(!store.get("dojo-guest", false)) showAuth("in");
      sb.auth.onAuthStateChange((ev, s) => {
        if(ev === "SIGNED_OUT" && user){ user = null; setSpace(null); paint("guest"); goHome(); }
        if(ev === "USER_UPDATED" && s && user){ user = s.user; paint(); }
      });
    }
  };
})();

/* ---------- ripasso a intervalli (Leitner) ---------- */
const INT = [0, 1, 3, 7, 16, 35];          // giorni di attesa per ogni scatola
const NEW_PER_DAY = 5, SRS_MAX = 20;
let srs = store.get(K("dojo-srs-v1"), {});    // id -> {b: scatola 0..5, due: giorno}
let daily = store.get(K("dojo-daily-v1"), {day:0, newCount:0});
function loadLocal(){
  stats = store.get(K("dojo-stats-v1"), {});
  prefs = Object.assign({}, PREFS0, store.get(K("dojo-prefs-v1"), {}), {srsSeen:true});
  srs = store.get(K("dojo-srs-v1"), {});
  daily = store.get(K("dojo-daily-v1"), {day:0, newCount:0});
  if(window.Scenari) Scenari.load();
}
function saveLocal(){ store.set(K("dojo-srs-v1"), srs); store.set(K("dojo-daily-v1"), daily); store.set(K("dojo-stats-v1"), stats); store.set(K("dojo-prefs-v1"), prefs); }
function setSpace(id){ space = id ? ":" + id : ""; loadLocal(); }
const today = () => { const d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000); };
const sc = id => srs[id] || {b:0, due:0};
function saveSrs(){ store.set(K("dojo-srs-v1"), srs); store.set(K("dojo-daily-v1"), daily); cloud.schedule(); }
function newLeft(){ const t = today(); if(daily.day !== t) daily = {day:t, newCount:0}; return Math.max(0, NEW_PER_DAY - daily.newCount); }
function grade(id, ok, relearn){
  const c = Object.assign({b:0, due:0}, srs[id]);
  c.b = ok ? (relearn ? 1 : Math.min(5, c.b + 1)) : 1;
  c.due = today() + (ok ? INT[c.b] : 0);
  srs[id] = c; saveSrs(); return c;
}
function srsQueue(){
  const t = today(), list = P.filter(p => prefs.fam === "all" || p.fam === prefs.fam);
  const due = list.filter(p => sc(p.id).b > 0 && sc(p.id).due <= t).sort((a, b) => sc(a.id).due - sc(b.id).due).slice(0, SRS_MAX);
  const fresh = list.filter(p => sc(p.id).b === 0).slice(0, newLeft());
  return {due, fresh};
}
function whenText(day){
  const d = day - today();
  if(d <= 0) return "oggi";
  if(d === 1) return "domani";
  if(d < 7) return `tra ${d} giorni`;
  if(d < 14) return "tra una settimana circa";
  if(d < 28) return `tra ${Math.round(d / 7)} settimane`;
  return "tra un mese circa";
}
function nextDueDay(){
  const ds = Object.values(srs).filter(c => c.b > 0).map(c => c.due);
  return ds.length ? Math.min(...ds) : null;
}
function mastery(id){ const b = sc(id).b; return b >= 5 ? 3 : b >= 3 ? 2 : b >= 1 ? 1 : 0; }

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const esc = s => s.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const rnd = (a, b) => a + Math.random() * (b - a);
const shuffle = a => { for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const dirWord = p => p.bull ? "rialzista" : "ribassista";
const label = p => `${p.name} ${p.bull ? "+" : "–"}`;
const chipDir = p => `<span class="chip ${p.bull?"bull":"bear"}">${p.bull?"▲ rialzo":"▼ ribasso"}</span>`;
const chipN = p => `<span class="chip n">${p.n} candel${p.n===1?"a":"e"}</span>`;
const famName = f => f === "inv" ? "Inversione" : "Continuazione";

/* ---------- chart drawing ---------- */
// candle: [kind, low, bodyBottom, bodyTop, high]
function makeContext(p){
  if(!p.trend) return [];
  const m = 3, out = [];
  const f = p.c[0];
  const R = Math.max(...p.c.map(c => c[4])) - Math.min(...p.c.map(c => c[1]));
  const k = Math.max(.8, Math.min(1.6, R / 40));
  for(let i = m; i >= 1; i--){
    const size = rnd(5, 9) * k, step = rnd(8, 11) * k;
    let bot, top, kind;
    if(p.trend === "d"){
      bot = f[4] + rnd(2, 5) + (i - 1) * step; top = bot + size;
      kind = Math.random() < .78 ? "b" : "w";
    } else {
      top = f[1] - rnd(2, 5) - (i - 1) * step; bot = top - size;
      kind = Math.random() < .78 ? "w" : "b";
    }
    out.push([kind, bot - rnd(.8, 3.5), bot, top, top + rnd(.8, 3.5)]);
  }
  return out;
}

function chartSVG(p, o = {}){
  const ctx = o.context || [];
  const all = ctx.concat(p.c);
  const n = all.length;
  const arrow = o.arrow && p.trend;
  const W = o.w || 320, H = o.h || 200, padX = 18, padY = 16;
  const arrW = arrow ? 42 : 0;
  let lo = Math.min(...all.map(c => c[1])), hi = Math.max(...all.map(c => c[4]));
  if(arrow){ if(p.trend==="d") hi = Math.max(hi, p.c[0][4] + 30); else lo = Math.min(lo, p.c[0][1] - 30); }
  const slot = Math.min(o.maxSlot || 36, (W - 2*padX - arrW) / Math.max(n, 1));
  const groupW = arrW + slot * n;
  const x0 = (W - groupW) / 2 + arrW + slot / 2;
  const s = (H - 2*padY) / Math.max(hi - lo, 20);
  const yOff = padY + ((H - 2*padY) - (hi - lo) * s) / 2;
  const Y = v => H - yOff - (v - lo) * s;
  const bw = Math.max(4, Math.min(o.maxBody || 16, slot * .58));
  const sw = Math.max(1.2, Math.min(2, bw / 8));
  let g = "";
  // faint horizontal grid
  for(let i=1;i<5;i++){ const y = (H*i/5).toFixed(1); g += `<line x1="0" x2="${W}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-width="1" stroke-dasharray="2 4" opacity=".7"/>`; }
  if(o.hl && ctx.length){
    const xa = x0 + ctx.length*slot - slot/2 + 2, xb = x0 + (n-1)*slot + slot/2 - 2;
    g += `<rect x="${xa.toFixed(1)}" y="3" width="${(xb-xa).toFixed(1)}" height="${H-6}" rx="7" fill="var(--hl)" stroke="var(--hl-line)" stroke-width="1" stroke-dasharray="3 3"/>`;
  }
  if(arrow){
    const f = p.c[0];
    const a = p.trend === "d" ? [f[4] + 28, f[4] + 4] : [f[1] - 28, f[1] - 4];
    const xs = x0 - arrW - slot*.15, xe = x0 - slot*.45;
    const ys = Y(a[0]), ye = Y(a[1]);
    const ang = Math.atan2(ye - ys, xe - xs), hd = 7;
    g += `<line x1="${xs.toFixed(1)}" y1="${ys.toFixed(1)}" x2="${(xe-hd*.7*Math.cos(ang)).toFixed(1)}" y2="${(ye-hd*.7*Math.sin(ang)).toFixed(1)}" stroke="var(--muted)" stroke-opacity=".55" stroke-width="2.4" stroke-linecap="round"/>`;
    g += `<polygon points="${xe},${ye} ${xe-hd*Math.cos(ang-.45)},${ye-hd*Math.sin(ang-.45)} ${xe-hd*Math.cos(ang+.45)},${ye-hd*Math.sin(ang+.45)}" fill="var(--muted)" fill-opacity=".55"/>`;
  }
  all.forEach((c, i) => {
    const cx = x0 + i*slot, [k, l, b, t, h] = c;
    if(k === "d"){
      g += `<line x1="${cx}" x2="${cx}" y1="${Y(h)}" y2="${Y(l)}" stroke="var(--doji)" stroke-width="${sw}"/>`;
      g += `<line x1="${cx-bw*.62}" x2="${cx+bw*.62}" y1="${Y(b)}" y2="${Y(b)}" stroke="var(--doji)" stroke-width="${sw*1.1}"/>`;
      return;
    }
    const col = k === "w" ? "var(--bull)" : "var(--bear)";
    g += `<line x1="${cx}" x2="${cx}" y1="${Y(h)}" y2="${Y(l)}" stroke="${col}" stroke-width="${sw}"/>`;
    const yt = Y(t), hh = Math.max(1.6, (t - b) * s);
    g += `<rect x="${(cx-bw/2).toFixed(1)}" y="${yt.toFixed(1)}" width="${bw.toFixed(1)}" height="${hh.toFixed(1)}" rx="1.5" fill="${col}"/>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.aria || "Grafico a candele")}">${g}</svg>`;
}

/* ---------- views & menu ---------- */
let view = "home";
const MODE_TITLE = {srs:"Ripasso del giorno", studia:"Studia", f2n:"Figura → Nome", n2f:"Nome → Figura", scen:"Scenari"};
function setTab(t){
  view = t; prefs.mode = t; savePrefs();
  $("#view-home").hidden = true; $("#view-auth").hidden = true; $("#view-account").hidden = true;
  $("#bar").hidden = false;
  $("#barTitle").textContent = MODE_TITLE[t];
  const famTxt = {all:"Tutte le famiglie", inv:"Solo inversione", cont:"Solo continuazione"}[prefs.fam];
  $("#barCfg").innerHTML = t === "studia" || t === "scen" ? "" : t === "srs" ? `<span class="chip n">${famTxt}</span><span class="chip n">${prefs.hl ? "Figura evidenziata" : "Senza aiuto"}</span>` :
    `<span class="chip n">${famTxt}</span>` + (t === "f2n" ? `<span class="chip n">${prefs.ans === "dd" ? "Menu a tendina" : "4 scelte"}</span>` : "") +
    `<span class="chip n">${prefs.hl ? "Figura evidenziata" : "Senza aiuto"}</span>`;
  $("#view-studia").hidden = t !== "studia";
  $("#view-quiz").hidden = t === "studia";
  heroAnim.stop();
  window.scrollTo({top:0});
  if(t === "studia") renderStudy(); else if(t === "scen") Scenari.round(); else newRound(t);
}
function curMode(){ return Q && Q.mode === "srs" ? Q.dirs[Q.i] : Q && Q.mode; }
function goHome(){
  view = "home";
  $("#view-auth").hidden = true; $("#view-account").hidden = true;
  syncControls();
  $("#view-home").hidden = false; $("#bar").hidden = true;
  $("#view-studia").hidden = true; $("#view-quiz").hidden = true;
  renderHome(); heroAnim.start();
  window.scrollTo({top:0});
}
$("#backBtn").onclick = goHome;

function selectMode(m, quiet){
  prefs.mode = m; if(!quiet) savePrefs();
  document.querySelectorAll(".mode").forEach(b => { const on = b.dataset.mode === m; b.setAttribute("aria-checked", on); b.tabIndex = on ? 0 : -1; });
  $("#settings").hidden = m === "studia" || m === "scen";
  $("#ansField").hidden = m !== "f2n";
  $("#startBtn").firstChild.textContent = m === "studia" ? "Apri lo studio " : m === "srs" ? "Inizia il ripasso " : m === "scen" ? "Apri gli scenari " : "Inizia il giro ";
  $("#startHint").textContent = m === "studia" ? "Sfoglia tutte le figure con calma." : m === "srs" ? srsHint() : m === "scen" ? (window.Scenari ? Scenari.hint() : "Due o tre figure in fila: riconoscile e leggile insieme.") : "10 domande di allenamento libero.";
}
document.querySelectorAll(".mode").forEach(b => {
  b.onclick = () => selectMode(b.dataset.mode);
  b.ondblclick = () => setTab(b.dataset.mode);
  b.onkeydown = e => {
    const ms = ["srs","studia","f2n","n2f","scen"], i = ms.indexOf(b.dataset.mode);
    if(e.key === "ArrowRight" || e.key === "ArrowDown"){ e.preventDefault(); selectMode(ms[(i+1)%ms.length]); $("#mode-"+prefs.mode).focus(); }
    if(e.key === "ArrowLeft" || e.key === "ArrowUp"){ e.preventDefault(); selectMode(ms[(i+ms.length-1)%ms.length]); $("#mode-"+prefs.mode).focus(); }
  };
});
$("#startBtn").onclick = () => setTab(prefs.mode);

function srsHint(){
  const {due, fresh} = srsQueue();
  if(!due.length && !fresh.length){ const nd = nextDueDay(); return "Per oggi hai finito." + (nd !== null ? ` Il prossimo ripasso è ${whenText(nd)}.` : ""); }
  const parts = [];
  if(due.length) parts.push(due.length === 1 ? "1 figura da ripassare" : `${due.length} figure da ripassare`);
  if(fresh.length) parts.push(fresh.length === 1 ? "1 nuova" : `${fresh.length} nuove`);
  return "Oggi ti aspettano " + parts.join(" e ") + ".";
}
function renderHome(){
  const order = ["inv","cont"].flatMap(f => [true,false].flatMap(b => P.filter(p => p.fam === f && p.bull === b)));
  $("#progDots").innerHTML = order.map(p => {
    const b = sc(p.id).b;
    const cls = b >= 5 ? "l3" : b >= 3 ? "l2" : (b >= 1 || stats[p.id]) ? "l1" : "";
    return `<i class="${cls}" title="${esc(label(p))}"></i>`;
  }).join("");
  const nd = nextDueDay();
  $("#nextDue").textContent = nd === null ? "Comincia dal Ripasso del giorno: ogni giorno ti presenta 5 figure nuove." : `Prossime figure da ripassare: ${whenText(nd)}.`;
  if(prefs.mode === "srs") $("#startHint").textContent = srsHint();
  if(prefs.mode === "scen" && window.Scenari) $("#startHint").textContent = Scenari.hint();
  $("#resetBox").innerHTML = `<button class="linkbtn" id="resetBtn">Azzera i progressi</button>`;
  $("#resetBtn").onclick = () => {
    $("#resetBox").innerHTML = `<span class="hint">${cloud.on ? "Cancello tutti i progressi, anche quelli salvati nel tuo account?" : "Cancello tutti i progressi su questo dispositivo?"}</span><button class="btn danger" id="resetYes">Sì, azzera</button><button class="btn ghost small" id="resetNo">Annulla</button>`;
    $("#resetYes").onclick = () => { srs = {}; stats = {}; daily = {day:0, newCount:0}; if(window.Scenari) Scenari.reset(); saveSrs(); saveStats(); renderHome(); };
    $("#resetNo").onclick = renderHome;
  };
}
function renderIllustrations(){
  const mini = (id, o) => chartSVG(BYID[id], Object.assign({arrow:true, w:90, h:80, maxSlot:16, maxBody:8}, o));
  const boxes = ["oggi","1 g","3 g","1 sett.","2 sett.","1 mese"].slice(1);
  $("#ill-srs").innerHTML = `<div style="display:flex;align-items:flex-end;gap:5px;padding:10px 10px 14px;width:100%;height:100%;position:relative">${boxes.map((t, i) => {
    const n = 4 - Math.min(3, i);
    return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0">
      <div style="display:flex;flex-direction:column-reverse;gap:2px;width:100%;align-items:center">${Array.from({length:n}, (_, j) => `<span style="display:block;width:70%;height:7px;border-radius:2px;background:${i >= 3 ? "var(--bull)" : i >= 1 ? "var(--hl-line)" : "var(--line)"};opacity:${.55 + j * .12}"></span>`).join("")}</div>
      <span style="display:block;width:100%;height:14px;border:1.5px solid var(--line);border-top:0;border-radius:0 0 4px 4px;background:var(--card)"></span>
</div>`;
  }).join("")}<span style="position:absolute;left:10px;right:10px;bottom:3px;display:flex;justify-content:space-between;font-family:var(--mono);font-size:9px;color:var(--muted)"><span>oggi</span><span>tra un mese</span></span></div>`;
  $("#ill-studia").innerHTML = `<div style="display:flex;gap:6px;padding:8px;width:100%;height:100%">${["hammer_p","engulf_m","mstar_p"].map(id =>
    `<div style="flex:1;background:var(--card);border:1px solid var(--line);border-radius:6px;display:flex;flex-direction:column;padding:3px;min-width:0">${mini(id)}<span style="display:block;height:4px;width:70%;background:var(--line);border-radius:2px;margin:3px auto 2px"></span><span style="display:block;height:3px;width:45%;background:var(--line);border-radius:2px;margin:0 auto"></span></div>`).join("")}</div>`;
  const es = BYID["estar_m"];
  $("#ill-f2n").innerHTML = `<div style="position:relative;width:100%;height:100%">${chartSVG(es, {context: makeContext(es), hl:true, w:260, h:104, maxSlot:24, maxBody:12})}
    <span style="position:absolute;right:10px;top:8px;width:28px;height:28px;border-radius:50%;background:var(--accent);color:var(--card);display:grid;place-items:center;font-family:var(--display);font-size:18px">?</span></div>`;
  $("#ill-n2f").innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding:6px;width:100%;height:100%">
    <span style="background:var(--card);border:1px solid var(--line);border-radius:6px;padding:1px 8px;font-weight:600;font-size:12px;white-space:nowrap">Hammer <span style="color:var(--bull)">▲</span></span>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;width:100%;max-width:200px;min-height:0;flex:1">${["hanging_m","hammer_p","shooting_m"].map((id,i) =>
      `<div style="background:var(--card);border:1.5px solid ${i===1?"var(--bull)":"var(--line)"};border-radius:5px;min-width:0;display:flex">${mini(id,{w:70,h:56})}</div>`).join("")}</div></div>`;
}

/* hero: candles drifting slowly to the left */
const heroAnim = (() => {
  const cv = $("#heroCanvas"); const ctx = cv.getContext("2d");
  let raf = 0, candles = [], off = 0, last = 50, W = 0, H = 0;
  const CW = 22;
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  function nextCandle(){
    const o = last, c = Math.max(12, Math.min(88, o + (Math.random() - .48) * 14));
    const hi = Math.max(o, c) + Math.random() * 6, lo = Math.min(o, c) - Math.random() * 6;
    last = c; return {o, c, hi, lo};
  }
  function size(){
    const r = cv.getBoundingClientRect(), d = window.devicePixelRatio || 1;
    W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    while(candles.length < W / CW + 3) candles.push(nextCandle());
  }
  function draw(){
    ctx.clearRect(0, 0, W, H);
    const bull = css("--bull"), bear = css("--bear");
    const y = v => H * .92 - v / 100 * H * .84;
    candles.forEach((k, i) => {
      const x = i * CW - off + CW / 2;
      const col = k.c >= k.o ? bull : bear;
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(x, y(k.hi)); ctx.lineTo(x, y(k.lo)); ctx.stroke();
      const t = y(Math.max(k.o, k.c)), b = y(Math.min(k.o, k.c));
      ctx.fillRect(x - CW * .3, t, CW * .6, Math.max(2, b - t));
    });
  }
  function tick(){
    off += .25;
    if(off >= CW){ off -= CW; candles.shift(); candles.push(nextCandle()); }
    draw(); raf = requestAnimationFrame(tick);
  }
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.addEventListener("resize", () => { if(getComputedStyle(cv).display === "none"){ cancelAnimationFrame(raf); raf = 0; return; } size(); draw(); if(!still && !raf && view === "home") raf = requestAnimationFrame(tick); });
  window.addEventListener("dojo-theme", () => { if(raf || still) draw(); });
  return {
    start(){ if(getComputedStyle(cv).display === "none") return; size(); draw(); if(!still && !raf) raf = requestAnimationFrame(tick); },
    stop(){ cancelAnimationFrame(raf); raf = 0; }
  };
})();

function syncControls(){
  [["#famSeg","fam"],["#ansSeg","ans"],["#studySeg","sfilter"]].forEach(([id, k]) =>
    $(id).querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.v === prefs[k])));
  $("#hlToggle").checked = prefs.hl;
  selectMode(["srs","studia","f2n","n2f","scen"].includes(prefs.mode) ? prefs.mode : "srs", true);
}
function bindSeg(id, key, cb){
  const el = $(id);
  const paint = () => el.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.v === prefs[key]));
  el.querySelectorAll("button").forEach(b => b.onclick = () => { prefs[key] = b.dataset.v; savePrefs(); paint(); cb(); });
  paint();
}

/* ---------- quiz ---------- */
let Q = null;
function pool(){ return P.filter(p => prefs.fam === "all" || p.fam === prefs.fam); }
function weight(p){ const s = stats[p.id] || {r:0, w:0}; return Math.max(.35, 1 + 1.6*s.w - .45*s.r); }
function pickQuestions(list, k){
  const src = list.slice(), out = [];
  while(out.length < k && src.length){
    const tot = src.reduce((a, p) => a + weight(p), 0);
    let r = Math.random() * tot, i = 0;
    for(; i < src.length - 1; i++){ r -= weight(src[i]); if(r <= 0) break; }
    out.push(src.splice(i, 1)[0]);
  }
  return out;
}
function distractors(t, list, k){
  const others = list.filter(p => p.id !== t.id);
  const chosen = [];
  const add = p => { if(p && !chosen.includes(p) && p.id !== t.id) chosen.push(p); };
  if(t.twin && Math.random() < .75) add(BYID[t.twin]);
  shuffle(others.filter(p => p.n === t.n)).slice(0, 2).forEach(add);
  shuffle(others.slice()).forEach(p => { if(chosen.length < k) add(p); });
  return chosen.slice(0, k);
}
function newRound(mode, only){
  if(mode === "srs" && !only){
    const {due, fresh} = srsQueue();
    if(!due.length && !fresh.length) return renderDone();
    const qs = shuffle(due.slice()).concat(fresh);
    Q = {mode, list: pool(), qs, dirs: qs.map(() => Math.random() < .5 ? "f2n" : "n2f"), intro: new Set(fresh.map(p => p.id)),
         relearn: new Set(), requeued: {}, i:0, res:[], streak:0, best:0, answered:false};
    return renderQuestion();
  }
  const list = pool();
  const qs = only ? only.map(id => BYID[id]) : pickQuestions(list, Math.min(ROUND, list.length));
  Q = {mode, list, qs, i:0, res:[], streak:0, best:0, answered:false};
  renderQuestion();
}
function renderQuestion(){
  const box = $("#quiz");
  if(Q.i >= Q.qs.length) return renderSummary();
  const t = Q.qs[Q.i];
  if(!Q.cur || Q.cur.id !== t.id + Q.i){
    Q.cur = {id: t.id + Q.i, ctx: makeContext(t), opts: shuffle([t, ...distractors(t, Q.list.length >= 5 ? Q.list : P, 3)]), ctxFor:{}};
    Q.answered = false; Q.pick = null;
  }
  if(Q.mode === "srs" && Q.intro.has(t.id)) return renderIntro(t);
  const mode = curMode();
  const pips = Q.qs.map((_, i) => `<span class="pip ${i < Q.res.length ? (Q.res[i] ? "ok" : "ko") : (i === Q.i ? "cur" : "")}"></span>`).join("");
  let body = "";
  if(mode === "f2n"){
    body += `<h2 class="prompt">Che figura è questa?<small>${prefs.hl ? "La figura è nella zona evidenziata. Le candele prima mostrano il trend." : "Le prime candele mostrano il trend, poi arriva la figura."}</small></h2>`;
    body += `<div class="bigchart">${chartSVG(t, {context: Q.cur.ctx, hl: prefs.hl, w: 560, h: 260, maxSlot: 52, maxBody: 22, aria: "Grafico da riconoscere"})}</div>`;
    if(prefs.ans === "dd"){
      const opts = Q.list.slice().sort((a, b) => a.name.localeCompare(b.name) || (a.bull ? -1 : 1));
      body += `<div class="ddrow"><select id="dd" aria-label="Scegli la figura" ${Q.answered?"disabled":""}><option value="">Scegli la figura…</option>${opts.map(p => `<option value="${p.id}" ${Q.pick===p.id?"selected":""}>${esc(p.name)} — ${dirWord(p)}</option>`).join("")}</select><button class="btn" id="ddGo" ${Q.answered?"disabled":""}>Conferma</button></div>`;
    } else {
      body += `<div class="opts">${Q.cur.opts.map((p, i) => `<button class="opt ${optClass(p, t)}" data-id="${p.id}" ${Q.answered?"disabled":""}><span class="nm">${esc(p.name)}</span><span style="display:flex;gap:6px;align-items:center">${chipDir(p)}<span class="k">${i+1}</span></span></button>`).join("")}</div>`;
    }
  } else {
    body += `<h2 class="prompt">Trova: ${esc(t.name)} ${chipDir(t)}<small>Scegli il grafico giusto. In ogni grafico la zona evidenziata è la figura.</small></h2>`;
    body += `<div class="opts figs">${Q.cur.opts.map((p, i) => {
      const ctx = Q.cur.ctxFor[p.id] || (Q.cur.ctxFor[p.id] = makeContext(p));
      return `<button class="opt fig ${optClass(p, t)}" data-id="${p.id}" ${Q.answered?"disabled":""} aria-label="Opzione ${i+1}"><span class="k">${i+1}</span>${chartSVG(p, {context: ctx, hl: prefs.hl, w: 300, h: 170, maxSlot: 34, maxBody: 15, aria: "Opzione " + (i+1)})}</button>`;
    }).join("")}</div>`;
  }
  if(Q.answered) body += feedback(t);
  box.innerHTML = `<div class="qhead"><div class="pips" aria-label="Avanzamento">${pips}</div><div class="streak">Di fila <b>${Q.streak}</b> · Record <b>${Q.best}</b></div></div><div class="panel qcard">${body}</div>`;
  box.querySelectorAll(".opt").forEach(b => b.onclick = () => answer(b.dataset.id));
  const go = $("#ddGo"); if(go) go.onclick = () => { const v = $("#dd").value; if(v) answer(v); };
  const nx = $("#next"); if(nx) { nx.onclick = next; nx.focus({preventScroll:true}); }
}
function optClass(p, t){
  if(!Q.answered) return "";
  if(p.id === t.id) return "right";
  if(p.id === Q.pick) return "wrong";
  return "";
}
function answer(id){
  if(Q.answered) return;
  const t = Q.qs[Q.i], ok = id === t.id;
  Q.answered = true; Q.pick = id; Q.res.push(ok);
  const s = stats[t.id] || (stats[t.id] = {r:0, w:0});
  ok ? s.r++ : s.w++;
  saveStats();
  Q.lastGrade = null;
  if(Q.mode === "srs"){
    Q.lastGrade = grade(t.id, ok, Q.relearn.has(t.id));
    if(!ok){
      Q.relearn.add(t.id);
      Q.requeued[t.id] = (Q.requeued[t.id] || 0) + 1;
      if(Q.requeued[t.id] <= 3){
        const pos = Math.min(Q.qs.length, Q.i + 3);
        Q.qs.splice(pos, 0, t); Q.dirs.splice(pos, 0, Math.random() < .5 ? "f2n" : "n2f");
      }
    }
  } else {
    const c = srs[t.id];
    if(c && c.b > 0){
      if(!ok){ c.b = Math.max(1, c.b - 1); c.due = Math.min(c.due, today() + 1); saveSrs(); }
      else if(c.due <= today()){ grade(t.id, true, false); }
    }
  }
  Q.streak = ok ? Q.streak + 1 : 0; Q.best = Math.max(Q.best, Q.streak);
  renderQuestion();
}
function feedback(t){
  const ok = Q.pick === t.id, picked = BYID[Q.pick];
  let h = `<div class="fb ${ok?"ok":"ko"}" role="status"><h3>${ok ? "Giusto!" : "Non proprio."} ${esc(t.name)} ${chipDir(t)} ${chipN(t)}</h3><p>${esc(t.d)}</p>`;
  if(Q.lastGrade){
    h += `<span class="nextchip">${ok ? "La rivedrai " + whenText(Q.lastGrade.due) : (Q.requeued[t.id] <= 3 ? "Te la richiedo tra poco" : "La rivedrai oggi stesso")}</span>`;
  }
  if(!ok && picked){
    h += `<div class="compare">
      <figure>${chartSVG(t, {arrow:true, w:280, h:150, maxSlot:30, maxBody:14})}<figcaption>Era: <b>${esc(label(t))}</b></figcaption></figure>
      <figure>${chartSVG(picked, {arrow:true, w:280, h:150, maxSlot:30, maxBody:14})}<figcaption>Hai scelto: <b>${esc(label(picked))}</b> — ${esc(picked.d)}</figcaption></figure></div>`;
  }
  h += `<div class="actions"><button class="btn" id="next">${Q.i + 1 >= Q.qs.length ? "Vedi il risultato" : "Avanti"}</button><span class="hint">oppure premi Invio</span></div></div>`;
  return h;
}
function next(){ Q.i++; Q.cur = null; renderQuestion(); window.scrollTo({top: Math.min(window.scrollY, $("#quiz").offsetTop - 80), behavior:"smooth"}); }
function renderIntro(t){
  const twin = t.twin ? BYID[t.twin] : null;
  $("#quiz").innerHTML = `<div class="qhead"><div class="pips">${Q.qs.map((_, i) => `<span class="pip ${i < Q.res.length ? (Q.res[i] ? "ok" : "ko") : (i === Q.i ? "cur" : "")}"></span>`).join("")}</div></div>
  <div class="panel intro">
    <div class="eyebrow">Figura nuova · guardala bene</div>
    <h2>${esc(t.name)}</h2>
    <div style="display:flex;gap:6px;flex-wrap:wrap">${chipDir(t)}${chipN(t)}<span class="chip fam">${famName(t.fam)}</span></div>
    <div class="big">${chartSVG(t, {arrow:true, w:520, h:240, maxSlot:56, maxBody:24, aria: label(t)})}</div>
    <p style="margin:0;max-width:65ch;font-size:16px">${esc(t.d)}</p>
    ${twin ? `<p class="hint" style="margin:0">La sua gemella è ${esc(label(twin))}: stessa idea, direzione opposta.</p>` : ""}
    <div class="actions"><button class="btn" id="gotit">Ho capito, mettimi alla prova</button></div>
  </div>`;
  const b = $("#gotit");
  b.onclick = () => { Q.intro.delete(t.id); newLeft(); daily.newCount++; srs[t.id] = srs[t.id] || {b:0, due:today()}; saveSrs(); renderQuestion(); };
  b.focus({preventScroll:true});
}
function renderDone(){
  const nd = nextDueDay();
  $("#quiz").innerHTML = `<div class="panel summary"><div class="eyebrow">Ripasso del giorno</div><p class="score">Per oggi hai finito.</p>
    <p style="margin:0;color:var(--muted);max-width:60ch">${nd !== null ? `Le prossime figure da ripassare arrivano ${whenText(nd)}. ` : ""}Le figure nuove sono finite per oggi: domani ne arrivano altre. Se vuoi, puoi allenarti liberamente.</p>
    <div class="actions"><button class="btn" id="freeGo">Allenamento libero</button><button class="btn ghost" id="homeGo">Torna al menu</button></div></div>`;
  $("#freeGo").onclick = () => setTab("f2n");
  $("#homeGo").onclick = goHome;
}
function renderSrsSummary(){
  const ids = [...new Set(Q.qs.map(p => p.id))];
  const groups = {};
  ids.forEach(id => { const w = whenText(sc(id).due); (groups[w] = groups[w] || []).push(BYID[id]); });
  const order = ["oggi","domani"];
  const keys = Object.keys(groups).sort((a, b) => {
    const da = Math.min(...groups[a].map(p => sc(p.id).due)), db = Math.min(...groups[b].map(p => sc(p.id).due)); return da - db; });
  const good = Q.res.filter(Boolean).length;
  $("#quiz").innerHTML = `<div class="panel summary"><div class="eyebrow">Ripasso finito</div>
    <p class="score">${good === Q.res.length ? "Tutto giusto, ottimo." : "Fatto. Le figure sbagliate le hai ripassate subito."}</p>
    <div class="pips">${Q.res.map(r => `<span class="pip ${r ? "ok" : "ko"}"></span>`).join("")}</div>
    <div><div class="eyebrow" style="margin-bottom:8px">Quando le rivedrai</div>
    <div class="sched">${keys.map(k => `<div><b>${k[0].toUpperCase() + k.slice(1)}</b><span>${groups[k].map(p => esc(label(p))).join(", ")}</span></div>`).join("")}</div></div>
    <div class="actions"><button class="btn" id="homeGo">Torna al menu</button><button class="btn ghost" id="freeGo">Allenamento libero</button></div></div>`;
  $("#homeGo").onclick = goHome;
  $("#freeGo").onclick = () => setTab("f2n");
}
function renderSummary(){
  if(Q.mode === "srs") return renderSrsSummary();
  const good = Q.res.filter(Boolean).length, tot = Q.res.length;
  const wrong = Q.qs.filter((_, i) => !Q.res[i]);
  const msg = good === tot ? "Giro perfetto." : good >= tot * .7 ? "Ottimo lavoro." : good >= tot * .4 ? "Stai migliorando." : "Si impara sbagliando.";
  const pips = Q.res.map(r => `<span class="pip ${r?"ok":"ko"}"></span>`).join("");
  let h = `<div class="panel summary"><div class="eyebrow">Fine del giro</div><p class="score">${msg}</p>
    <div class="pips">${pips}</div><p style="margin:0;color:var(--muted)">Giuste: ${good} su ${tot}. Record di risposte giuste di fila: ${Q.best}.</p>`;
  if(wrong.length){
    h += `<div><div class="eyebrow" style="margin-bottom:8px">Da ripassare</div><div class="grid">${wrong.map(cardHTML).join("")}</div></div>`;
  }
  h += `<div class="actions"><button class="btn" id="again">Nuovo giro</button>${wrong.length ? `<button class="btn ghost" id="retry">Rifai solo quelle sbagliate</button>` : ""}</div></div>`;
  $("#quiz").innerHTML = h;
  $("#again").onclick = () => newRound(Q.mode);
  const r = $("#retry"); if(r) r.onclick = () => newRound(Q.mode, shuffle(wrong.map(p => p.id)));
  bindTwinLinks($("#quiz"));
}
document.addEventListener("keydown", e => {
  if(view === "home" || view === "studia" || view === "auth" || view === "account" || !Q || e.target.tagName === "SELECT" || e.target.tagName === "INPUT") return;
  if(Q.mode === "scen") return Scenari.key(e);
  if(Q.mode === "srs" && Q.intro && Q.qs[Q.i] && Q.intro.has(Q.qs[Q.i].id)) return;
  if(!Q.answered && /^[1-4]$/.test(e.key) && (curMode() === "n2f" || prefs.ans === "btn")){
    const o = Q.cur && Q.cur.opts[+e.key - 1]; if(o) answer(o.id);
  } else if(Q.answered && e.key === "Enter" && document.activeElement?.id !== "next"){ next(); }
});

/* ---------- study ---------- */
function cardHTML(p){
  const m = mastery(p.id);
  const twin = p.twin ? BYID[p.twin] : null;
  return `<article class="panel card" id="c-${p.id}">
    <div class="well">${chartSVG(p, {arrow:true, w:240, h:150, maxSlot:30, maxBody:14, aria: label(p)})}</div>
    <h3>${esc(p.name)}</h3>
    <div class="chips">${chipDir(p)}${chipN(p)}<span class="chip fam">${famName(p.fam)}</span></div>
    <p>${esc(p.d)}</p>
    <div class="foot">${twin ? `<button data-go="${twin.id}">Gemella: ${esc(label(twin))}</button>` : "<span></span>"}<span class="meter" title="Quanto la conosci">${[0,1,2].map(i => `<i class="${i < m ? "on" : ""}"></i>`).join("")}</span></div>
  </article>`;
}
function bindTwinLinks(root){
  root.querySelectorAll("[data-go]").forEach(b => b.onclick = () => {
    if(view !== "studia"){ $("#search").value = ""; setTab("studia"); }
    const el = document.getElementById("c-" + b.dataset.go);
    if(el){ el.scrollIntoView({behavior:"smooth", block:"center"}); el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); }
  });
}
function renderStudy(){
  const q = $("#search").value.trim().toLowerCase();
  const f = prefs.sfilter;
  const vis = P.filter(p => (f === "all" || (f === "bull") === p.bull) && (!q || p.name.toLowerCase().includes(q) || p.d.toLowerCase().includes(q)));
  const groups = [["inv", true, "Inversione al rialzo"], ["inv", false, "Inversione al ribasso"], ["cont", true, "Continuazione al rialzo"], ["cont", false, "Continuazione al ribasso"]];
  let h = "";
  for(const [fam, bull, title] of groups){
    const items = vis.filter(p => p.fam === fam && p.bull === bull);
    if(!items.length) continue;
    h += `<div class="sect"><h2>${title}</h2><span class="eyebrow">${items.length} figure</span></div><div class="grid">${items.map(cardHTML).join("")}</div>`;
  }
  $("#study").innerHTML = h || `<p class="empty">Nessuna figura trovata. Prova con un altro nome.</p>`;
  bindTwinLinks($("#study"));
}
$("#search").addEventListener("input", renderStudy);

/* ---------- schermata di accesso ---------- */
const AUTH = {step: "in", email: ""};
const weakPw = p => p.length < 8 || !/[a-z]/i.test(p) || !/\d/.test(p);
const fieldHTML = (id, label, attrs) => `<label for="${id}">${label}</label><input id="${id}" ${attrs}>`;
function showAuth(step){
  view = "auth";
  ["#view-home", "#view-quiz", "#view-studia", "#view-account", "#bar"].forEach(s => $(s).hidden = true);
  $("#view-auth").hidden = false;
  heroAnim.stop();
  paintAuth(step || "in");
}
function paintAuth(step){
  AUTH.step = step;
  const card = $("#authCard");
  const tabs = step === "in" || step === "up";
  const T = {
    in: ["Bentornato nel dojo", "Con un account i tuoi progressi ti seguono su ogni dispositivo."],
    up: ["Crea il tuo account", "Ti mandiamo un codice via email per confermare che l'indirizzo è tuo."],
    code: ["Controlla la tua email", ""],
    forgot: ["Password dimenticata", "Scrivi l'email del tuo account: ti mandiamo un codice per sceglierne una nuova."],
    reset: ["Scegli la nuova password", ""],
    mfa: ["Verifica in due passaggi", "Apri l'app di autenticazione e scrivi il codice a 6 cifre del Dojo."]
  }[step];
  const code = `inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]*" placeholder="123456"`;
  let f = "";
  if(step === "in") f = fieldHTML("au-id", "Email o username", `autocomplete="username" autocapitalize="none" spellcheck="false"`) + fieldHTML("au-pw", "Password", `type="password" autocomplete="current-password"`);
  if(step === "up") f = fieldHTML("au-name", "Username", `autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="24"`) +
    fieldHTML("au-email", "Email", `type="email" autocomplete="email" autocapitalize="none" spellcheck="false"`) +
    fieldHTML("au-pw", "Password", `type="password" autocomplete="new-password"`) + fieldHTML("au-pw2", "Ripeti la password", `type="password" autocomplete="new-password"`) +
    `<label class="check"><input type="checkbox" id="au-mkt"> <span>Voglio ricevere via email novità e consigli dal Dojo. Puoi disiscriverti quando vuoi.</span></label>
    <p class="hint">Creando l'account confermi di aver letto l'<a href="privacy.html" target="_blank" rel="noopener">informativa privacy</a>.</p>`;
  if(step === "code" || step === "mfa") f = fieldHTML("au-code", "Codice a 6 cifre", code);
  if(step === "forgot") f = fieldHTML("au-email", "Email", `type="email" autocomplete="email" autocapitalize="none" spellcheck="false"`);
  if(step === "reset") f = fieldHTML("au-code", "Codice a 6 cifre", code) + fieldHTML("au-pw", "Nuova password", `type="password" autocomplete="new-password"`) + fieldHTML("au-pw2", "Ripeti la password", `type="password" autocomplete="new-password"`);
  const go = {in: "Entra", up: "Crea account", code: "Conferma", forgot: "Mandami il codice", reset: "Salva e entra", mfa: "Verifica"}[step];
  card.innerHTML = `<div class="eyebrow">Dojo delle candele · 道場</div><h2></h2><p class="hint au-sub"></p>
    ${tabs ? `<div class="seg" id="authSeg" role="group" aria-label="Accedi o registrati"><button type="button" data-v="in">Accedi</button><button type="button" data-v="up">Registrati</button></div>` : ""}
    <form id="authForm" novalidate>${f}${["in", "up", "code", "forgot"].includes(step) ? `<div class="cf-ts" id="au-ts"></div>` : ""}<p class="au-err" id="au-err" role="alert"></p><p class="au-ok" id="au-ok" role="status"></p><button class="btn big" id="au-go" type="submit">${go}</button></form>
    <div class="au-links">
      ${step === "in" ? `<button class="linkbtn" type="button" data-s="forgot">Password dimenticata?</button>` : ""}
      ${step === "code" ? `<button class="linkbtn" type="button" id="au-resend">Mandami un altro codice</button>` : ""}
      ${tabs ? `<button class="linkbtn" id="au-guest" type="button">Continua senza account</button>` : `<button class="linkbtn" type="button" data-s="in">Torna all'accesso</button>`}
    </div>`;
  card.querySelector("h2").textContent = T[0];
  card.querySelector(".au-sub").textContent = step === "code" ? `Abbiamo mandato un codice a 6 cifre a ${AUTH.email}. Scrivilo qui per attivare l'account.` :
    step === "reset" ? `Scrivi il codice che abbiamo mandato a ${AUTH.email} e la nuova password.` : T[1];
  card.querySelectorAll("#authSeg button").forEach(b => { b.setAttribute("aria-pressed", b.dataset.v === step); b.onclick = () => paintAuth(b.dataset.v); });
  card.querySelectorAll("[data-s]").forEach(b => b.onclick = async () => { if(step === "mfa") await cloud.sb.auth.signOut(); paintAuth(b.dataset.s); });
  const guest = $("#au-guest"); if(guest) guest.onclick = () => { store.set("dojo-guest", true); goHome(); };
  const resend = $("#au-resend"); if(resend) resend.onclick = async () => {
    try{ await cloud.resendSignup(AUTH.email); $("#au-ok").textContent = "Codice rimandato: controlla anche lo spam."; $("#au-err").textContent = ""; }
    catch(m){ $("#au-err").textContent = m; }
  };
  $("#authForm").addEventListener("submit", submitAuth);
  captcha.mount($("#au-ts"));
  const first = card.querySelector("input"); if(first) first.focus({preventScroll:true});
}
async function submitAuth(e){
  e.preventDefault();
  const v = id => { const el = document.getElementById(id); return el ? el.value.trim() : ""; };
  const err = $("#au-err"), go = $("#au-go"), step = AUTH.step;
  const fail = m => { err.textContent = m; };
  const okEmail = s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  const pw = (document.getElementById("au-pw") || {}).value || "";
  if(step === "in" && (!v("au-id") || !pw)) return fail("Scrivi email (o username) e password.");
  if(step === "up"){
    if(!/^[a-z0-9_.-]{3,24}$/.test(v("au-name").toLowerCase())) return fail("Lo username va da 3 a 24 caratteri: lettere, numeri, punto, trattino o trattino basso.");
    if(!okEmail(v("au-email"))) return fail("Scrivi un indirizzo email valido.");
  }
  if((step === "up" || step === "reset") && weakPw(pw)) return fail("La password deve avere almeno 8 caratteri, con lettere e numeri.");
  if((step === "up" || step === "reset") && pw !== $("#au-pw2").value) return fail("Le due password non coincidono.");
  if((step === "code" || step === "reset" || step === "mfa") && !/^\d{6}$/.test(v("au-code"))) return fail("Il codice è fatto di 6 cifre.");
  if(step === "forgot" && !okEmail(v("au-email"))) return fail("Scrivi l'email del tuo account.");
  go.disabled = true; err.textContent = "";
  try{
    if(step === "in"){
      await cloud.signIn(v("au-id").toLowerCase(), pw);
    }
    if(step === "up"){
      AUTH.email = v("au-email").toLowerCase();
      const pending = await cloud.signUp(v("au-name").toLowerCase(), AUTH.email, pw, $("#au-mkt").checked);
      if(pending) return paintAuth("code");
    }
    if(step === "code") await cloud.verifySignup(AUTH.email, v("au-code"));
    if(step === "forgot"){ AUTH.email = v("au-email").toLowerCase(); await cloud.sendReset(AUTH.email); return paintAuth("reset"); }
    if(step === "reset" && await cloud.resetWithCode(AUTH.email, v("au-code"), pw) === "mfa"){ AUTH.newPw = pw; return paintAuth("mfa"); }
    if(step === "mfa"){ await cloud.verifyMfa(v("au-code"), AUTH.newPw); AUTH.newPw = ""; }
  }catch(m){ fail(typeof m === "string" ? (/email not confirmed/i.test(m) ? "Conferma prima la tua email." : m) : "Connessione non riuscita: controlla la rete e riprova."); }
  if(document.body.contains(go)) go.disabled = false;
}

/* ---------- pagina account ---------- */
async function showAccount(){
  view = "account";
  ["#view-home", "#view-quiz", "#view-studia", "#view-auth"].forEach(s => $(s).hidden = true);
  $("#bar").hidden = false; $("#barTitle").textContent = "Il tuo account"; $("#barCfg").innerHTML = "";
  $("#view-account").hidden = false;
  heroAnim.stop(); window.scrollTo({top:0});
  const sb = cloud.sb, u = cloud.user, legacy = isLegacy(u.email);
  const [{data: prof}, {data: fac}] = await Promise.all([
    sb.from("profiles").select("username, marketing").eq("id", u.id).maybeSingle(),
    sb.auth.mfa.listFactors()
  ]);
  const totp = ((fac && fac.totp) || []).find(f => f.status === "verified");
  const box = $("#accountBox");
  box.innerHTML = `
    <section class="panel acard"><div class="eyebrow">Profilo</div>
      <p><span class="hint">Username</span><br><b class="u-name"></b></p>
      <p><span class="hint">Email</span><br><b class="u-mail"></b></p>
      <form id="f-mail" class="row" novalidate><input id="ac-mail" type="email" autocomplete="email" autocapitalize="none" placeholder="${legacy ? "La tua email" : "Nuova email"}" aria-label="Email"><button class="btn" type="submit">${legacy ? "Aggiungi email" : "Cambia email"}</button></form>
      <form id="f-mailcode" class="row" novalidate hidden><input id="ac-mailcode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="Codice a 6 cifre" aria-label="Codice"><button class="btn" type="submit">Conferma</button></form>
      <p class="au-err" id="m-mail" role="status"></p>
    </section>
    <section class="panel acard"><div class="eyebrow">Newsletter</div>
      <label class="check"><input type="checkbox" id="ac-mkt" ${prof && prof.marketing ? "checked" : ""} ${legacy ? "disabled" : ""}> <span>Voglio ricevere via email novità e consigli dal Dojo.</span></label>
      <p class="hint">${legacy ? "Aggiungi prima la tua email." : "Puoi cambiare idea quando vuoi, anche dal link in fondo a ogni email."}</p>
      <p class="au-err" id="m-mkt" role="status"></p>
    </section>
    <section class="panel acard"><div class="eyebrow">Verifica in due passaggi</div>
      <p>${totp ? "<b>Attiva.</b> Ogni volta che entri, oltre alla password ti chiediamo il codice dell'app di autenticazione." : "Oltre alla password, all'accesso ti chiediamo un codice da un'app come Google Authenticator, Microsoft Authenticator o 1Password."}</p>
      <div id="mfaBox"><button class="btn ${totp ? "ghost" : ""}" type="button" id="ac-mfa">${totp ? "Disattiva" : "Attiva"}</button></div>
      <p class="au-err" id="m-mfa" role="status"></p>
    </section>
    <section class="panel acard"><div class="eyebrow">Password</div>
      <form id="f-pw" class="stack" novalidate>
        <input id="ac-pw" type="password" autocomplete="new-password" placeholder="Nuova password" aria-label="Nuova password">
        <input id="ac-pw2" type="password" autocomplete="new-password" placeholder="Ripeti la nuova password" aria-label="Ripeti la nuova password">
        <button class="btn" type="submit">Cambia password</button>
      </form>
      <p class="au-err" id="m-pw" role="status"></p>
    </section>
    <div class="actions"><button class="btn ghost" type="button" id="ac-out">Esci dall'account</button></div>`;
  box.querySelector(".u-name").textContent = (prof && prof.username) || (u.user_metadata && u.user_metadata.username) || "";
  box.querySelector(".u-mail").textContent = legacy ? "Nessuna: aggiungila per recuperare la password e ricevere le email" : u.email;
  const say = (id, m, ok) => { const el = $(id); el.textContent = m; el.className = ok ? "au-ok" : "au-err"; };
  let newMail = "";
  $("#f-mail").onsubmit = async e => {
    e.preventDefault(); newMail = $("#ac-mail").value.trim().toLowerCase();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newMail)) return say("#m-mail", "Scrivi un indirizzo email valido.");
    const {error} = await sb.auth.updateUser({email: newMail});
    if(error) return say("#m-mail", cloud.errText(error));
    $("#f-mailcode").hidden = false; say("#m-mail", `Ti abbiamo mandato un codice a ${newMail}.`, true);
  };
  $("#f-mailcode").onsubmit = async e => {
    e.preventDefault();
    const {error} = await sb.auth.verifyOtp({email: newMail, token: $("#ac-mailcode").value.trim(), type: "email_change"});
    if(error) return say("#m-mail", cloud.errText(error));
    await sb.auth.refreshSession(); showAccount();
  };
  $("#ac-mkt").onchange = async e => {
    const on = e.target.checked;
    const {error} = await sb.from("profiles").update({marketing: on, marketing_at: new Date().toISOString()}).eq("id", u.id);
    if(error){ e.target.checked = !on; return say("#m-mkt", "Non riuscito: " + error.message); }
    say("#m-mkt", on ? "Iscritto alla newsletter." : "Non riceverai più la newsletter.", true);
  };
  $("#ac-mfa").onclick = async () => {
    if(totp){
      const {error} = await sb.auth.mfa.unenroll({factorId: totp.id});
      if(error) return say("#m-mfa", cloud.errText(error));
      await sb.auth.refreshSession(); return showAccount();
    }
    // toglie eventuali attivazioni lasciate a metà, poi ne crea una nuova
    for(const f of ((fac && fac.all) || []).filter(f => f.status !== "verified")) await sb.auth.mfa.unenroll({factorId: f.id});
    const {data, error} = await sb.auth.mfa.enroll({factorType: "totp", issuer: "Dojo delle candele", friendlyName: "Dojo " + Date.now()});
    if(error) return say("#m-mfa", cloud.errText(error));
    $("#mfaBox").innerHTML = `<ol class="mfasteps"><li>Inquadra il codice QR con l'app di autenticazione.</li><li>Se non puoi inquadrarlo, inserisci a mano la chiave <code class="secret"></code></li><li>Scrivi qui il codice a 6 cifre che compare nell'app.</li></ol>
      <img class="qr" alt="Codice QR per l'app di autenticazione"><form id="f-mfa" class="row" novalidate><input id="ac-mfacode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="123456" aria-label="Codice dell'app"><button class="btn" type="submit">Attiva</button></form>`;
    $("#mfaBox .qr").src = data.totp.qr_code; $("#mfaBox .secret").textContent = data.totp.secret;
    $("#f-mfa").onsubmit = async e => {
      e.preventDefault();
      const r = await sb.auth.mfa.challengeAndVerify({factorId: data.id, code: $("#ac-mfacode").value.trim()});
      if(r.error) return say("#m-mfa", "Codice sbagliato: controlla l'orario del dispositivo e riprova.");
      showAccount();
    };
  };
  $("#f-pw").onsubmit = async e => {
    e.preventDefault();
    const a = $("#ac-pw").value, b = $("#ac-pw2").value;
    if(weakPw(a)) return say("#m-pw", "La password deve avere almeno 8 caratteri, con lettere e numeri.");
    if(a !== b) return say("#m-pw", "Le due password non coincidono.");
    const {error} = await sb.auth.updateUser({password: a});
    if(error) return say("#m-pw", cloud.errText(error));
    $("#f-pw").reset(); say("#m-pw", "Password cambiata.", true);
  };
  $("#ac-out").onclick = () => cloud.logout();
}

/* ---------- boot ---------- */
function start(data){
  bindSeg("#famSeg", "fam", () => {});
  bindSeg("#ansSeg", "ans", () => {});
  bindSeg("#studySeg", "sfilter", renderStudy);
  $("#hlToggle").checked = prefs.hl;
  $("#hlToggle").onchange = e => { prefs.hl = e.target.checked; savePrefs(); };
  selectMode(["srs","studia","f2n","n2f","scen"].includes(prefs.mode) ? prefs.mode : "srs");
  renderIllustrations();
  if(data && data.view && data.view !== "home") setTab(data.view); else goHome();
}
start({});
cloud.init();

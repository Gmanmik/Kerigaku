/* Suoni del Dojo: tre suoni brevi creati dal browser (Web Audio), nessun file audio e nessuna licenza.
   Spenti all'inizio. Il tasto "Suoni" accanto a Giorno/Notte li accende, la scelta resta salvata sul dispositivo.
   Uso: DojoSuoni.play("giusto" | "sbagliato" | "livello"). Se i suoni sono spenti non fa nulla. */
(function(){
  const KEY = "dojo-suoni";
  let on = false, ctx = null, master = null;
  try{ on = localStorage.getItem(KEY) === "1"; }catch(e){}

  function audio(){
    if(!ctx){
      const AC = window.AudioContext || window.webkitAudioContext; if(!AC) return null;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = .55;
      const comp = ctx.createDynamicsCompressor();   // evita picchi fastidiosi quando i suoni si sovrappongono
      master.connect(comp); comp.connect(ctx.destination);
    }
    if(ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  // un parziale: oscillatore con attacco rapido e coda esponenziale
  function tone(t, freq, peak, decay, type, dest, bend){
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(freq, t);
    if(bend) o.frequency.exponentialRampToValueAtTime(freq * bend, t + decay);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + .004);
    g.gain.exponentialRampToValueAtTime(.0001, t + decay);
    o.connect(g); g.connect(dest || master); o.start(t); o.stop(t + decay + .05);
  }
  // un colpo di rumore filtrato: l'attacco "secco" del legno
  function click(t, freq, q, peak, len){
    const n = Math.floor(ctx.sampleRate * len), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for(let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 4);
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = buf; f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q; g.gain.value = peak;
    s.connect(f); f.connect(g); g.connect(master); s.start(t);
  }

  const SOUNDS = {
    // risposta giusta: un colpo di legno secco, come le tavolette hyoshigi
    giusto(t){
      click(t, 2400, 3, 1.4, .03);
      tone(t, 1250, .9, .09, "sine");
      tone(t, 2960, .3, .05, "sine");
      tone(t, 640, .36, .07, "triangle");
    },
    // risposta sbagliata: una nota bassa e smorzata, che scende appena
    sbagliato(t){
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 700; lp.connect(master);
      tone(t, 174, .8, .38, "triangle", lp, .88);
      tone(t, 87, .5, .32, "sine", lp, .9);
      click(t, 300, 1.5, .25, .04);
    },
    // livello nuovo: monetine che tintinnano, tre tocchi metallici che salgono
    livello(t){
      [[0, 1568], [.08, 2093], [.17, 2637]].forEach(([dt, f], i) => {
        const a = .22 + i * .04;
        tone(t + dt, f, a, .5 + i * .15, "sine");
        tone(t + dt, f * 2.76, a * .35, .22, "sine");
        tone(t + dt, f * 4.1, a * .15, .12, "sine");
      });
    }
  };

  function play(name, force){
    if(!(on || force) || !SOUNDS[name]) return;
    try{ const c = audio(); if(c) SOUNDS[name](c.currentTime + .02); }catch(e){}
  }

  function paint(){
    document.querySelectorAll("[data-suoni]").forEach(b => {
      b.setAttribute("aria-pressed", on);
      b.title = on ? "Suoni accesi: tocca per spegnerli" : "Suoni spenti: tocca per accenderli";
    });
  }
  function setOn(v){
    on = !!v;
    try{ on ? localStorage.setItem(KEY, "1") : localStorage.removeItem(KEY); }catch(e){}
    paint();
    if(on) play("giusto");   // assaggio: così si sente subito il volume
  }

  // il tasto: se nella pagina c'è un bottone con data-suoni lo usa, altrimenti lo crea accanto a Giorno/Notte
  function mount(){
    let btns = document.querySelectorAll("[data-suoni]");
    if(!btns.length){
      const seg = document.getElementById("themeSeg"); if(!seg) return;
      const box = document.createElement("div");
      box.className = "seg suoni"; box.setAttribute("role", "group"); box.setAttribute("aria-label", "Suoni");
      box.innerHTML = '<button type="button" data-suoni aria-pressed="false">Suoni</button>';
      seg.insertAdjacentElement("afterend", box);
      btns = box.querySelectorAll("[data-suoni]");
    }
    btns.forEach(b => b.addEventListener("click", () => setOn(!on)));
    paint();
  }

  window.DojoSuoni = {play, set: setOn, get on(){ return on; }};
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();

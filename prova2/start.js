const frasi = ['Una candela dice poco. Tre dicono molto.', 'Il corpo è la decisione, l’ombra è il dubbio.', 'Chi aspetta la conferma, di solito la trova.', 'Studia la formazione, poi ascolta il mercato.'];
document.getElementById('frase').textContent = frasi[Math.floor(Math.random() * frasi.length)];
const fill = document.getElementById('fill'), pct = document.getElementById('pct'), load = document.getElementById('load');
const go = new Go();
async function carica() {
  const r = await fetch('game.wasm');
  // il server può comprimere: Content-Length riguarda i byte compressi, quindi usiamo il valore noto come riserva
  const tot = +r.headers.get('Content-Length') || 15080730;
  const rd = r.body.getReader(), parti = []; let n = 0;
  for (;;) { const {done, value} = await rd.read(); if (done) break; parti.push(value); n += value.length;
    const p = Math.min(99, Math.round(n / tot * 100)); fill.style.width = p + '%'; pct.textContent = p + '%'; }
  const buf = new Uint8Array(n); let o = 0; for (const p of parti) { buf.set(p, o); o += p.length; }
  const {instance} = await WebAssembly.instantiate(buf, go.importObject);
  fill.style.width = '100%'; pct.textContent = '100%';
  setTimeout(() => { load.classList.add('fuori'); setTimeout(() => load.remove(), 600); }, 400);
  go.run(instance);
}
carica();

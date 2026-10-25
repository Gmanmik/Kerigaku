# Dojo delle candele, web app

Allenamento sulle 66 figure candlestick giapponesi, con account (username e password) e progressi salvati su Supabase.

## File

- Pagine: `index.html` (l'app), `admin.html` (pannello admin), `about.html`, `privacy.html`.
- Codice (niente script dentro le pagine, per la CSP): `app.js` e `scenari.js` (app), `admin.js` (pannello), `theme-init.js` e `theme.js` (tema giorno/notte), `cookie.js` (avviso cookie), `supabase.js` (libreria, copia locale).
- `config.js`: indirizzo e chiave pubblica di Supabase, chiave pubblica di Turnstile.
- `_headers`: regole di sicurezza (CSP e altre intestazioni) che Cloudflare aggiunge a ogni pagina. `.assetsignore`: file che restano nel repository ma non vengono pubblicati (SQL, md, email, funzioni).
- `robots.txt` e `X-Robots-Tag` in `_headers`: il sito non viene indicizzato finché Michele non decide di aprirlo.
- File SQL da eseguire in Supabase, in quest'ordine: `schema.sql`, `admin.sql`, `account.sql`, `login.sql`, `security.sql`, `fix-2fa.sql`, `admin2.sql`, `sicurezza-2.sql`, `password.sql`. `archivio/pagamenti-annullato/` contiene la vecchia bozza dei pagamenti: il Pro a pagamento è annullato, non eseguirla.
- `funzioni/statistiche/index.ts`: funzione Supabase per le statistiche delle visite (vedi in fondo).
- `email/`: modelli delle email di Supabase.

## Come funziona il login

- Ci si registra con username (3-24 caratteri: lettere, numeri, `.` `-` `_`), email vera e password (almeno 8 caratteri, con lettere e numeri). Si entra con username o email.
- I vecchi account creati prima delle email hanno un indirizzo interno `username@utenti.dojo-delle-candele.app`.
- "Password dimenticata" manda un codice via email (Brevo). La verifica in due passaggi è facoltativa per gli allievi e obbligatoria per gli admin.
- Non si può riusare una delle ultime password (`password.sql`).
- Si può anche usare il Dojo senza account: i progressi restano solo su quel dispositivo e vengono portati nell'account al primo accesso.

## Configurazione di Supabase (una volta sola)

1. Crea un progetto gratuito su https://supabase.com.
2. Apri **SQL Editor**, incolla il contenuto di `schema.sql` ed esegui.
3. Apri **Authentication → Sign In / Providers → Email** e disattiva **Confirm email** (gli indirizzi sono interni, la conferma non arriverebbe mai).
4. Apri **Project Settings → API** e copia **Project URL** e la chiave **anon public** dentro `config.js`.

La chiave anon è pensata per stare nel browser: i dati sono protetti dalle regole di `schema.sql`. Non mettere mai la chiave `service_role` in questi file.

## Pubblicazione

Il sito è un Worker di Cloudflare con file statici (`wrangler.jsonc`), collegato al repository GitHub Gmanmik/Dojo-delle-candere: ogni modifica sul ramo `main` va online da sola in un minuto, su https://dojodellecandele.com e https://www.dojodellecandele.com.

Ordine di lavoro: si prova in anteprima, il Tester controlla, Michele dà l'ok; poi i file si copiano prima nella cartella `backup\` del PC di Michele, si controlla che siano identici e solo dopo si mandano su GitHub.

Per provarlo in locale basta un server statico nella cartella, per esempio `python3 -m http.server`, poi apri http://localhost:8000.

## Pannello admin (`admin.html`)

Mostra tutti gli allievi con i loro progressi e permette di cambiare la password, azzerare i progressi, dare o togliere il ruolo di admin ed eliminare un account.

1. Nel SQL Editor di Supabase esegui `admin.sql`. L'ultima riga rende admin l'account `gmanmik`.
2. Apri https://www.dojodellecandele.com/admin.html ed entra con il tuo account e la verifica in due passaggi.

Le azioni passano da funzioni del database che controllano ogni volta che chi le chiama sia admin. Nel browser c'è solo la chiave pubblica, mai la `service_role`.

## Email, verifica in due passaggi e newsletter

Da questa versione ci si registra con username, email e password. L'email riceve un codice a 6 cifre che attiva l'account; lo stesso tipo di codice serve per "Password dimenticata" e per cambiare email. Dalla pagina **Account** ognuno può aggiungere o cambiare l'email, iscriversi o disiscriversi dalla newsletter, attivare la verifica in due passaggi con un'app di autenticazione (Google Authenticator, Microsoft Authenticator, 1Password) e cambiare la password. Gli account creati prima entrano ancora con lo username e possono aggiungere l'email da Account.

### Ordine dei passaggi

1. **SQL**: nel SQL Editor esegui `account.sql` (dopo `schema.sql` e `admin.sql`), poi `login.sql`, che permette di entrare sia con lo username sia con l'email. Poi `security.sql` (e `fix-2fa.sql` se avevi già eseguito una versione precedente): il pannello admin richiede la verifica in due passaggi. In *Sign In / Providers → Email* imposta **Minimum password length** = 8 e **Password requirements** = lettere e numeri. Infine `admin2.sql`: nel pannello compaiono "Togli 2FA", "Sospendi account" e "Sblocca accesso". Poi `sicurezza-2.sql`: controlla gli username, limita la dimensione dei progressi e riduce i permessi al minimo. Per ultimo `password.sql`: impedisce di rimettere una delle ultime 5 password usate.
2. **GitHub**: carica `index.html`, `admin.html` e `about.html`. La cartella `email` non va sul sito.
3. **Dominio**: compra un dominio (per esempio su Cloudflare Registrar, Aruba o Namecheap).
4. **Brevo** (brevo.com, piano gratuito):
   - *Senders, Domains & Dedicated IPs → Domains → Add a domain*: aggiungi il dominio e copia nei DNS del registrar i record che Brevo mostra (codice Brevo, DKIM, DMARC). Aspetta che risulti verificato.
   - *Senders*: crea il mittente `noreply@tuodominio` con nome "Dojo delle candele".
   - *SMTP & API → SMTP*: annota il **login SMTP** e genera una **chiave SMTP**.
   - Non attivare il blocco degli IP non autorizzati: Supabase invia da IP che cambiano e le email verrebbero bloccate.
   - La chiave SMTP scade alla data scelta **e dopo 90 giorni senza invii**. Se le email smettono di arrivare, genera una nuova chiave e aggiornala in Supabase (SMTP Settings → Password).
5. **Supabase → Authentication**:
   - *Emails → SMTP Settings*: attiva "Custom SMTP". Host `smtp-relay.brevo.com`, porta `587`, username = login SMTP di Brevo, password = chiave SMTP, mittente `noreply@tuodominio`, nome "Dojo delle candele".
   - *Emails → Templates*: incolla i modelli della cartella `email`:
     - Confirm signup → `conferma-account.html`, oggetto "Il tuo codice per il Dojo delle candele"
     - Reset password → `reset-password.html`, oggetto "Scegli una nuova password del Dojo"
     - Change email address → `cambio-email.html`, oggetto "Conferma la nuova email del Dojo"
   - *Sign In / Providers → Email*: **Confirm email** acceso, **Secure email change** spento (gli account vecchi hanno un indirizzo interno che non riceve posta), **Email OTP length** = 6.
   - *URL Configuration*: Site URL = l'indirizzo del sito.
   - *Rate Limits*: con l'SMTP di Brevo puoi alzare le email all'ora (per esempio 100).
   - *Multi-Factor*: controlla che **TOTP** sia attivo (lo è di serie).

Finché l'SMTP di Brevo non è configurato, Supabase manda le email solo agli indirizzi dei membri del tuo progetto Supabase e poche all'ora: va bene per provare con la tua email, non per gli utenti.

### Newsletter

1. Nel pannello admin premi **Copia iscritti newsletter**: copia l'elenco (formato `EMAIL;USERNAME`) di chi ha dato il consenso.
2. In Brevo: *Contacts → Import contacts → Copy/paste*, incolla l'elenco e mettilo in una lista "Dojo newsletter".
3. *Campaigns → Create an email campaign*, scegli "Code your own" e incolla `email/newsletter.html` cambiando testo e titolo. Il link `{{ unsubscribe }}` lo gestisce Brevo.
4. Per le campagne usa un mittente dedicato, per esempio `marketing@dojodellecandele.com` (Brevo → Mittenti → Aggiungi mittente: il dominio è già autenticato). Per ricevere le risposte attiva in Cloudflare *Email → Email Routing* e inoltra quell'indirizzo alla tua casella.

Manda la newsletter solo a quella lista: per legge (GDPR) servono il consenso e il link per disiscriversi, che ci sono entrambi.

## CAPTCHA anti-robot (Cloudflare Turnstile)

Protegge registrazione, accesso, reinvio codice e reset password dai bot. L'ordine conta: se attivi il CAPTCHA su Supabase prima di aver pubblicato il sito con la chiave, nessuno riesce più a entrare.

1. Cloudflare → **Turnstile → Add widget**: nome "Dojo", modalità *Managed*, hostname `dojodellecandele.com` e `www.dojodellecandele.com`. Ottieni una **Site Key** (pubblica) e una **Secret Key** (segreta).
2. In `config.js` aggiungi la riga `turnstileSiteKey: "<Site Key>"` e carica il file su GitHub. Controlla che il sito funzioni ancora.
3. Supabase → **Authentication → Attack Protection → Enable Captcha protection**, provider *Cloudflare Turnstile*, incolla la **Secret Key** e salva. La Secret Key va solo lì.

## File di sicurezza per Cloudflare

- `_headers`: Cloudflare lo legge e aggiunge a ogni pagina le intestazioni di sicurezza (il browser carica codice solo dal sito, dal CAPTCHA di Cloudflare e da Supabase; il sito non può essere incorniciato in altri siti; solo HTTPS).
- `.assetsignore`: elenca i file che restano su GitHub ma non vengono pubblicati sul sito (file SQL, guide, modelli email, zip, cartella `redesign`, `archivio`).
- Se un giorno aggiungi un servizio esterno (statistiche, video, immagini da un altro sito), va aggiunto anche nella riga `Content-Security-Policy` di `_headers`, altrimenti il browser lo blocca.
- `archivio/` contiene i font del vecchio aspetto grafico, non più usati.

## Statistiche delle visite nella pagina admin (funzione "statistiche")

Il sito usa Cloudflare Web Analytics (senza cookie). La pagina admin mostra i numeri tramite la funzione Supabase `funzioni/statistiche/index.ts`, che chiede i dati a Cloudflare con un token che resta nei segreti di Supabase: il browser non lo vede mai e la funzione risponde solo a un admin con verifica in due passaggi.

1. **Cloudflare, ID account**: nella home del pannello Cloudflare, a destra, "Account ID". Copialo.
2. **Cloudflare, site tag**: Analytics & Logs → Web Analytics → apri dojodellecandele.com. Il site tag è il codice lungo nell'indirizzo della pagina (dopo `/web-analytics/overview?siteTag~in=`) oppure in "Manage site".
3. **Cloudflare, token**: icona profilo → My Profile → API Tokens → Create Token → Create Custom Token. Nome "Dojo statistiche", permesso **Account → Account Analytics → Read**, risorse: il tuo account. Crea e copia il token (si vede una volta sola). Non mandarlo a nessuno, nemmeno in chat.
4. **Supabase, funzione**: Edge Functions → Deploy a new function → Via Editor. Nome `statistiche`, incolla tutto il contenuto di `funzioni/statistiche/index.ts`, Deploy. Lascia attivo "Verify JWT".
5. **Supabase, segreti**: Edge Functions → Secrets → aggiungi `CF_API_TOKEN` (il token), `CF_ACCOUNT_ID` e `CF_SITE_TAG`.
6. Apri la pagina admin: sotto i riquadri degli allievi compare "Visite al sito".

## Registro delle versioni

- 24/10/2026 22:29, `7e59be5`: statistiche Cloudflare Web Analytics (CSP, Privacy, avviso cookie), sezione "Visite al sito" in admin, frase meme leggibile nel tema scuro, l'avviso cookie non copre più i pulsanti.
- 24/10/2026 17:13, `40ca2bc`: tasto "Sostieni il Dojo" (PayPal) e righe in Privacy.
- 24/10/2026 17:05, `240602a`: 4 livelli, frase meme animata, impaginazione 16:9, blocco delle password già usate, sito non indicizzato.
- 24/10/2026, `3a69144`: modalità Scenari, tolto il menu a tendina in Figura → Nome.
- 24/10/2026 mattina: login con username/email, 2FA, pannello admin, Privacy, Turnstile, dominio dojodellecandele.com su Cloudflare, revisione di sicurezza (CSP, niente script nelle pagine).

## Novità del 25/10/2026 (v22)
- **Livelli**: i quattro livelli sono l'unica progressione (le cinture sono state tolte). Aprono 20 / 44 / 66 figure; La Prova del Dojo si apre al livello 2. File nuovi: `figure.js` (le 66 figure), `prova-dojo.js/.css`, `icone-livelli.css` + `livello-*.svg`, `tasti-hover.css`.
- **Landing**: pagina d'ingresso per chi non è iscritto (`landing.css/js`, vista `#landing` in index.html, `logo.svg`, foto `storia-borsa-riso.jpg`).
- **Suoni**: `suoni.js` (spenti di default).
- **Brevo**: funzioni Supabase `funzioni/newsletter` e `funzioni/brevo-disiscrizioni` (Verify JWT disattivato solo per la seconda). Segreti: `BREVO_API_KEY` (chiave API, non SMTP), `BREVO_LIST_ID`, `BREVO_WEBHOOK_TOKEN`. Webhook Brevo (evento unsubscribe) verso `.../functions/v1/brevo-disiscrizioni?token=...`. Poi premere "Allinea newsletter con Brevo" nell'admin. Le newsletter sono in `/newsletter/`.
- **Admin**: bandierine dei paesi (font Twemoji), statistiche Brevo, impara/dimentica una figura, "Blocca IP" con elenco IP bloccati.
- **SQL (solo in locale, mai su GitHub)**: `figure-forzate.sql` e `ip-bloccati.sql`. Per il blocco IP: Supabase → Authentication → Hooks → "Before User Created" → `public.hook_before_user_created`.

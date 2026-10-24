# Dojo delle candele, web app

Allenamento sulle 66 figure candlestick giapponesi, con account (username e password) e progressi salvati su Supabase.

## File

- `index.html`: tutta l'app (pagina, stile e codice).
- `config.js`: indirizzo e chiave pubblica del progetto Supabase. È l'unico file da modificare.
- `schema.sql`: la tabella dei progressi e le regole che fanno vedere a ciascuno solo i propri dati.

## Come funziona il login

- Ci si registra con username (3-24 caratteri: lettere, numeri, `.` `-` `_`) e password (almeno 6 caratteri).
- Supabase richiede un'email, quindi l'app usa `username@utenti.dojo-delle-candele.app` come email interna. Nessuna email viene mai inviata.
- Per questo non esiste "password dimenticata": se serve, la password si reimposta a mano dal pannello Supabase (Authentication → Users).
- Si può anche usare il Dojo senza account: i progressi restano solo su quel dispositivo e vengono portati nell'account al primo accesso.

## Configurazione di Supabase (una volta sola)

1. Crea un progetto gratuito su https://supabase.com.
2. Apri **SQL Editor**, incolla il contenuto di `schema.sql` ed esegui.
3. Apri **Authentication → Sign In / Providers → Email** e disattiva **Confirm email** (gli indirizzi sono interni, la conferma non arriverebbe mai).
4. Apri **Project Settings → API** e copia **Project URL** e la chiave **anon public** dentro `config.js`.

La chiave anon è pensata per stare nel browser: i dati sono protetti dalle regole di `schema.sql`. Non mettere mai la chiave `service_role` in questi file.

## Pubblicazione con GitHub Pages

1. Carica i file in un repository GitHub.
2. Apri **Settings → Pages**, scegli **Deploy from a branch**, ramo `main`, cartella `/ (root)`.
3. Dopo un minuto il sito è su `https://<tuo-utente>.github.io/<nome-repo>/`.

Per provarlo in locale basta un server statico nella cartella, per esempio `python3 -m http.server`, poi apri http://localhost:8000.

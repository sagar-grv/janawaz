# JanAwaz (prototype demo)

Voice-first civic complaint assistant for small-town and rural India, built for
the Scaler x Wispr Flow "Build for Bharat" hackathon, Round 2.

**This is a clearly labeled prototype demo. It is not a real government
service, and the DEMO- reference numbers it issues are not real municipal
references.**

## What it does

A user speaks (or types, as a fallback) in Hindi, Marathi or English:

1. The app greets the user and asks them to describe the problem.
2. It detects the complaint category: water supply, street lights or
   sanitation. Anything else is declined plainly as out of scope, with a
   suggestion to contact the relevant office directly.
3. It asks short follow-ups only for missing details: exact location, and how
   long the problem has persisted.
4. It reads the full complaint back aloud. Only after the user confirms
   ("haan, bhej do" or the green button) is it filed to the demo backend,
   which returns a `DEMO-2026-NNNN` reference shown next to a visible
   "prototype demo" label.
5. Later, the user can ask "meri shikayat ka kya hua?" and the app reads the
   current demo status aloud.

## Fictional demo data only

This demo collects no names, phone numbers or account details, and the UI asks
in all three languages for fictional complaints only. Status is looked up by
exact reference number, and there is no endpoint that lists complaints. Note
the free-text fields (problem description, location) can still contain
whatever a tester types, so the hosted demo asks users not to enter real
personal details rather than claiming all stored text is fictional.

Honest-limits behavior: browsers without speech recognition get the typed
form in the same language; failed recognition retries twice, then switches to
typing; mixed Hindi-Marathi-English utterances are accepted; offline drafts
are saved on the device and clearly marked as not filed.

## Run it

```bash
docker compose up --build
```

(A docker-compose file ships for one-command boot; container execution itself
has not been verified yet. The plain Python path below is the verified one.)

Then open http://localhost:8000. Chrome or Edge recommended for Hindi/Marathi
speech recognition (Web Speech API). No API keys, accounts or environment
variables are needed. The demo database seeds itself with three fictional
sample complaints on first start.

Without Docker, any Python 3.9+ works:

```bash
python server/app.py
```

### Mic self-test

Open http://localhost:8000/test-mic.html and press the button. It checks only
whether your browser can recognize Hindi speech (30 seconds, nothing is
saved). Recognition depends on the browser, its speech service and mic
permission: Chrome 157 on a Linux build refused it with a permission/service
error in our tests, while browsers on Android phones and on desktop
Windows/Mac generally ship a speech service. If this page reports an error,
the main app uses its typed fallback by design.

## Stack

- Frontend: vanilla HTML/CSS/JS, Web Speech API (recognition + synthesis)
- Backend: Python standard library HTTP server + SQLite
  (`server/app.py`, one `complaints` table)
- No paid APIs, no external services, no build step

## Layout

```
server/app.py        demo backend + static file server
static/index.html    single-screen UI
static/test-mic.html standalone Hindi speech-recognition self-test
static/app.js        voice state machine, i18n (hi/mr/en), offline queue
static/style.css     mobile-first, large text, high contrast
docker-compose.yml   one service, one port
```

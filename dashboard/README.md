# OpenOutreach dashboard

A password-gated web UI over the one row `openoutreach init` also fills in —
`openoutreach.config.SiteConfig`. It is a second way to answer the same
questions the CLI wizard asks, not a second product: no find/send controls, no
data views, no daemon. See `../CLAUDE.md` for why this exists and what it is
not allowed to grow into.

## Running it

**With Docker Compose (recommended)** — see `../local.yml` / `../coolify.yml`.
The `dashboard` service shares the same `app-data` volume as the `app`
service, so there is nothing else to host: one SQLite file, one volume, no
separate database.

```bash
DASHBOARD_PASSWORD=change-me docker compose -f local.yml up dashboard
```

**Locally, against a checkout:**

```bash
cd dashboard
npm install
DASHBOARD_PASSWORD=change-me npm run dev
```

This reads `../data/db.sqlite3` — the same file `.venv/bin/python manage.py
migrate` (or `openoutreach init`) creates at the repo root. Run that once
first; the dashboard shows a "not migrated yet" screen with the exact command
if the table isn't there.

## What it is

- One required environment variable: `DASHBOARD_PASSWORD`. Every other field —
  every `OPENOUTFIND_*` / `OUTSEND_*` value — lives in the database and is
  edited on the page itself, exactly as the CLI wizard leaves it.
- The session is a signed cookie (`lib/auth.ts`, Web Crypto, no session
  store) keyed off `DASHBOARD_PASSWORD` — nothing else to configure, nothing
  else to lose if the container restarts.
- Branded with `sincelabs/brand`'s tokens and component library, copied in
  wholesale per that repo's own adoption guide
  (`docs/15-adoption.md`) — `tokens/` and `components/ui/` here are that
  copy. Update them the same way: replace the files, don't hand-edit around
  drift.

## What it is not

- Not a pipeline runner. It never calls `find`, `send`, or `run` — that stays
  the CLI's job, on whatever schedules it (see `../docs/coolify.md`).
- Not a data browser. It has no view into leads, emails, or the CRM.
- Not a second schema owner. `lib/db.ts` reads and writes the exact table
  `openoutreach/config/migrations/0001_initial.py` creates and refuses to
  create it itself — see the comment at the top of that file for why.

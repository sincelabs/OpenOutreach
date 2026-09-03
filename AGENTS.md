# AGENTS.md — working in this repository

OpenOutreach installs [OpenOutFind](https://github.com/eracle/OpenOutFind) and
[OpenOutSend](https://github.com/eracle/OpenOutSend), hosts both children's Django apps in one
registry on one SQLite file, and puts one CLI wizard and one command in front of them —
`openoutreach`. `dashboard/` is the one other thing in this repository: a separate Next.js app
that edits the same wizard's answers from a browser instead of a terminal.

**Full detail and the reasoning behind every rule below lives in `CLAUDE.md`.** This file is the
fast version for any agent working here, Claude or otherwise — read `CLAUDE.md` before a change
that touches more than one file.

## The shape of it

| Directory | Is | Edit when |
|---|---|---|
| `openoutreach/` | The orchestrator: `settings.py` (the registry), `config/` (the one model, `SiteConfig`), `wizard.py` (the CLI onboarding), `__main__.py` (the verbs) | The CLI's own behavior changes |
| `dashboard/` | A separate Next.js app — its own process, its own deploy — that reads and writes `SiteConfig` straight over SQLite. Not a web surface *on* `openoutreach`; see `dashboard/README.md` | The config UI changes, or a `config/models.py` field changes (update `dashboard/lib/config-schema.ts` too) |
| `skills/find-leads/` | The Claude Code plugin this repo ships, restating the CLI's contract | The verbs, export columns, or `ErrorType` vocabulary change |
| `tests/` | Only what neither child can test alone: the registry, the wizard's row/export, the CLI's own dispatch | Any of those three change |
| `docs/` | Deploy and architecture notes (`docker.md`, `coolify.md`, `infrastructure.md`) | A deployment shape changes |
| `compose/`, `local.yml`, `coolify.yml` | The Docker deploys — one image, one Dockerfile, no web surface *in that image* | The image or the compose stack changes |

## Rules that are not negotiable

1. **This repo holds no pipeline.** Discovery, qualification, enrichment, the CRM, the outreach
   agent, the mailbox — all of that belongs in a child repo (OpenOutFind or OpenOutSend), not here.
   The one exception is `openoutreach.config.SiteConfig`, the answers a person gave.
2. **Both children are required, pinned exact dependencies.** `pip install openoutreach` alone is
   the whole find-then-send flow.
3. **Nothing under `openoutreach/` may reimplement a child.** A duplicated fork of the finder lived
   here once; it diverged and was deleted.
4. **The Django orchestrator has no web surface, still.** No URLconf, no Admin, no sessions, no
   templates in `openoutreach/`, and no daemon — `run` is a bounded pass, not a loop. Both were
   tried and reverted, twice.
5. **`dashboard/` is a deliberate, separate exception — config-only.** It has no route for
   `find`/`send`/`run`, no view into leads or mail, and it never creates the table it edits — that
   stays the Django migration's job. Gated by one variable, `DASHBOARD_PASSWORD`; every field it
   edits lives in the database.
6. **Each child keeps running standalone.** `uvx --from openoutfind outfind find 10` with
   `openoutreach` nowhere in the environment is an acceptance criterion.
7. **No `Co-Authored-By` in commits. Single-line messages.** No auto-memory system (no MEMORY.md) —
   persistent context belongs in `CLAUDE.md`.
8. **No API backward compat.** No external users yet — rename, delete, rewrite freely.

## Before you commit

```bash
# Python side
.venv/bin/pytest
make test

# dashboard/ — a separate project, separate checks
cd dashboard && npm run typecheck && npm run build
```

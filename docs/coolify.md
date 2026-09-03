# Coolify — Running OpenOutreach on Coolify

> **This is not the install path.** The supported install is `uvx openoutreach find 10` (or
> `pip install openoutreach`) — see the README quick start. This page is for operators who already
> run their infrastructure on [Coolify](https://coolify.io) and want this bounded job supervised
> there instead of by a systemd timer; read **[docs/docker.md](./docker.md)** first for what the
> image itself does and does not do.

> **The mismatch to plan around**: Coolify's "Application" resource assumes something long-running —
> a health check, a port, a process that keeps going. This image is the opposite: **the container
> runs one job and exits.** `openoutreach find 10 emails` means ten more leads with addresses, then
> stop. Neither shape below fights that; each just decides, in Coolify's own terms, who presses the
> button again — the same decision `docs/docker.md` hands to a systemd timer.

Both shapes deploy the same image built from `compose/openoutreach/Dockerfile` (or the published
`ghcr.io/eracle/openoutreach` tags — see **Available Tags** in `docs/docker.md`), as a **Docker
Compose** resource — not the "Dockerfile" or "Application" resource types, which want a service
that stays up on its own.

## Shape A — idle container + Scheduled Tasks (recommended)

Coolify's per-resource **Scheduled Tasks** run a cron entry as a `docker exec` into an
already-running container. That only works if something is running between firings, so this shape
gives the container a no-op foreground process and lets Scheduled Tasks do the actual work.

1. **New Resource → Docker Compose**, pointing at this repository, and paste:

   ```yaml
   services:
     app:
       build:
         context: .
         dockerfile: ./compose/openoutreach/Dockerfile
       # Or skip the build entirely and pull the published image instead:
       # image: ghcr.io/eracle/openoutreach:latest
       command: ["sleep", "infinity"] # override /start — see the mismatch above
       restart: unless-stopped
       environment:
         - HOST_UID=1000
         - HOST_GID=1000
       volumes:
         - app-data:/app/data
   volumes:
     app-data:
   ```

2. **Environment Variables tab** (not the compose file — Coolify's own panel): set every
   `OPENOUTFIND_*` / `OUTSEND_*` variable your onboarding needs (product/objective, LLM key,
   BetterContact key, operator name and country, mailbox and app password, newsletter/legal — see
   `docs/docker.md`'s onboarding list). A `docker exec` Scheduled Task has no TTY, so a question
   whose variable is still unset does not prompt — the run exits naming it, the same as a headless
   `docker run`.
3. **Deploy once.** The container starts, runs `sleep infinity`, and idles — nothing has been found
   or sent yet.
4. **Resource → Scheduled Tasks → add a cron entry.** For example, hourly:
   - Command: `openoutreach run 10 emails > /app/data/leads.csv`
   - **Overwrite, don't append.** `find`'s CSV is a dump of every lead currently in the store, not
     only this run's — `>>` would duplicate every existing row on each firing.
5. **Persistent storage.** `app-data` above is a Coolify-managed volume, so it survives redeploys;
   swap it for a bind mount to a host path if you want your own backup story. Either way the
   directory must be writable by uid 1000 (the image's `ubuntu` user) — set `HOST_UID` / `HOST_GID`
   to match if you bind-mount a path already owned by a different user, the same convention
   `local.yml` uses.
6. **Looking at what it found**, with no web surface to open: the resource's **Terminal** tab gives
   you a shell in the idle container for `openoutreach status --json`, or pull `/app/data/db.sqlite3`
   off the volume with any SQLite client.

## Shape B — one job per deploy, no idle container

For operators who'd rather not keep a container up 24/7 just to have somewhere for `docker exec` to
land:

- Same Docker Compose resource, but drop the `command: ["sleep", "infinity"]` override — the image's
  default `CMD` (`/start`, i.e. `openoutreach find <goal>`) runs directly — and set `restart: "no"`.
- Trigger a run from **Resource → Webhooks**' deploy hook, called on a schedule by something outside
  Coolify — a GitHub Actions `schedule:` workflow, an external cron service, or your own crontab
  running `curl`. Coolify's Scheduled Tasks won't help here: they exec into a container that, in
  this shape, is not running between deploys.
- Trade-off: every firing is a full deploy (pull/build + start + exit) rather than one idle
  container answering an exec, so it's slower and adds one deployment-log entry per run. Prefer
  Shape A unless an always-on container is the thing you're trying to avoid.

## Neither shape needs a port

There is no web server of its own and no browser to watch — do not add a Coolify port mapping or
health check for this resource; the image publishes none and Coolify has nothing to probe.

---

Coolify's exact menu names (Scheduled Tasks, Webhooks, Terminal) come from its
[Docker Compose](https://coolify.io/docs/knowledge-base/docker/compose) and
[Environment Variables](https://coolify.io/docs/knowledge-base/environment-variables) docs as of
this writing and have moved before — if a step above doesn't match what you see, check
[coolify.io/docs](https://coolify.io/docs) for your version before assuming the compose file is wrong.

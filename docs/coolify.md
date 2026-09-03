# Coolify — Docker Compose Deployment, Step by Step

> **This is not the install path.** The supported install is `uvx openoutreach find 10` (or
> `pip install openoutreach`) — see the README quick start. This page is for running the same
> bounded job under [Coolify](https://coolify.io) instead of a systemd timer; read
> **[docs/docker.md](./docker.md)** first for what the image itself does and does not do.

> **Rule for this deployment: the image is always built from this repository's current commit —
> never a published tag.** Every step below points Coolify at `sincelabs/OpenOutreach` as a git
> source and lets it run `docker build` against `compose/openoutreach/Dockerfile` on that checkout.
> There is no `image: ghcr.io/eracle/openoutreach:...` anywhere in this path, `:latest` or
> otherwise — swapping the `build:` block for one would run the maintainer's published binary
> instead of the code sitting in this repo, which defeats the point. If a step ever tempts you to
> paste an image reference instead of a git source, that's the wrong turn.

> **The mismatch to plan around**: Coolify's default "Application" resource assumes something
> long-running — a health check, a port, a process that keeps going. This image is the opposite:
> **the container runs one job and exits.** The shape below keeps the container merely alive and
> hands the actual job — and its schedule — to Coolify's own **Scheduled Tasks**, which run as a
> `docker exec` into a container that's already up.

This repo carries a dedicated compose file for this, **`coolify.yml`** (root of the repo, next to
`local.yml` — that one is tuned for the maintainer's own VM and restart-loops the finder directly,
which is not what you want here). `coolify.yml` builds the same `compose/openoutreach/Dockerfile`,
overrides the command to idle, and mounts one named volume for `/app/data`.

## 0. Connect this repository to Coolify (one-time)

If `sincelabs/OpenOutreach` is **private**, Coolify needs a GitHub App to read it:

1. Coolify sidebar → **Sources** → **+ Add**.
2. Choose **GitHub App**. Give it a name (e.g. `sincelabs-openoutreach`), set the GitHub
   Organization to `sincelabs` (leave blank only if you're connecting a personal fork), and click
   **Register now** — Coolify redirects you to GitHub to finish creating the app.
3. On GitHub's "Create GitHub App" page, leave the pre-filled permissions as-is (Contents:
   read-only; Pull requests: read & write; subscribed to Push and Pull request events) and click
   **Create GitHub App**.
4. GitHub then prompts you to install the app. Pick the **sincelabs** organization, choose
   **Only select repositories**, check **OpenOutreach**, and click **Install** — you land back on
   Coolify.
5. Coolify sidebar → **Keys & Tokens** → **Private Keys** tab → **+ Add**, and paste the contents
   of the `.pem` file GitHub just downloaded for the app.
6. Back in **Sources**, open the GitHub App entry you created, fill in the App ID / Client ID /
   Client Secret from the app's GitHub settings page, and click **Sync Name** to confirm the
   connection resolves.

If the repository is **public**, skip all of this — step 1 below lets you paste the URL directly.

## 1. Create the resource

1. Open the Coolify **Project** and environment you're deploying into, then click **+ New**.
2. Pick the resource type:
   - Private repo → **Private Repository (with GitHub App)** → select the GitHub App from step 0
     → choose **sincelabs/OpenOutreach** → **Load Repository**.
   - Public repo → **Public Repository** → paste `https://github.com/sincelabs/OpenOutreach`.
3. **Branch**: `main` (or whichever branch you deploy from). Coolify builds whatever commit is at
   the tip of this branch at deploy time — there is no tag to pin and nothing to go stale.
4. **Build Pack**: change the dropdown from the Nixpacks default to **Docker Compose**.
5. Fill in the two path fields Coolify asks for (it combines them itself):
   - **Base Directory**: `/`
   - **Docker Compose Location**: `coolify.yml`
6. Save/continue to create the resource. Nothing has been built yet.

## 2. Environment variables

Open the resource's **Environment Variables** tab — not the compose file — and set every variable
your onboarding needs. There's no TTY behind a Scheduled Task's `docker exec`, so anything left
unset here makes the run exit naming the variable rather than prompting for it.

**Required** (`openoutreach` won't consider itself onboarded without these):

| Variable(s) | What it is |
|:---|:---|
| `OPENOUTFIND_PRODUCT_DOCS` and `OUTSEND_PRODUCT_DOCS` (same value) | What you sell / who it's for |
| `OPENOUTFIND_CAMPAIGN_TARGET` and `OUTSEND_CAMPAIGN_TARGET` (same value) | Who you're going after, and the outcome you want |
| `OPENOUTFIND_AI_MODEL` and `OUTSEND_AI_MODEL` (same value) | `provider:model`, e.g. `anthropic:claude-sonnet-4-5-20250929` |
| `OPENOUTFIND_LLM_API_KEY` and `OUTSEND_LLM_API_KEY` (same value) | API key for that provider |
| `OPENOUTFIND_LLM_API_BASE` and `OUTSEND_LLM_API_BASE` | Only if the model is `openai_compatible:...` (OpenRouter/Together/Ollama/vLLM) |
| `OPENOUTFIND_BETTERCONTACT_API_KEY` | Free BetterContact account — powers discovery and, later, paid address lookups |
| `OUTSEND_OPERATOR_NAME` | Your name, as it signs the mail |
| `OPENOUTFIND_OPERATOR_EMAIL` and `OUTSEND_OPERATOR_EMAIL` (same value) | Your email address |
| `OPENOUTFIND_COUNTRY` | Your own jurisdiction (ISO-3166 alpha-2, e.g. `US`), not a target market |
| `OPENOUTFIND_ACCEPT_LEGAL_NOTICE` | `true` — see `LEGAL_NOTICE.md` before setting this |
| `OUTSEND_MAILBOX_ADDRESS` | The mailbox outreach sends from |
| `OUTSEND_MAILBOX_PASSWORD` | An **app password** for that mailbox, not its login password |

**Optional** — a child falls back to its own default (Google Workspace's SMTP/IMAP, for instance)
when these are unset, so only set them if you need something else:

`OUTSEND_SMTP_HOST`, `OUTSEND_SMTP_PORT`, `OUTSEND_IMAP_HOST`, `OUTSEND_IMAP_PORT`,
`OUTSEND_SIGNATURE`, `OUTSEND_BOOKING_LINK`, `OPENOUTFIND_APOLLO_API_KEY`,
`OPENOUTFIND_EMAIL_FINDER`, `OPENOUTFIND_CONTACTS_API_TOKEN`, `OPENOUTFIND_NEWSLETTER`
(`true`/`false`).

The full field-by-field explanation lives in `openoutreach/config/models.py` (`FINDER_ENV` /
`SENDER_ENV`) if you want the source rather than this table.

## 3. Deploy

Click **Deploy**. Coolify clones `sincelabs/OpenOutreach` at the branch you picked, runs
`docker build` against `compose/openoutreach/Dockerfile` from that checkout, and starts the `app`
service running `sleep infinity` — it just idles, holding the `app-data` volume. Nothing has been
found or sent yet.

## 4. Schedule the actual job

Resource → **Scheduled Tasks** → **+ Add**:

- **Name**: whatever's memorable, e.g. `hourly find+send`
- **Command**: `openoutreach run 10 emails > /app/data/leads.csv`
- **Cron**: e.g. `0 * * * *` for hourly — pick your own goal and cadence.

Save. Every firing is a `docker exec` into the container Coolify already built from this
repository — no new deploy, no image pull, just your code, running.

**Overwrite, don't append.** `find`'s CSV is a dump of every lead currently in the store, not only
this run's — `>>` would duplicate every existing row on each firing.

## 5. Persistent storage

`app-data` in `coolify.yml` is a Coolify-managed named volume, so it survives redeploys — Coolify's
**Storages** tab on the resource lets you browse it or swap it for a bind mount to a host path you
back up yourself. Either way, the directory must be writable by uid 1000 (the image's `ubuntu`
user); `coolify.yml` already sets `HOST_UID`/`HOST_GID` to match.

## 6. Redeploying

Connecting the GitHub App in step 0 also wires up a webhook, so a push to the branch you picked
triggers a rebuild automatically; **Redeploy** in Coolify does the same on demand. Either way,
Coolify rebuilds `compose/openoutreach/Dockerfile` from whatever commit is now at the tip of that
branch — there is no cached `:latest` anywhere to go stale, because nothing here is pulled instead
of built.

## Checking on it

There's no web surface — no URLconf, no Django Admin (see `docs/docker.md`). Two ways in:

- Resource → **Terminal** drops you into a shell in the idling container: run
  `openoutreach status --json`.
- Resource → **Storages** → browse the `app-data` volume and pull `db.sqlite3` with any SQLite
  client — one file holds the finder's leads and the sender's mail log both.

## No port, no health check

Don't add either to this resource. There's nothing listening and nothing to probe.

---

Coolify's exact menu names (Sources, Scheduled Tasks, Storages, Terminal) come from its
[Docker Compose build pack](https://coolify.io/docs/applications/build-packs/docker-compose) and
[GitHub App setup](https://coolify.io/docs/applications/ci-cd/github/setup-app) docs as of this
writing, and Coolify's UI has moved before — if a step here doesn't match what you see, check
[coolify.io/docs](https://coolify.io/docs) for your installed version before assuming `coolify.yml`
is wrong.

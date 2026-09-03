# The config dashboard's image — a small Node runtime, built from Next's
# `output: "standalone"` trace so the final stage carries only what a request
# actually needs, not the whole node_modules tree.

FROM node:22-bookworm-slim AS deps
WORKDIR /app
# better-sqlite3 is a native addon and needs a toolchain to build against
# this image's Node/glibc, even though the runtime stage never sees `make`.
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
# uid 1000 — the same default the Python image's entrypoint chowns /app/data to
# (compose/openoutreach/Dockerfile, HOST_UID). If that image is run with a
# non-default HOST_UID, give this one a matching --build-arg or run as root.
RUN useradd -m -u 1000 dashboard

# `output: "standalone"` already traces the exact node_modules subset this
# needs (better-sqlite3's native binding included) into .next/standalone.
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

ENV NODE_ENV=production
ENV PORT=3000
# Matches the Python image's own default (compose/openoutreach/Dockerfile) —
# both containers read and write the same file over the same mounted volume.
ENV OPENOUTREACH_DB=/app/data/db.sqlite3

USER dashboard
EXPOSE 3000
CMD ["node", "server.js"]

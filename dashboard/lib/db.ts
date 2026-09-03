/**
 * The one row, read and written directly — no second server, no ORM.
 *
 * This connects to the exact SQLite file `openoutreach.settings` already owns
 * (`OPENOUTREACH_DB`, defaulting the same way: `/app/data/db.sqlite3` in the
 * Docker image, `<repo>/data/db.sqlite3` in a checkout) and reads and writes
 * the one table Django's migration creates — `openoutreach_config_siteconfig`,
 * from `openoutreach/config/migrations/0001_initial.py`. **The schema is not
 * duplicated here on purpose**: `config/models.py` and its migration stay the
 * one place that creates this table (see CLAUDE.md); if it doesn't exist yet,
 * `loadConfig`/`saveConfig` throw `SchemaNotReadyError` and the dashboard
 * tells the operator to run the migration, once, rather than racing it or
 * reimplementing its DDL in JavaScript.
 */
import path from "node:path";

import Database from "better-sqlite3";

import { FIELDS } from "./config-schema";

const TABLE = "openoutreach_config_siteconfig";

export const DB_PATH = process.env.OPENOUTREACH_DB
  ? path.resolve(process.env.OPENOUTREACH_DB)
  : path.resolve(process.cwd(), "..", "data", "db.sqlite3");

export class SchemaNotReadyError extends Error {}

let connection: Database.Database | undefined;

function open(): Database.Database {
  if (connection) return connection;
  try {
    connection = new Database(DB_PATH, { fileMustExist: true });
  } catch (cause) {
    // Surfaced for the operator's container logs — SetupNeeded only shows the
    // friendly version, this keeps the real cause (permissions, a stale lock)
    // from being swallowed silently.
    console.error(`[dashboard] could not open ${DB_PATH}:`, cause);
    throw new SchemaNotReadyError(`No database file at ${DB_PATH} yet.`);
  }
  connection.pragma("journal_mode = WAL");
  return connection;
}

function tableExists(db: Database.Database): boolean {
  const row = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
    .get(TABLE);
  return Boolean(row);
}

function requireTable(db: Database.Database): void {
  if (!tableExists(db)) {
    throw new SchemaNotReadyError(`"${TABLE}" does not exist yet in ${DB_PATH}.`);
  }
}

export type ConfigRow = Record<string, string | number>;

/** Mirrors `SiteConfig.load()` — a singleton at `id = 1`, created empty on first read. */
export function loadConfig(): ConfigRow {
  const db = open();
  requireTable(db);

  const existing = db.prepare(`SELECT * FROM ${TABLE} WHERE id = 1`).get() as
    | ConfigRow
    | undefined;
  if (existing) return existing;

  const columns = FIELDS.map((field) => field.key);
  const placeholders = columns.map(() => "?").join(", ");
  const defaults = FIELDS.map((field) => (field.type === "checkbox" ? 0 : ""));
  db.prepare(
    `INSERT INTO ${TABLE} (id, ${columns.join(", ")}) VALUES (1, ${placeholders})`,
  ).run(...defaults);

  return db.prepare(`SELECT * FROM ${TABLE} WHERE id = 1`).get() as ConfigRow;
}

export function saveConfig(values: Record<string, string | boolean>): void {
  const db = open();
  requireTable(db);

  // Ensure the singleton row exists before updating it — a fresh table has none yet.
  loadConfig();

  const assignments = FIELDS.map((field) => `${field.key} = ?`).join(", ");
  const params = FIELDS.map((field) => {
    const value = values[field.key];
    if (field.type === "checkbox") return value ? 1 : 0;
    return typeof value === "string" ? value.trim() : "";
  });
  db.prepare(`UPDATE ${TABLE} SET ${assignments} WHERE id = 1`).run(...params);
}

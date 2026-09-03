import { PageHeader } from "@/components/ui";
import { DB_PATH, loadConfig, SchemaNotReadyError } from "@/lib/db";

import { LogoutButton } from "./LogoutButton";
import { SettingsForm } from "./SettingsForm";
import { SetupNeeded } from "./SetupNeeded";

// This reads the SQLite row on every request via better-sqlite3, which Next has no way to
// know about — left to infer it, it prerenders this page once at build time (before the
// real database even exists) and would then serve that one frozen snapshot forever.
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  let config;
  try {
    config = loadConfig();
  } catch (error) {
    if (error instanceof SchemaNotReadyError) {
      return <SetupNeeded dbPath={DB_PATH} />;
    }
    throw error;
  }

  return (
    <main className="mx-auto max-w-[760px] px-4 py-10">
      <PageHeader
        eyebrow="OpenOutreach"
        title="Configuration"
        description="Every answer the CLI wizard would ask for, in one place. Save applies immediately — nothing here runs a find or a send."
        actions={<LogoutButton />}
      />
      <SettingsForm initial={config} />
    </main>
  );
}

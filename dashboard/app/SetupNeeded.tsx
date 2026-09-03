import { Panel } from "@/components/ui";

export function SetupNeeded({ dbPath }: { dbPath: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-[560px]">
        <Panel title="Not migrated yet">
          <div className="flex flex-col gap-3 text-[13.5px] leading-relaxed text-body">
            <p>
              The dashboard looks for its config table in{" "}
              <code className="rounded bg-mist px-1.5 py-0.5 font-mono text-[12.5px]">
                {dbPath}
              </code>{" "}
              and it isn&apos;t there yet.
            </p>
            <p>Run the migration once, then reload this page:</p>
            <pre className="overflow-x-auto rounded-[10px] bg-mist px-3 py-2.5 font-mono text-[12.5px]">
              {"docker compose run --rm migrate\n# or, outside Docker:\n.venv/bin/python manage.py migrate"}
            </pre>
          </div>
        </Panel>
      </div>
    </main>
  );
}

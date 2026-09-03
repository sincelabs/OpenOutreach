import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A real server, not a static export: config is read from and written to
  // SQLite on every request, and the session cookie needs a runtime to check.
  output: "standalone",

  // better-sqlite3 is a native addon — it has to stay external to the
  // server bundle rather than be traced/bundled by webpack.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;

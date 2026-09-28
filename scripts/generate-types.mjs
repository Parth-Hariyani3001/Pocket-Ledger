import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

function projectIdFromEnvFile() {
  try {
    const env = readFileSync(new URL("../.env", import.meta.url), "utf8");
    const match = env.match(/^PROJECT_ID=(.*)$/m);
    return match?.[1]?.trim().replace(/^["']|["']$/g, "") ?? "";
  } catch {
    return "";
  }
}

const projectId = process.env.PROJECT_ID?.trim() || projectIdFromEnvFile();

if (!projectId) {
  console.error(
    "Set PROJECT_ID in .env to your new Supabase project ref, then run npm run generate-types.",
  );
  process.exit(1);
}

const result = spawnSync(
  "npx",
  [
    "supabase",
    "gen",
    "types",
    "typescript",
    "--project-id",
    projectId,
    "--schema",
    "public",
  ],
  { shell: true, encoding: "utf8" },
);

if (result.status !== 0) {
  if (result.stderr) process.stderr.write(result.stderr);
  process.exit(result.status ?? 1);
}

writeFileSync(new URL("../src/types/supabase.ts", import.meta.url), result.stdout);

import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const allTests = [
  "scripts/verify-db.ts",
  "scripts/verify-search.ts",
  "scripts/verify-profile.ts",
  "scripts/verify-auth.ts",
  "scripts/verify-access.ts",
  "scripts/verify-security.ts",
];

const selected = process.argv.slice(2);
const tests = selected.length > 0 ? selected : allTests;
const tempDir = mkdtempSync(path.join(tmpdir(), "festeja-test-"));
const env: NodeJS.ProcessEnv = {
  ...process.env,
  NODE_ENV: "test" as const,
  FESTEJA_DB_PATH: path.join(tempDir, "festeja.db"),
  FESTEJA_UPLOADS_DIR: path.join(tempDir, "uploads"),
  FESTEJA_SEED: "1",
};

let failed = false;

try {
  for (const test of tests) {
    console.log(`\n> ${test}`);
    const result = spawnSync(process.execPath, ["--import", "tsx", test], {
      cwd: process.cwd(),
      env,
      stdio: "inherit",
    });
    if (result.status !== 0) failed = true;
  }
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}

if (failed) {
  console.error("\nAlguns testes falharam.");
  process.exit(1);
}

console.log("\nTodos os testes passaram.");

/**
 * Tiny .env.local loader (no deps) so `npm run smoke:* / seed:hydra` pick up keys
 * without exporting them by hand. Next.js loads .env.local on its own; standalone tsx does not.
 * Import this FIRST in any standalone script: `import "./_env";`
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

try {
  const txt = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of txt.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    let val = m[2];
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = val;
  }
} catch {
  /* no .env.local — fall back to real environment */
}

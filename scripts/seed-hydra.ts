/**
 * One-shot: ingest every seeded person's dated memories into HydraDB under the SAME
 * sub-tenant the app queries (person_<id>), so LIVE recall actually returns data and
 * HydraDB does real work behind the "live" badge.
 *
 * Run AFTER pasting keys:  npm run seed:hydra
 */
import "./_env";
import { PEOPLE } from "../lib/seed";
import { ensureTenant, hydraEnabled, ingestMemory, waitIndexed } from "../lib/hydra";

async function main() {
  if (!hydraEnabled()) {
    throw new Error("Set HYDRA_DB_API_KEY + HYDRA_DB_TENANT_ID in .env.local first.");
  }

  await ensureTenant();

  let n = 0;
  for (const person of PEOPLE) {
    for (const m of person.memories) {
      await ingestMemory(person.id, person.name, m.date, m.fact);
      n++;
      console.log(`ingested  ${person.name.padEnd(7)} ${m.date}  ${m.fact.slice(0, 60)}…`);
    }
  }
  console.log(`\n${n} memories ingested across ${PEOPLE.length} people. Waiting for HydraDB to index…`);

  const ok = await waitIndexed(40);
  console.log(
    ok
      ? "✓ indexed — live recall is ready. Open the app and click Maya's birthday."
      : "⚠ still indexing; give it a moment, then recall will populate.",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

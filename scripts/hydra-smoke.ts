/**
 * HydraDB smoke test — proves temporal, per-person, evolved recall (the money-shot).
 * Run: npm run smoke:hydra   (needs HYDRA_DB_API_KEY + HYDRA_DB_TENANT_ID in env)
 * PASS: the status loop prints "completed", then RECALL shows the matcha (Jun) memory
 *       ranked above coffee/espresso (Apr).
 */
import "./_env";
import { HydraDBClient } from "@hydradb/sdk";

const client = new HydraDBClient({ token: process.env.HYDRA_DB_API_KEY! });
const tenantId = process.env.HYDRA_DB_TENANT_ID ?? "sidekick";
const person = "person_smoke_maya";

async function main() {
  if (!process.env.HYDRA_DB_API_KEY) throw new Error("Set HYDRA_DB_API_KEY (and HYDRA_DB_TENANT_ID).");

  try {
    await client.tenants.create({ tenantId });
  } catch (e: any) {
    console.log("tenant:", e?.message ?? "exists, continuing");
  }

  await client.context.ingest({
    type: "memory",
    tenantId,
    subTenantId: person,
    memories: JSON.stringify([
      {
        text: "On 2026-04-12, Maya wanted to upgrade her espresso setup and had a Niche Zero coffee grinder in her cart for her birthday.",
        infer: true,
        user_name: "Maya",
        metadata: JSON.stringify({ event_date: "2026-04-12", topic: "taste" }),
      },
      {
        text: "On 2026-06-12, Maya switched from coffee to matcha, whisks Ippodo ceremonial matcha every morning, and always runs out of the good stuff.",
        infer: true,
        user_name: "Maya",
        metadata: JSON.stringify({ event_date: "2026-06-12", topic: "taste" }),
      },
    ]),
  });
  console.log("ingested 2 dated memories; waiting for indexing…");

  for (let i = 0; i < 30; i++) {
    const status = await client.context.status({ tenantId });
    const done = JSON.stringify(status).toLowerCase().includes("completed");
    console.log(`status[${i}] ->`, JSON.stringify(status));
    if (done) break;
    await new Promise((r) => setTimeout(r, 2000));
  }

  const recall: any = await client.query({
    tenantId,
    subTenantId: person,
    query: "What is Maya into right now, and did her taste recently change? Suggest a gift.",
    type: "memory",
    queryBy: "hybrid",
    mode: "thinking",
    recencyBias: 0.8,
  } as any);

  console.log("\nRECALL chunks ->", JSON.stringify(recall?.data?.chunks ?? recall?.chunks, null, 2));
  console.log("\nPASS if a chunk mentions MATCHA (2026-06-12) ranked above coffee/espresso (2026-04-12).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

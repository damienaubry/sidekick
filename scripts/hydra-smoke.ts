/**
 * HydraDB smoke test — proves temporal, per-person, evolved recall (the money-shot).
 * Run: npm run smoke:hydra   (needs HYDRA_DB_API_KEY + HYDRA_DB_TENANT_ID in env)
 * PASS: the status loop prints "completed", then RECALL shows the pottery (Jun) memory
 *       ranked above running (Apr).
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
        text: "On 2026-04-19, Maya ran a half-marathon PR and wanted a GPS running watch for her birthday.",
        infer: true,
        user_name: "Maya",
        metadata: JSON.stringify({ event_date: "2026-04-19", topic: "hobby" }),
      },
      {
        text: "On 2026-06-12, Maya goes to a pottery studio 3x/week, stopped talking about running, always runs out of clay; the studio sells gift cards.",
        infer: true,
        user_name: "Maya",
        metadata: JSON.stringify({ event_date: "2026-06-12", topic: "hobby" }),
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
    query: "What hobby is Maya into right now, and did it recently change? Suggest a gift.",
    type: "memory",
    queryBy: "hybrid",
    mode: "thinking",
    recencyBias: 0.8,
  } as any);

  console.log("\nRECALL chunks ->", JSON.stringify(recall?.data?.chunks ?? recall?.chunks, null, 2));
  console.log("\nPASS if a chunk mentions POTTERY (2026-06-12) ranked above running (2026-04-19).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

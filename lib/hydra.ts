/**
 * HydraDB client wrapper (server-only). The memory store — temporally-versioned,
 * preference-aware, per-person recall. This is the load-bearing sponsor.
 *
 * Footguns baked in here (see docs/BUILD-NOTES.md):
 *  - ingest is ASYNC — poll context.status until "completed" or recall returns empty
 *  - no native timestamp — the date lives IN the memory text + metadata
 *  - recency_bias defaults to 0.0 — we set 0.8 so newer memories outrank older ones
 *  - memories[] and each metadata MUST be JSON.stringify'd strings
 */

export function hydraEnabled(): boolean {
  return Boolean(process.env.HYDRA_DB_API_KEY && process.env.HYDRA_DB_TENANT_ID);
}

const tenantId = () => process.env.HYDRA_DB_TENANT_ID!;
const sub = (personId: string) => `person_${personId}`;

// lazy singleton so the SDK is only imported when keys exist
let _client: unknown = null;
async function client(): Promise<any> {
  if (_client) return _client;
  const mod: any = await import("@hydradb/sdk");
  const HydraDBClient = mod.HydraDBClient ?? mod.default;
  _client = new HydraDBClient({ token: process.env.HYDRA_DB_API_KEY! });
  return _client;
}

export async function ensureTenant(): Promise<void> {
  const c = await client();
  try {
    await c.tenants.create({ tenantId: tenantId() });
  } catch {
    /* already exists — fine */
  }
}

export async function ingestMemory(
  personId: string,
  name: string,
  dateISO: string,
  fact: string,
): Promise<void> {
  const c = await client();
  await c.context.ingest({
    type: "memory",
    tenantId: tenantId(),
    subTenantId: sub(personId),
    memories: JSON.stringify([
      {
        text: `On ${dateISO}, ${fact}`,
        infer: true,
        user_name: name,
        metadata: JSON.stringify({ event_date: dateISO, person: name }),
      },
    ]),
  });
}

/** Poll until HydraDB has indexed the latest ingest. Returns false if it never settles. */
export async function waitIndexed(maxTries = 20): Promise<boolean> {
  const c = await client();
  for (let i = 0; i < maxTries; i++) {
    const status = await c.context.status({ tenantId: tenantId() });
    if (JSON.stringify(status).toLowerCase().includes("completed")) return true;
    await new Promise((r) => setTimeout(r, 1500));
  }
  return false;
}

/** Recall the most relevant, recency-weighted memories for a person. */
export async function recall(personId: string, query: string): Promise<string[]> {
  const c = await client();
  const res: any = await c.query({
    tenantId: tenantId(),
    subTenantId: sub(personId),
    query,
    type: "memory",
    queryBy: "hybrid",
    mode: "thinking",
    recencyBias: 0.8,
  } as any);
  const chunks: any[] = res?.data?.chunks ?? res?.chunks ?? [];
  return chunks
    .map((ch) => (typeof ch === "string" ? ch : ch?.text ?? ch?.content ?? ""))
    .filter(Boolean);
}

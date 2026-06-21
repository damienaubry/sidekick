# Sidekick — build runbook (the 11:15 AM unblock kit)

> Goal of this file: at 11:15, sign up for **2 keys**, paste them, run **2 smoke tests**, confirm the
> money-shot recall works — unblocked in ~15 min instead of ~90. Then build in the order below.
>
> **CORRECTION (load-bearing):** the memory store is **HydraDB** via its own SDK (`@hydradb/sdk`).
> Ignore any mention of "Butterbase / record_learning / upsert_entity" — that was a storyboard slip.
> The running→pottery "what changed" magic is **dated memory text + `recencyBias`**, NOT a native
> supersede field (HydraDB has no `created_at`/supersede column — see gotchas).

---

## A. Paste-your-key checklist
`.env.local` (server-side only — never `NEXT_PUBLIC_`):
```
HYDRA_DB_API_KEY=...        # dashboard.hydradb.com/sign-up — free "Ship" tier, no card
HYDRA_DB_TENANT_ID=sidekick # any slug; the smoke script creates the tenant
NEBIUS_API_KEY=...          # you already have this; studio.nebius.ai → API Keys
NEBIUS_BASE_URL=https://api.studio.nebius.ai/v1/   # must end in /v1/
```
- [ ] HydraDB: sign up → copy key → paste. (Join their Discord `discord.gg/V3uAByRbeA` for hackathon-key bumps, but the free key works immediately.)
- [ ] Nebius: paste existing key. Confirm live: `curl -s https://api.studio.nebius.ai/v1/models -H "Authorization: Bearer $NEBIUS_API_KEY" | head -c 300` → JSON list, not "token is not present".
- [ ] **Then, in order:** `npm install` → `npm run smoke:hydra` + `npm run smoke:nebius` (both auto-load `.env.local`) → `npm run seed:hydra` (ingests the 3 people so live recall has data) → `npm run dev`. The app already runs without keys (seeded); this flips it to live.

---

## B. HydraDB smoke test — `scripts/hydra-smoke.ts`
Proves **temporal, per-person, evolved recall** (the money-shot) end-to-end. `npm i @hydradb/sdk@^2 && npx tsx scripts/hydra-smoke.ts`
```ts
import { HydraDBClient } from "@hydradb/sdk";

const client = new HydraDBClient({ token: process.env.HYDRA_DB_API_KEY! });
const tenantId = process.env.HYDRA_DB_TENANT_ID!;   // workspace, e.g. "sidekick"
const person = "person_maya";                        // sub_tenant = one human

async function main() {
  // 0) Create tenant ONCE (async; ignore "already exists" on reruns).
  try { await client.tenants.create({ tenantId }); }
  catch (e: any) { console.log("tenant:", e?.message ?? "exists"); }

  // 1) WRITE dated memories. Date goes IN the text (LLM cites it) AND in metadata.
  //    infer:true → HydraDB extracts the preference into its context graph.
  //    NOTE: memories[] AND each metadata MUST be JSON.stringify'd strings.
  await client.context.ingest({
    type: "memory", tenantId, subTenantId: person,
    memories: JSON.stringify([
      { text: "On 2026-04-19, Maya ran a half-marathon PR and wanted a GPS running watch for her birthday.",
        infer: true, user_name: "Maya", metadata: JSON.stringify({ event_date: "2026-04-19", topic: "hobby" }) },
      { text: "On 2026-06-12, Maya goes to a pottery studio 3x/week, stopped talking about running, always runs out of clay; the studio sells gift cards.",
        infer: true, user_name: "Maya", metadata: JSON.stringify({ event_date: "2026-06-12", topic: "hobby" }) },
    ]),
  });

  // 2) POLL until indexed — ingest is ASYNC; querying too early returns empty. #1 footgun.
  for (let i = 0; i < 30; i++) {
    const status = await client.context.status({ tenantId });
    if (JSON.stringify(status).toLowerCase().includes("completed")) break;
    await new Promise((r) => setTimeout(r, 2000));
  }

  // 3) RECALL the EVOLVED preference. recencyBias>0 pushes the newer (pottery) memory up.
  const recall = await client.query({
    tenantId, subTenantId: person, type: "memory", queryBy: "hybrid", mode: "thinking",
    query: "What hobby is Maya into right now, and did it recently change? Suggest a gift.",
    recencyBias: 0.8,   // REST field is recency_bias; defaults to 0.0 → MUST set >0
  } as any);
  console.log("RECALL →", JSON.stringify(recall.data?.chunks, null, 2));
  // PASS: a chunk mentions pottery (2026-06-12) ranked ABOVE running (2026-04-19).
}
main().catch((e) => { console.error(e); process.exit(1); });
```
**Smoke pass =** the `status[]` loop prints `completed`, then RECALL chunks contain the **2026-06-12 pottery** memory at/near the top, running lower or absent.

### HydraDB gotchas (read before you debug)
1. **Async ingest** — poll `context.status` until `completed`; querying early = empty. (Biggest time sink.)
2. **No native timestamp/supersede** — embed the date in the memory text + metadata; rank with `recencyBias`. The "active vs superseded/dimmed" chip styling is a **UI concept you compute** from dates, not a HydraDB field.
3. **`recency_bias` defaults to 0.0** — set `recencyBias: 0.8` or old "running" can outrank new "pottery".
4. **Everything stringified** — `memories` is `JSON.stringify([...])` and each `metadata` is `JSON.stringify({...})`. Raw objects error.
5. `infer:true` builds the preference graph — keep it on. The `as any` guards the `recencyBias` field name across SDK minors; the dated text is the belt-and-suspenders fallback so the gift-LLM cites the change even if the param is ignored.

---

## C. Nebius synthesis — `lib/nebius.ts`
Server-side only. `npm i openai`
```ts
import OpenAI from "openai";

const nebius = new OpenAI({
  baseURL: process.env.NEBIUS_BASE_URL ?? "https://api.studio.nebius.ai/v1/",
  apiKey: process.env.NEBIUS_API_KEY!,   // server-side, NOT NEXT_PUBLIC_
});

// memories[] = the chunks HydraDB recalled → ONE specific, thoughtful gesture.
export async function draftGift(personName: string, memories: string[]) {
  const res = await nebius.chat.completions.create({
    model: "meta-llama/Meta-Llama-3.1-70B-Instruct-fast",  // confirm via GET /v1/models
    temperature: 0.8, max_tokens: 400,
    messages: [
      { role: "system", content:
        "You are Sidekick. Given dated memories about a person, propose ONE concrete, thoughtful gift or gesture. Name the item/action, tie it directly to a recent memory, and explicitly note if their taste CHANGED over time. Warm, under 120 words, no generic ideas." },
      { role: "user", content: `Person: ${personName}\nMemories:\n- ${memories.join("\n- ")}\n\nDraft the gift/gesture:` },
    ],
  });
  return res.choices[0].message.content;
}

// OPTIONAL (cut first): Flux gift-card image — lowest-confidence piece, keep a seeded PNG fallback.
export async function giftCardImage(prompt: string) {
  const img = await nebius.images.generate({
    model: "black-forest-labs/flux-schnell",  // verify exact id via GET /v1/models
    prompt, response_format: "url",
  });
  return img.data[0].url;
}
```
### Nebius gotchas
1. **`base_url` must end in `/v1/`.** Nebius rebranded to "Token Factory"; both `api.studio.nebius.ai` and `api.tokenfactory.nebius.com` are live. Your key was issued for `studio.nebius.ai` — use that; if a valid key 401s, try the tokenfactory host.
2. **Model ids are exact + case-sensitive** (`org/Model-Name`); `-fast` is a distinct cheaper/faster variant. A typo = 404, no hint. Confirm from `GET /v1/models`.
3. **Avoid DeepSeek-R1** for the draft — it emits long `<think>` chains that bloat latency/cost. Use Llama/Qwen `Instruct-fast`.
4. **Flux is at-risk** — id/path unverified live. Treat the image as nice-to-have; seeded PNG fallback first.
5. Per-key RPM limits — one draft per click is fine; don't batch-fire on page load.

---

## D. Seed data — `lib/seed.ts` (never-blank screen + demo-safe fallback)
Pre-seed these into HydraDB via the ingest path (real rows, not mocks). Also the GestureCard fallback if a key dies mid-demo.
```ts
export type MemoryType = "preference" | "event" | "dislike" | "wish" | "relationship";
export interface Memory { id: string; date: string; fact: string; type: MemoryType; status?: "active" | "superseded"; }
export interface Person { id: string; name: string; relationship: string; monogram: string;
  nextOccasion?: { kind: string; date: string }; memories: Memory[]; }

export const PEOPLE: Person[] = [
  { id: "ent_maya", name: "Maya", relationship: "younger sister", monogram: "M",
    nextOccasion: { kind: "birthday", date: "2026-06-28" }, memories: [
    { id: "m_run1", date: "2026-03-08", type: "preference", status: "superseded",
      fact: "3 weeks into a 16-week Chicago Marathon block, 40+ mi/wk, obsessed with Garmin pace; new carbon-plate Saucony shoes; running was 'the only thing keeping her sane.'" },
    { id: "m_run2", date: "2026-04-19", type: "wish", status: "superseded",
      fact: "Ran a half-marathon PR of 1:42; wanted a GPS running watch (eyeing the Coros Pace) for her birthday." },
    { id: "m_injury", date: "2026-05-14", type: "event",
      fact: "Tore her meniscus; orthopedist said no running for 6 months. Devastated — 'didn't know who she was without a training plan.'" },
    { id: "m_pot1", date: "2026-05-31", type: "preference",
      fact: "Signed up for a beginner pottery wheel class to fill the void; throwing clay was 'weirdly meditative,' the only time her knee didn't hurt." },
    { id: "m_pot2", date: "2026-06-12", type: "preference", status: "active",
      fact: "Now at the pottery studio 3x/week, stopped talking about running entirely, fixated on glazes, sent 6 lopsided bowls, always runs out of clay; the studio sells gift cards." },
    { id: "m_nofoam", date: "2026-06-16", type: "dislike",
      fact: "Hates 'recovery' gifts (foam rollers, compression sleeves) — they remind her she can't run and make her feel like an invalid." },
    { id: "m_wool", date: "2026-02-02", type: "dislike",
      fact: "Allergic to wool — no wool blankets/sweaters/scarves." } ] },

  { id: "ent_david", name: "David", relationship: "dad", monogram: "D",
    nextOccasion: { kind: "retirement party", date: "2026-10-01" }, memories: [
    { id: "d_retire", date: "2026-01-15", type: "event", fact: "Retiring after 31 years teaching HS chemistry; nervous about 'losing his purpose,' excited for time." },
    { id: "d_coffee", date: "2026-02-20", type: "preference", fact: "Into single-origin pour-over since getting a Hario V60; grinds beans daily; grocery coffee 'tastes like burnt cardboard.'" },
    { id: "d_triumph", date: "2026-03-30", type: "wish", fact: "Always wanted to restore the 1972 Triumph motorcycle in the garage; never had time while teaching." },
    { id: "d_noapp", date: "2026-04-22", type: "dislike", fact: "No gadgets that 'need an app' or subscription; returned a smart thermostat — wants things that 'just work.'" },
    { id: "d_f1", date: "2026-05-10", type: "relationship", fact: "We watch Sunday F1 races together over the phone every weekend — a tradition since the pandemic." },
    { id: "d_hands", date: "2026-06-07", type: "event", fact: "Hands getting arthritic; the manual coffee grinder is hard to crank, he winces doing it." } ] },

  { id: "ent_priya", name: "Priya", relationship: "best friend since college", monogram: "P",
    nextOccasion: { kind: "housewarming", date: "2026-07-11" }, memories: [
    { id: "p_apt", date: "2026-02-14", type: "event", fact: "Closed on her first apartment (1BR in Oakland, south-facing window she's obsessed with) — feels like a 'real adult.'" },
    { id: "p_vegan", date: "2026-03-18", type: "preference", fact: "Fully vegan since January, strict; quietly hurt when people forget — any food gift must be plant-based." },
    { id: "p_plants", date: "2026-04-05", type: "wish", fact: "Killed 3 succulents; 'black thumb,' but loves greenery — wants something impossible to kill." },
    { id: "p_minimal", date: "2026-04-28", type: "dislike", fact: "Hates clutter/tchotchkes; strict minimalist Japandi; regifts knickknacks immediately." },
    { id: "p_knife", date: "2026-05-22", type: "relationship", fact: "8 years of monthly dinner parties; always cooks an elaborate main, complains her one chef's knife is too dull." },
    { id: "p_oatmilk", date: "2026-06-09", type: "wish", fact: "Wants to make her own oat milk & vegan lattes at home; watching barista videos late at night." } ] },
];
```
**Money-shot person = Maya.** A naive recommender surfaces the 2026-04-19 *running-watch wish*; Sidekick recalls the **evolved** state (injury 05-14 → pottery 06-12) and recommends a **pottery studio gift card / throwing tools**. The 06-16 dislike kills the tone-deaf "recovery gift"; the wool allergy proves it screens materials. The April-wish vs June-reality contrast (both dated) is the exact line the gift-LLM cites.

---

## E. Build order (money-shot path FIRST — a half-built app still demos)
1. **Theme + shell:** Next.js App Router + Tailwind v4, hydra-teal accent `#0E8C8C` (primary) on near-black, warm off-white text. shadcn Card/Input/Button/Tooltip/Badge/Skeleton. One dark page, projector-legible.
2. **Seed data (`lib/seed.ts`) first** so the screen is never blank.
3. **Static money-shot** (demo-safe core): PeopleGrid from seed + a **hardcoded** GestureCard for Maya — gift text, cited dated chips, what-changed callout. ✅ **Screenshot this as the backup video frame.**
4. **Occasion trigger:** clicking Maya's occasion pill swaps in the card behind a LoadingShimmer (even if still seeded) — feels live.
5. **Real recall:** `lib/hydra.ts` (`context.ingest` / `query` with `recencyBias`) replaces the seed read; keep seed as fallback.
6. **Real synthesis:** `lib/nebius.ts` `draftGift(memories)` → `{ gesture, message, citedMemoryIds, whatChanged }`; seeded gesture as fallback.
7. **"Tell me about them" write:** the input does a live `context.ingest` → a new dated chip appears (the one live write that proves it *learns*).
8. **Flux image** (only if ahead): `giftCardImage()` with a seeded PNG fallback already in place.
9. **Polish:** chip tooltips (raw memory + date), what-changed pulse, contrast/spacing pass for the projector.

### Data model (what GestureCard consumes)
- **Person** (HydraDB sub-tenant): id, name, relationship, monogram, `nextOccasion{kind,date}`.
- **Memory** (HydraDB `type:"memory"` item): id, `date` (in text + metadata), `fact`, `type`, UI `status:active|superseded` (derived from dates, not stored).
- **Gesture** (derived at runtime from Nebius, NOT stored): `{ gift, message, citedMemoryIds[], whatChanged:{from,to,changedAt,retiredIdea}, imageUrl? }`.

### Cut/faked (demo safety)
Real: temporal recall, the live "tell me" write, Nebius synthesis. Faked-on-purpose: occasion is a button (no calendar sync), single user (no auth), seeded people. Fallback-seeded: the exact Maya GestureCard + a PNG gift-card image, so running→pottery lands even if a key dies mid-demo.

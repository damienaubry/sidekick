# Sidekick — submission

> **Tagline:** Sidekick remembers how the people you love *change* — so you always give the gift that says *"I was paying attention,"* never the generic one.

**Tracks:** 🎯 Best Use of Memory / Context · 🎯 Best Agent People Love · 🎯 Most Creative Build
**Powered by:** HydraDB (memory) · Nebius (inference)

---

## Inspiration

We remember the people we love **badly**. They tell us things in passing — a taste that shifted, a thing they now love, a thing they quietly stopped — and weeks later, when a birthday sneaks up, we reach for the same generic gift. The detail was *right there* in a conversation; we just didn't carry it forward.

Most "AI assistants" have the exact same disease: **amnesia between sessions**. They answer the prompt in front of them and forget you the moment it ends. They never build a real, *evolving* picture of a person — so they can't notice the one thing that makes a gift land: **how someone changed**.

That gap is the whole product. Not "remember facts" — **remember the change**.

## What it does

You tell Sidekick about the people you love, casually, the way you'd mention it to a friend: *"Maya's all about matcha now — she's been off coffee since her caffeine scare."* Sidekick writes that down as a **dated** memory. It never overwrites the old one — the espresso era stays, dimmed and dated; the matcha era is added. Sidekick now *knows her taste changed*.

When an occasion comes up, you tap it. Sidekick recalls the **specific, dated** memories for that person, ranks the *latest* taste to the top, and hands you a complete gesture: a concrete **gift**, a **drafted message**, the exact **dated memories it drew on** as citation chips, and a **"What changed"** band naming the shift it caught.

**The money-shot:** It's Maya's birthday next week. Sidekick proposes a **ceremonial matcha kit** — the Ippodo she keeps rationing — **not** the espresso grinder you almost bought, because it caught that she switched **coffee → matcha** weeks ago and retired the old idea. One screen, ~15 seconds. The magic is memory of a *change over time*.

> Birthdays are just the first trigger. The same engine works for an anniversary, a hard week, a thank-you — and it doesn't just pick the gift, it drafts the message too.

## How we built it

One polished Next.js screen on top of two load-bearing services. The flow is `you teach it → POST /api/memory → HydraDB` and `tap an occasion → POST /api/gesture → recall (HydraDB) → synthesize (Nebius) → GestureCard`.

| Capability | Pick | BUY / WIRE / BUILD |
|---|---|---|
| Per-person memory + temporal recall | **HydraDB** `@hydradb/sdk@^2` (`ingest` / `query` + `recencyBias`) | WIRE |
| Reasoning → gesture draft | **Nebius** via the `openai` SDK · `Meta-Llama-3.1-70B-Instruct-fast` | WIRE |
| App shell | Next.js 15 · React 19 · Tailwind v4 · accent `#0E8C8C` | BUY |

### HydraDB — the memory layer (load-bearing)
Structured context graph with **temporally-versioned, preference-aware, relational recall** — it remembers how a person's tastes *evolved*. **Delete it → generic gift suggestions, the wow dies.** Because HydraDB has no native "supersede" field, we encode the timeline in **dated memory text + `recencyBias`**: recall ranks *matcha* above *coffee*, and the dimmed "retired" chips + the **"What changed"** band are computed from those dates. This is what makes the marquee **Best Use of Memory / Context** real rather than a chatbot with a scratchpad.

### Nebius — the reasoning layer (load-bearing)
OpenAI-compatible inference over strong open models synthesizes the recalled memories into **one specific, thoughtful gesture** — the gift and the message that nods to who the person *was* and is now. **Delete it → nothing to draft.**

> **Honest engineering:** the app runs with **zero keys** on a seeded path so the demo can never break (it *is* the backup video). Add the two keys and `/api/gesture` auto-flips to **live HydraDB recall + Nebius synthesis** with no code change; the seeded path stays as a graceful fallback in the API route's try/catch.

## Built with

`HydraDB` · `Nebius` · `Next.js 15` · `React 19` · `Tailwind CSS v4` · `TypeScript` · `OpenAI SDK (Nebius-compatible)` · `Meta-Llama-3.1-70B-Instruct-fast`

## Try it

- **Live app:** `npm install && npm run dev` → http://localhost:3000 — open **Maya**, tap her birthday. (Runs with **no keys**; add keys in `.env.local` to go live — see the README.)
- **Deck:** http://localhost:3000/deck — the 3-slide submission deck (Team · Product · Demo).
- **Backup video:** `public/deck-demo.mp4` — the ~15s coffee→matcha money-shot, narrated, in case a live link dies.

## What's next / honest scope

**Built & verified:** the full seeded money-shot end-to-end; live HydraDB + Nebius behind keys with a seeded fallback so it never breaks on stage.

**Intentionally cut (this build) → the roadmap:** real contact & calendar sync so occasions trigger themselves (today it's a tap) · accounts/login & multi-user · proactive "occasion coming up" notifications · a generated gift-card image (Flux via Nebius) · full memory-edit CRUD (add-only today) · mobile polish.

---

## Devpost — field-by-field (paste-ready)

**Inspiration**
We remember the people we love badly — tastes drift, details slip, and the gift ends up generic. AI assistants have the same disease: amnesia between sessions. Sidekick is built around the one thing that makes a gift land — noticing *how someone changed over time*.

**What it does**
You tell Sidekick about the people you love in plain language; it stores each fact as a dated memory and never overwrites the old one. When an occasion comes up, it recalls the person's evolving history, ranks the latest taste first, and hands you a concrete gift + a drafted message + the exact dated memories it used + a "What changed" band. Example: for Maya's birthday it proposes a ceremonial matcha kit — not the espresso grinder you almost bought — because it caught she switched coffee → matcha weeks ago.

**How we built it**
Next.js 15 / React 19 / Tailwind v4 front end; HydraDB as the temporally-versioned memory layer (`@hydradb/sdk`, recall with `recencyBias`); Nebius for inference (OpenAI-compatible, `Meta-Llama-3.1-70B-Instruct-fast`) to synthesize the gesture. `POST /api/memory` writes memories; `POST /api/gesture` recalls then synthesizes. Runs with zero keys on a seeded path; flips to live recall+synthesis when keys are present.

**Challenges we ran into**
HydraDB has no native "supersede"/timestamp field, so the "taste changed over time" effect had to be engineered from dated memory text + `recencyBias` (recall ranks the newest taste up), with the "retired"/dimmed chips and the "What changed" band computed from dates. Ingest is async, so seeding polls until completed. Solo build in ~4 hours.

**Accomplishments we're proud of**
A money-shot that lands in ~15 seconds on one screen and survives with no keys, plus a live path behind keys — the difference between a generic gift and one that says "I was paying attention."

**What we learned**
The wow in a memory agent isn't recall of facts — it's recall of a *change*. Designing the data + UI around "what changed" is what makes a memory layer feel intelligent instead of like a notes app.

**What's next**
Real contact & calendar sync (auto-triggered occasions), accounts/multi-user, proactive notifications, a generated gift-card image (Flux via Nebius), full memory CRUD, mobile polish.

**Built with**
hydradb, nebius, next.js, react, tailwindcss, typescript, openai, llama

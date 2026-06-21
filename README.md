<div align="center">

<img src="docs/assets/banner.png" alt="Sidekick — remembers how the people you love change" width="100%" />

<br/><br/>

### Tell it about the people you love. When an occasion comes up, it hands you the perfect gesture.

*Birthdays sneak up. The gift is always generic. Sidekick is the friend who was paying attention.*

<br/>

[![Track](https://img.shields.io/badge/Best_Use_of-Memory_%2F_Context-0E8C8C?style=flat-square)](#-why-it-wins)
[![Built with HydraDB](https://img.shields.io/badge/Memory-HydraDB-0E8C8C?style=flat-square)](https://hydradb.com)
[![Powered by Nebius](https://img.shields.io/badge/Inference-Nebius-0E8C8C?style=flat-square)](https://nebius.ai)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-0E8C8C?style=flat-square)](LICENSE)

<br/>

**[ Agents you Love — Hackathon · SF · June 21, 2026 ]**

</div>

---

<div align="center">

> ### 💥 The money-shot
> Type **“my sister’s birthday is next week.”**
> Sidekick proposes the **ceremonial matcha she’s been raving about** — *not* the espresso
> grinder you almost bought — because it caught that she **quit coffee and switched to matcha
> weeks ago**, and drafts a card that nods to her old triple-shot self.
>
> **One screen. ~15 seconds. The magic is memory of a *change over time*.**

</div>

---

## 🎥 Video demo

<div align="center">

[<img src="docs/assets/demo-poster.jpg" alt="▶ Watch the Sidekick demo on YouTube" width="760"/>](https://youtu.be/niukYEe1Q14)

### ▶︎ [ Watch the 30-second demo on YouTube ](https://youtu.be/niukYEe1Q14)

*coffee → matcha · one screen · ~30s · narrated*

</div>

---

## 🧠 How it works

We remember the people we love **badly** — tastes drift, and we reach for the same generic gift.
Most assistants share the disease: **amnesia between sessions**. Sidekick doesn't:

1. **Teach it, casually** — *“Maya’s obsessed with matcha now, totally off coffee since her caffeine scare.”*
2. **It writes, never overwrites** — the old memory stays *dated*; Sidekick now knows her taste *changed*.
3. **An occasion hits** — tap Maya’s birthday → it recalls the **specific, dated** memories.
4. **It hands you the gesture** — the matcha she raves about (not the espresso grinder) + a drafted card,
   each citing the exact memories, with a **“What changed”** band on the shift it caught.

> The difference between a generic gift and one that says *“I was paying attention.”*

---

## 🏆 Why it wins

| Prize track | Fit |
|---|---|
| 🎯 **Best Use of Memory / Context** | Temporal recall is the whole product — it remembers how a person *evolved*, not just facts. |
| 🎯 **Best Agent People Love** | The gesture is emotional, human, and specific. It feels like a thoughtful friend. |
| 🎯 **Most Creative Build** | “Memory of a change over time” as the headline feature, not a chatbot wrapper. |

**The wow isn’t recall — it’s recall of a *change*.** Coffee → matcha. Old idea retired,
new one surfaced, with dates. That’s only possible with a real memory layer.

---

## 🛠️ How it’s built

```
            you teach it ──▶  POST /api/memory  ──▶  ┌──────────────┐
                                                      │   HydraDB    │  dated, append-only
                                                      │  memory layer│  per-person recall
   tap an occasion ──▶ POST /api/gesture ──┐          └──────┬───────┘
                                            │  recall (recencyBias) │
                                            ▼                       ▼
                                     ┌──────────────┐        cited dated memories
                                     │    Nebius    │ ◀── synthesize ──┘   + "what changed"
                                     │  Llama-3.1   │
                                     │   70B-fast   │
                                     └──────┬───────┘
                                            ▼
                                  🎁 GestureCard (gift + drafted message)
```

| Layer | Tech | Load-bearing role |
|---|---|---|
| **Memory** | **HydraDB** `@hydradb/sdk` | Stores **dated, append-only** memories per person; recall with `recencyBias` surfaces the *latest* taste. Delete it → generic suggestions, the magic dies. |
| **Reasoning** | **Nebius** (`openai` SDK · `Meta-Llama-3.1-70B-Instruct-fast`) | Turns recalled memories into one *specific, personal* gesture + message. |
| **App** | **Next.js 15 · React 19 · Tailwind v4** | One polished, projector-legible screen. Accent `#0E8C8C`. |

> **The temporal trick:** HydraDB has no native “supersede” field, so Sidekick encodes the
> timeline in **dated memory text + `recencyBias`**. The dimmed “retired” chips and the
> **What changed** band are computed from those dates — recall ranks *matcha* above *coffee*.

---

## 🚀 Run it

**Runs with zero keys.** The full money-shot works out of the box on a seeded demo, so the
demo can never break. Add keys to flip it to **live** HydraDB recall + Nebius synthesis — *no code change*.

```bash
npm install
npm run dev          # ▶ http://localhost:3000  — seeded demo, no keys needed
```

<details>
<summary><b>Go live (real HydraDB + Nebius) · scripts · project structure</b></summary>

```bash
cp .env.example .env.local      # paste your two keys
npm run smoke:hydra             # ✅ recall ranks matcha above coffee
npm run smoke:nebius            # ✅ inference reachable
npm run seed:hydra              # ✅ ingest the 3 people so live recall has real data
npm run dev                     # /api/gesture now auto-flips to live; seeded stays as fallback
```
> HydraDB ingest is **async** — `seed:hydra` polls until `completed`. Free “Ship” tier, no card:
> [dashboard.hydradb.com](https://dashboard.hydradb.com/sign-up).

**Project structure**

```
app/api/memory/route.ts    # write a new dated memory  → HydraDB
app/api/gesture/route.ts   # the live pipeline: recall → synthesize (seeded fallback)
app/page.tsx               # the single screen
components/GestureCard.tsx # 🎁 the money-shot: gift + message + "what changed"
components/...             # PersonCard · MemoryTimeline · TellMeInput
lib/hydra.ts · nebius.ts   # HydraDB + Nebius clients (server-only)
lib/gesture.ts             # seeded demo gestures (fallback when keys absent)
scripts/                   # seed + smoke tests
```

</details>

---

## 🧱 Honest scope (built in ~4h, solo)

**Built & verified:** the full seeded money-shot, live HydraDB + Nebius behind keys with seeded fallback.
**Intentionally cut:** auth/login · real contact & calendar sync (occasion is a button) · push notifications · Flux gift-card image · mobile polish.

---

## 📦 Built with

**[HydraDB](https://hydradb.com)** · **[Nebius](https://nebius.ai)** · [Next.js 15](https://nextjs.org) · [React 19](https://react.dev) · [Tailwind CSS v4](https://tailwindcss.com) · TypeScript

---

<div align="center">

*Sidekick remembers how the people you love change — so you never give a generic gift again.*

**MIT** © 2026 Damien Aubry

</div>

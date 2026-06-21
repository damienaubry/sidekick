import { NextResponse } from "next/server";
import { getPerson } from "@/lib/seed";
import { SEED_GESTURES } from "@/lib/gesture";
import { hydraEnabled, recall } from "@/lib/hydra";
import { nebiusEnabled, draftGesture } from "@/lib/nebius";
import type { Gesture } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { personId } = await req.json().catch(() => ({ personId: "" }));
  const person = getPerson(personId);
  if (!person) {
    return NextResponse.json({ error: "unknown person" }, { status: 404 });
  }

  const occasion = person.nextOccasion?.kind ?? "occasion";
  const seeded: Gesture = { ...SEED_GESTURES[personId], live: false };

  // Live path only when BOTH stores are wired. Otherwise the seeded money-shot (demo default).
  if (hydraEnabled() && nebiusEnabled()) {
    try {
      const recalled = await recall(
        personId,
        `What should I get ${person.name} for their ${occasion}, and did their interests change recently?`,
      );
      const memories = person.memories.map((m) => ({ id: m.id, date: m.date, fact: m.fact }));
      const draft = await draftGesture(person.name, occasion, memories, recalled);
      if (draft.gift && draft.message) {
        const live: Gesture = { personId, occasion, ...draft, imageUrl: null, live: true };
        return NextResponse.json(live);
      }
    } catch {
      // fall through to the seeded gesture — demo never breaks
    }
  }

  // brief pause so the LoadingShimmer is visible even in seeded mode
  await new Promise((r) => setTimeout(r, 550));
  return NextResponse.json(seeded);
}

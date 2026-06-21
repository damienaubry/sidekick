import { NextResponse } from "next/server";
import { getPerson } from "@/lib/seed";
import { hydraEnabled, ingestMemory } from "@/lib/hydra";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { personId, fact } = await req.json().catch(() => ({ personId: "", fact: "" }));
  const person = getPerson(personId);
  if (!person || !fact?.trim()) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const date = new Date().toISOString().slice(0, 10);

  // The one live WRITE that proves Sidekick learns. UI already updated optimistically,
  // so a failure here never blocks the demo.
  if (hydraEnabled()) {
    try {
      await ingestMemory(person.id, person.name, date, fact.trim());
    } catch {
      /* swallow — optimistic UI stands */
    }
  }

  return NextResponse.json({ ok: true, date });
}

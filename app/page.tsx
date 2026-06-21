"use client";

import { useMemo, useState } from "react";
import { PEOPLE } from "@/lib/seed";
import type { Gesture, Memory } from "@/lib/types";
import { PersonCard } from "@/components/PersonCard";
import { MemoryTimeline } from "@/components/MemoryTimeline";
import { TellMeInput } from "@/components/TellMeInput";
import { GestureCard, GestureSkeleton } from "@/components/GestureCard";
import { capitalize, shortDate } from "@/lib/format";

export default function Home() {
  const [memoriesByPerson, setMemoriesByPerson] = useState<Record<string, Memory[]>>(() =>
    Object.fromEntries(PEOPLE.map((p) => [p.id, p.memories])),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [gesture, setGesture] = useState<Gesture | null>(null);
  const [loading, setLoading] = useState(false);

  const selected = selectedId ? PEOPLE.find((p) => p.id === selectedId) ?? null : null;
  const selectedMemories = selectedId ? memoriesByPerson[selectedId] ?? [] : [];

  const memoriesById = useMemo(() => {
    const all: Record<string, Memory> = {};
    for (const m of Object.values(memoriesByPerson).flat()) all[m.id] = m;
    return all;
  }, [memoriesByPerson]);

  function selectPerson(id: string) {
    setSelectedId(id);
    setGesture(null);
    setLoading(false);
  }

  async function addMemory(fact: string) {
    if (!selectedId) return;
    const today = new Date().toISOString().slice(0, 10);
    const optimistic: Memory = {
      id: `mem_${Date.now()}`,
      date: today,
      fact,
      type: "preference",
      status: "active",
    };
    setMemoriesByPerson((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), optimistic],
    }));
    try {
      await fetch("/api/memory", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ personId: selectedId, fact }),
      });
    } catch {
      /* optimistic UI stands */
    }
  }

  async function generate() {
    if (!selected) return;
    setLoading(true);
    setGesture(null);
    try {
      const res = await fetch("/api/gesture", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ personId: selected.id }),
      });
      setGesture((await res.json()) as Gesture);
    } catch {
      /* leave empty */
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="relative z-10 border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent font-bold text-bg">
            S
          </span>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Sidekick</h1>
            <p className="text-xs text-muted">Remembers the people you love — and how they change.</p>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-12">
        <section className="lg:col-span-5">
          <h2 className="mb-3 text-sm font-medium text-muted">People you love</h2>
          <div className="space-y-3">
            {PEOPLE.map((p) => (
              <PersonCard
                key={p.id}
                person={{ ...p, memories: memoriesByPerson[p.id] ?? p.memories }}
                selected={selectedId === p.id}
                onSelect={() => selectPerson(p.id)}
              />
            ))}
          </div>
        </section>

        <section className="lg:col-span-7">
          {!selected ? (
            <div className="grid h-full min-h-[320px] place-items-center rounded-2xl border border-dashed border-border bg-surface/40 p-8 text-center">
              <div className="max-w-xs">
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-accent/10 text-xl text-accent2">
                  ♥
                </div>
                <p className="font-medium text-ink">Pick someone you love</p>
                <p className="mt-1 text-sm text-muted">
                  Sidekick already remembers a few. Open <span className="text-ink">Maya</span> to see
                  what it does when a birthday&rsquo;s coming up.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{selected.name}</h2>
                  <p className="text-sm text-muted">{selected.relationship}</p>
                </div>
                {selected.nextOccasion && (
                  <button
                    onClick={generate}
                    disabled={loading}
                    className="shrink-0 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-bg shadow-lg shadow-accent/20 transition hover:bg-accent2 disabled:opacity-50"
                  >
                    {loading
                      ? "Thinking…"
                      : `${capitalize(selected.nextOccasion.kind)} · ${shortDate(
                          selected.nextOccasion.date,
                        )} →`}
                  </button>
                )}
              </div>

              {loading && <GestureSkeleton />}
              {gesture && !loading && (
                <GestureCard gesture={gesture} memoriesById={memoriesById} />
              )}

              <div className="rounded-2xl border border-border bg-surface/50 p-4">
                <h3 className="mb-3 text-sm font-medium text-muted">What Sidekick remembers</h3>
                <MemoryTimeline memories={selectedMemories} />
                <div className="mt-4">
                  <TellMeInput onAdd={addMemory} />
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-10 pt-2 text-center text-xs text-muted">
        Memory by HydraDB · reasoning by Nebius
      </footer>
    </>
  );
}

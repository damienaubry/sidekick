"use client";

import type { Person } from "@/lib/types";
import { cn } from "@/lib/cn";
import { shortDate } from "@/lib/format";

export function PersonCard({
  person,
  selected,
  onSelect,
}: {
  person: Person;
  selected: boolean;
  onSelect: () => void;
}) {
  const occ = person.nextOccasion;
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full rounded-2xl border p-4 text-left transition",
        selected
          ? "border-accent bg-surface2"
          : "border-border bg-surface hover:border-accent/50 hover:bg-surface2",
      )}
    >
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent/15 text-lg font-semibold text-accent2 ring-1 ring-accent/30">
          {person.monogram}
        </span>
        <div className="min-w-0">
          <div className="truncate font-semibold text-ink">{person.name}</div>
          <div className="truncate text-sm text-muted">{person.relationship}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        {occ ? (
          <span className="rounded-full bg-warm/15 px-2.5 py-1 text-xs font-medium text-warm">
            {occ.kind} · {shortDate(occ.date)}
          </span>
        ) : (
          <span />
        )}
        <span className="text-xs text-muted">{person.memories.length} memories</span>
      </div>
    </button>
  );
}

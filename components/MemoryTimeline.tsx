"use client";

import type { Memory } from "@/lib/types";
import { cn } from "@/lib/cn";
import { shortDate } from "@/lib/format";
import { TYPE_META } from "@/lib/memoryMeta";

export function MemoryTimeline({ memories }: { memories: Memory[] }) {
  const sorted = [...memories].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <ol className="space-y-2">
      {sorted.map((m) => {
        const meta = TYPE_META[m.type];
        const superseded = m.status === "superseded";
        return (
          <li
            key={m.id}
            className={cn(
              "rounded-xl border border-border bg-surface px-3 py-2 transition",
              superseded && "opacity-50",
            )}
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-muted">{shortDate(m.date)}</span>
              <span className={cn("font-medium", meta.color)}>{meta.label}</span>
              {superseded && (
                <span className="ml-auto rounded bg-border px-1.5 py-0.5 text-xs uppercase tracking-wide text-muted">
                  retired
                </span>
              )}
            </div>
            <p
              className={cn(
                "mt-1 break-words text-sm text-ink/90",
                superseded && "line-through decoration-muted/50",
              )}
            >
              {m.fact}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

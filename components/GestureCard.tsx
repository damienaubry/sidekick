"use client";

import type { Gesture, Memory } from "@/lib/types";
import { cn } from "@/lib/cn";
import { shortDate } from "@/lib/format";

export function GestureSkeleton() {
  return (
    <div className="animate-pulse space-y-4 rounded-2xl border border-border bg-surface p-5">
      <div className="h-4 w-32 rounded bg-border" />
      <div className="h-16 rounded bg-border/70" />
      <div className="h-6 w-3/4 rounded bg-border" />
      <div className="h-12 rounded bg-border/50" />
      <div className="flex gap-2">
        <div className="h-6 w-24 rounded-full bg-border" />
        <div className="h-6 w-28 rounded-full bg-border" />
      </div>
    </div>
  );
}

export function GestureCard({
  gesture,
  memoriesById,
}: {
  gesture: Gesture;
  memoriesById: Record<string, Memory>;
}) {
  const cited = gesture.citedMemoryIds
    .map((id) => memoriesById[id])
    .filter(Boolean) as Memory[];

  return (
    <div className="overflow-hidden rounded-2xl border border-accent/40 bg-gradient-to-b from-surface2 to-surface shadow-[0_0_40px_-12px] shadow-accent/30">
      <div className="flex items-center gap-2 border-b border-border/60 px-5 py-3">
        <span className="text-sm font-semibold text-accent2">Sidekick suggests</span>
        <span
          className={cn(
            "ml-auto rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
            gesture.live ? "bg-accent/20 text-accent2" : "bg-border text-muted",
          )}
        >
          {gesture.live ? "live" : "demo"}
        </span>
      </div>

      <div className="space-y-4 p-5">
        {/* HERO: the change-over-time reveal — the brightest object on screen, animated in. */}
        {gesture.whatChanged && (
          <div className="rounded-xl border border-accent/50 bg-accent/15 px-4 py-3.5 shadow-[0_0_24px_-8px] shadow-accent/40 motion-safe:animate-[fadeUp_320ms_ease-out]">
            <div className="text-xs font-semibold uppercase tracking-wider text-accent2">
              What changed
            </div>
            <p className="mt-1.5 text-xl font-bold leading-tight text-ink">
              <span className="text-muted line-through decoration-muted/60">
                {gesture.whatChanged.from}
              </span>{" "}
              <span className="text-accent2">→ {gesture.whatChanged.to}</span>
            </p>
            <p className="mt-1.5 text-xs text-muted">
              Updated {shortDate(gesture.whatChanged.changedAt)} · retired the old idea:{" "}
              {gesture.whatChanged.retiredIdea}.
            </p>
          </div>
        )}

        <p className="text-lg font-semibold leading-snug text-ink">{gesture.gift}</p>

        <blockquote className="rounded-xl border-l-2 border-warm/60 bg-warm/5 px-4 py-3 text-sm italic text-ink/90">
          &ldquo;{gesture.message}&rdquo;
        </blockquote>

        {!gesture.whatChanged && gesture.noticed && (
          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-warm">
              What I noticed
            </div>
            <p className="mt-1 text-sm text-ink/90">{gesture.noticed}</p>
          </div>
        )}

        {cited.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-medium text-muted">Drawn from these memories</div>
            <div className="flex flex-wrap gap-2">
              {cited.map((m) => (
                <span
                  key={m.id}
                  title={m.fact}
                  className="inline-flex max-w-[16rem] items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-ink/90"
                >
                  <span className="font-mono text-muted">{shortDate(m.date)}</span>
                  <span className="truncate">{m.fact}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

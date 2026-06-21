import type { MemoryType } from "./types";

export const TYPE_META: Record<MemoryType, { label: string; color: string }> = {
  preference: { label: "likes", color: "text-accent2" },
  event: { label: "happened", color: "text-warm" },
  dislike: { label: "avoid", color: "text-rose-300" },
  wish: { label: "wants", color: "text-amber-300" },
  relationship: { label: "us", color: "text-emerald-300" },
};

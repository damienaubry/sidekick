export type MemoryType =
  | "preference"
  | "event"
  | "dislike"
  | "wish"
  | "relationship";

export interface Memory {
  id: string;
  date: string; // YYYY-MM-DD — shown on the chip
  fact: string;
  type: MemoryType;
  /** UI-derived from dates (NOT a HydraDB field): superseded memories render dimmed. */
  status?: "active" | "superseded";
}

export interface Person {
  id: string;
  name: string;
  relationship: string;
  monogram: string;
  nextOccasion?: { kind: string; date: string };
  memories: Memory[];
}

export interface WhatChanged {
  from: string;
  to: string;
  changedAt: string; // YYYY-MM-DD
  retiredIdea: string;
}

export interface Gesture {
  personId: string;
  occasion: string;
  gift: string;
  message: string;
  citedMemoryIds: string[];
  /** The headline temporal shift (the money-shot band). Null when there isn't a clean from->to. */
  whatChanged?: WhatChanged | null;
  /** Softer "what I noticed recently" when there's no clean from->to. */
  noticed?: string | null;
  imageUrl?: string | null;
  /** true = generated live via HydraDB + Nebius; false = seeded fallback (demo-safe). */
  live?: boolean;
}

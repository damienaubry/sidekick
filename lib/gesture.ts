import type { Gesture } from "./types";

/**
 * Demo-safe seeded gestures — exactly what the live HydraDB+Nebius path produces, hardcoded
 * so the money-shot lands even with zero keys or if a key dies mid-demo. Maya is the star
 * (the running -> pottery `whatChanged` band); David and Priya keep the demo robust if a
 * judge clicks them.
 */
export const SEED_GESTURES: Record<string, Gesture> = {
  ent_maya: {
    personId: "ent_maya",
    occasion: "birthday",
    gift: "A 6-week beginner pottery course at her neighborhood studio (the one that sells gift cards) + a fresh bag of stoneware clay.",
    message:
      "Happy 29th, Maya. From chasing PRs to chasing the perfect bowl — I can't wait to see what you make this year. (Save me the first lopsided one.)",
    citedMemoryIds: ["m_pot2", "m_run2", "m_injury", "m_nofoam"],
    whatChanged: {
      from: "running",
      to: "pottery",
      changedAt: "2026-06-12",
      retiredIdea: "a GPS running watch",
    },
    noticed: null,
    imageUrl: null,
    live: false,
  },
  ent_david: {
    personId: "ent_david",
    occasion: "retirement party",
    gift: "An electric burr grinder — single-origin quality without the hand-crank his wrists now hate. No app, no subscription; it just works.",
    message:
      "Here's to 31 years and the slow mornings you've earned, Dad. Your pour-over, minus the wince. See you Sunday for the race.",
    citedMemoryIds: ["d_coffee", "d_hands", "d_noapp"],
    whatChanged: null,
    noticed:
      "His hands turned the morning grind into a chore (Jun 7) — so the gift fixes the pain, not just the coffee.",
    imageUrl: null,
    live: false,
  },
  ent_priya: {
    personId: "ent_priya",
    occasion: "housewarming",
    gift: "A proper Japanese chef's knife — she's been cooking our dinner-party mains with a dull one for months. Minimalist, no clutter, plant-based prep ready.",
    message:
      "To your first real kitchen, Priya. May every vegan feast finally get the blade it deserves. Hosting's at yours next month.",
    citedMemoryIds: ["p_knife", "p_minimal", "p_vegan"],
    whatChanged: null,
    noticed:
      "Closed on her first apartment (Feb) and still cooking with a dull knife — a housewarming gift that earns its place in a minimalist kitchen.",
    imageUrl: null,
    live: false,
  },
};

import type { Person } from "./types";

/**
 * Seed people + dated memory histories. These are pre-ingested into HydraDB via the
 * real ingest path (genuine rows, not mocks) AND used as the demo-safe fallback.
 *
 * Money-shot person = Maya: a naive recommender surfaces her 2026-04-12 espresso-upgrade
 * wish; Sidekick recalls the EVOLVED state (caffeine jitters 05-10 -> matcha 06-12) and
 * proposes the ceremonial matcha she raves about. `status: "superseded"` dims the retired
 * coffee memories.
 */
export const PEOPLE: Person[] = [
  {
    id: "ent_maya",
    name: "Maya",
    relationship: "younger sister",
    monogram: "M",
    nextOccasion: { kind: "birthday", date: "2026-06-28" },
    memories: [
      {
        id: "m_coffee1",
        date: "2026-03-05",
        type: "preference",
        status: "superseded",
        fact: "Deep in her specialty-coffee era — pulls espresso on her Breville every morning, subscribes to a single-origin roaster, calls coffee 'her whole personality.' Two double-shots before noon.",
      },
      {
        id: "m_coffee2",
        date: "2026-04-12",
        type: "wish",
        status: "superseded",
        fact: "Wanted to upgrade her espresso setup for her birthday — had a Niche Zero grinder sitting in her cart for weeks.",
      },
      {
        id: "m_jitters",
        date: "2026-05-10",
        type: "event",
        fact: "Caffeine started wrecking her — racing heart, anxious afternoons, couldn't sleep. Doctor told her to cut way back. 'I don't know how to have a morning without a double shot.'",
      },
      {
        id: "m_matcha1",
        date: "2026-05-26",
        type: "preference",
        fact: "Swapped coffee for matcha to keep the ritual without the crash — says it's 'calm energy, no 3pm spiral.' Started whisking a bowl every morning.",
      },
      {
        id: "m_matcha2",
        date: "2026-06-12",
        type: "preference",
        status: "active",
        fact: "Fully in her matcha era now — deep in matcha TikTok, won't shut up about the Ippodo ceremonial matcha she found ('the first one that isn't grassy'), but rations it because it's pricey and always runs out.",
      },
      {
        id: "m_nocoffee",
        date: "2026-06-16",
        type: "dislike",
        fact: "Asked us to stop giving her coffee stuff — beans, espresso gear — 'it just sits there tempting me and then I feel awful.'",
      },
      {
        id: "m_clutter",
        date: "2026-02-02",
        type: "dislike",
        fact: "Strict minimalist — hates clutter and novelty mugs, regifts knickknacks immediately. Anything on the counter has to be beautiful.",
      },
    ],
  },
  {
    id: "ent_david",
    name: "David",
    relationship: "dad",
    monogram: "D",
    nextOccasion: { kind: "retirement party", date: "2026-10-03" },
    memories: [
      {
        id: "d_retire",
        date: "2026-01-15",
        type: "event",
        fact: "Retiring after 31 years teaching high-school chemistry; nervous about 'losing his purpose,' but excited to finally have time.",
      },
      {
        id: "d_coffee",
        date: "2026-02-20",
        type: "preference",
        fact: "Got really into single-origin pour-over after a Hario V60. Grinds beans every morning; says grocery coffee 'tastes like burnt cardboard.'",
      },
      {
        id: "d_triumph",
        date: "2026-03-30",
        type: "wish",
        fact: "Always wanted to restore the 1972 Triumph motorcycle that's sat in the garage for decades; never had time while teaching.",
      },
      {
        id: "d_noapp",
        date: "2026-04-22",
        type: "dislike",
        fact: "Won't use gadgets that 'need an app' or a subscription. Returned a smart thermostat — wants things that 'just work.'",
      },
      {
        id: "d_f1",
        date: "2026-05-10",
        type: "relationship",
        fact: "We watch the Sunday F1 races together over the phone, narrating every overtake — a tradition since the pandemic, never missed a weekend.",
      },
      {
        id: "d_hands",
        date: "2026-06-07",
        type: "event",
        status: "active",
        fact: "His hands have been getting arthritic; the manual coffee grinder is hard to crank now and he winces doing it.",
      },
    ],
  },
  {
    id: "ent_priya",
    name: "Priya",
    relationship: "best friend since college",
    monogram: "P",
    nextOccasion: { kind: "housewarming", date: "2026-07-11" },
    memories: [
      {
        id: "p_apt",
        date: "2026-02-14",
        type: "event",
        fact: "Closed on her first apartment — a tiny 1BR in Oakland with a south-facing window she's obsessed with. Finally feels like a 'real adult.'",
      },
      {
        id: "p_vegan",
        date: "2026-03-18",
        type: "preference",
        fact: "Fully vegan since January and strict about it; gets quietly hurt when people forget. Any food gift must be plant-based.",
      },
      {
        id: "p_plants",
        date: "2026-04-05",
        type: "wish",
        fact: "Killed three succulents in a row ('black thumb') but keeps buying plants — loves the greenery. Wants something impossible to kill.",
      },
      {
        id: "p_minimal",
        date: "2026-04-28",
        type: "dislike",
        fact: "Hates clutter and tchotchkes; strict minimalist Japandi aesthetic. Regifts decorative knickknacks immediately.",
      },
      {
        id: "p_knife",
        date: "2026-05-22",
        type: "relationship",
        status: "active",
        fact: "Eight years of monthly dinner parties; she always cooks an elaborate main and complains her one chef's knife is too dull to do it justice.",
      },
      {
        id: "p_oatmilk",
        date: "2026-06-09",
        type: "wish",
        fact: "Wants to make her own oat milk and fancy vegan lattes at home to save money; has been watching barista videos late at night.",
      },
    ],
  },
];

export function getPerson(id: string): Person | undefined {
  return PEOPLE.find((p) => p.id === id);
}

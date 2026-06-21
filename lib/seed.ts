import type { Person } from "./types";

/**
 * Seed people + dated memory histories. These are pre-ingested into HydraDB via the
 * real ingest path (genuine rows, not mocks) AND used as the demo-safe fallback.
 *
 * Money-shot person = Maya: a naive recommender surfaces her 2026-04-19 running-watch
 * wish; Sidekick recalls the EVOLVED state (injury 05-14 -> pottery 06-12) and proposes
 * a pottery course instead. `status: "superseded"` dims the retired running memories.
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
        id: "m_run1",
        date: "2026-03-08",
        type: "preference",
        status: "superseded",
        fact: "Three weeks into a 16-week Chicago Marathon block, 40+ mi/wk, obsessed with her Garmin pace; new carbon-plate Saucony shoes. Said running was 'the only thing keeping her sane.'",
      },
      {
        id: "m_run2",
        date: "2026-04-19",
        type: "wish",
        status: "superseded",
        fact: "Ran a half-marathon PR of 1:42 — 'the best she's felt in a year.' Wanted a GPS running watch (eyeing the Coros Pace) for her birthday.",
      },
      {
        id: "m_injury",
        date: "2026-05-14",
        type: "event",
        fact: "Tore her meniscus; orthopedist said no running for at least six months. Devastated — 'didn't know who she was without a training plan.'",
      },
      {
        id: "m_pot1",
        date: "2026-05-31",
        type: "preference",
        fact: "Signed up for a beginner pottery wheel class to fill the void. Throwing clay was 'weirdly meditative,' the only time her knee didn't hurt.",
      },
      {
        id: "m_pot2",
        date: "2026-06-12",
        type: "preference",
        status: "active",
        fact: "Now at the pottery studio 3x/week, has stopped talking about running entirely, fixated on glazes, sent six lopsided bowls, always runs out of clay. The studio sells gift cards.",
      },
      {
        id: "m_nofoam",
        date: "2026-06-16",
        type: "dislike",
        fact: "Hates 'recovery' gifts (foam rollers, compression sleeves) — they remind her she can't run yet and make her feel like an invalid.",
      },
      {
        id: "m_wool",
        date: "2026-02-02",
        type: "dislike",
        fact: "Allergic to wool — breaks out in a rash. No wool blankets, sweaters, or scarves, ever.",
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

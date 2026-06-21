/**
 * Nebius AI Studio client (server-only). The reasoning brain — turns recalled memories
 * into one specific, thoughtful gesture. OpenAI-compatible; base_url must end in /v1/.
 */
import OpenAI from "openai";
import type { WhatChanged } from "./types";

export function nebiusEnabled(): boolean {
  return Boolean(process.env.NEBIUS_API_KEY);
}

const MODEL = "meta-llama/Meta-Llama-3.1-70B-Instruct-fast"; // confirm via GET /v1/models

function nebius(): OpenAI {
  return new OpenAI({
    baseURL: process.env.NEBIUS_BASE_URL ?? "https://api.studio.nebius.ai/v1/",
    apiKey: process.env.NEBIUS_API_KEY!,
  });
}

export interface DraftedGesture {
  gift: string;
  message: string;
  citedMemoryIds: string[];
  whatChanged: WhatChanged | null;
  noticed: string | null;
}

/** Strip brackets/punctuation the model may add and keep only ids that really exist. */
function normalizeCitedIds(raw: unknown, knownIds: Set<string>): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const cleaned = item.replace(/[[\]]/g, "").trim().replace(/[.,;]+$/, "");
    if (knownIds.has(cleaned) && !out.includes(cleaned)) out.push(cleaned);
  }
  return out;
}

function clampPhrase(s: unknown, max: number): string {
  if (typeof s !== "string") return "";
  const t = s.trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

/** Keep the "What changed" band crisp and projector-safe, or null it so the demo never shows junk. */
function validateWhatChanged(wc: unknown): WhatChanged | null {
  if (!wc || typeof wc !== "object") return null;
  const w = wc as Record<string, unknown>;
  const from = clampPhrase(w.from, 24);
  const to = clampPhrase(w.to, 24);
  const changedAt =
    typeof w.changedAt === "string" && /^\d{4}-\d{2}-\d{2}$/.test(w.changedAt) ? w.changedAt : "";
  const retiredIdea = clampPhrase(w.retiredIdea, 48);
  if (!from || !to || !changedAt) return null;
  return { from, to, changedAt, retiredIdea };
}

export async function draftGesture(
  personName: string,
  occasion: string,
  memories: { id: string; date: string; fact: string }[],
  recalledHint: string[] = [],
): Promise<DraftedGesture> {
  const list = memories.map((m) => `[${m.id}] ${m.date}: ${m.fact}`).join("\n");
  const hint = recalledHint.length
    ? `\n\nHydraDB recalled these as most relevant (recency-weighted, most relevant first):\n- ${recalledHint
        .slice(0, 6)
        .join("\n- ")}`
    : "";

  const res = await nebius().chat.completions.create({
    model: MODEL,
    temperature: 0.7,
    max_tokens: 600,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          `You are Sidekick. Given DATED memories about one person, propose ONE concrete, thoughtful ${occasion} gift or gesture. ` +
          `Name the specific item/action, tie it to recent memories, and never suggest anything they dislike. ` +
          `If their taste or situation CHANGED over time, capture the shift in "whatChanged" with from/to as SHORT noun phrases (1-2 words each, e.g. "running" -> "pottery"). ` +
          `Respond with ONLY a JSON object of this shape: ` +
          `{"gift": string (<=160 chars), "message": string (warm card text <=220 chars), ` +
          `"citedMemoryIds": string[] (use the exact [id] tokens shown, e.g. "m_pot2"), ` +
          `"whatChanged": {"from": string (1-2 words), "to": string (1-2 words), "changedAt": "YYYY-MM-DD", "retiredIdea": string} | null, ` +
          `"noticed": string | null (a softer "what I noticed recently" when there is no clean from->to)}.`,
      },
      {
        role: "user",
        content: `Person: ${personName}\nOccasion: ${occasion}\nMemories:\n${list}${hint}\n\nReturn the JSON:`,
      },
    ],
  });

  const raw = res.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw);
  const knownIds = new Set(memories.map((m) => m.id));
  return {
    gift: typeof parsed.gift === "string" ? parsed.gift : "",
    message: typeof parsed.message === "string" ? parsed.message : "",
    citedMemoryIds: normalizeCitedIds(parsed.citedMemoryIds, knownIds),
    whatChanged: validateWhatChanged(parsed.whatChanged),
    noticed: typeof parsed.noticed === "string" ? parsed.noticed : null,
  };
}

/** OPTIONAL (cut first): Flux gift-card image. Returns null on any failure — never blocks. */
export async function giftCardImage(prompt: string): Promise<string | null> {
  try {
    const img: any = await nebius().images.generate({
      model: "black-forest-labs/flux-schnell", // verify exact id via GET /v1/models
      prompt,
      response_format: "url",
    });
    return img?.data?.[0]?.url ?? null;
  } catch {
    return null;
  }
}

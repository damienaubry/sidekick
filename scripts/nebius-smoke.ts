/**
 * Nebius smoke test — confirms the key + base_url + model produce a gift draft.
 * Run: npm run smoke:nebius   (needs NEBIUS_API_KEY in env)
 */
import "./_env";
import OpenAI from "openai";

async function main() {
  if (!process.env.NEBIUS_API_KEY) throw new Error("Set NEBIUS_API_KEY.");

  const nebius = new OpenAI({
    baseURL: process.env.NEBIUS_BASE_URL ?? "https://api.studio.nebius.ai/v1/",
    apiKey: process.env.NEBIUS_API_KEY,
  });

  const res = await nebius.chat.completions.create({
    model: "meta-llama/Meta-Llama-3.1-70B-Instruct-fast",
    temperature: 0.7,
    max_tokens: 300,
    messages: [
      {
        role: "system",
        content:
          "You are Sidekick. Propose ONE concrete, thoughtful gift tied to a specific memory. Under 80 words.",
      },
      {
        role: "user",
        content:
          "Person: Maya. Memories:\n- Apr 12: wanted an espresso grinder upgrade\n- Jun 12: switched coffee → matcha, raves about Ippodo, always runs out\n\nDraft the birthday gift:",
      },
    ],
  });

  console.log("\nNEBIUS DRAFT ->\n", res.choices[0]?.message?.content);
  console.log("\nPASS if you got a matcha-themed gift (not coffee/espresso gear).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

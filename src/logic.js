// QVAC Two Truths and a Lie Presenter — core logic.
// Given three statements (the user decides which are true/false — this app
// never judges or guesses), the model writes ONE playful intro line, and
// the three statements themselves are inserted verbatim, deterministically,
// by app code — never regenerated or rephrased by the model, so nothing
// gets dropped or altered.

import { completion } from "@qvac/sdk";

function looksUnusable(text) {
  if (!text || text.trim().length < 3) return true;
  if (text.length > 300) return true;
  const bad = [
    "i cannot", "i can't", "as an ai", "i'm not able", "i do not have",
    "i'm sorry", "i am sorry", "please provide more", "please try again",
    "i'd be happy to help", "could you provide", "can you provide",
    "the lie is", "i think the lie", "statement 1 is false", "statement 2 is false", "statement 3 is false",
  ];
  const lower = text.toLowerCase();
  return bad.some((phrase) => lower.includes(phrase));
}

function stripWrapping(text) {
  return text
    .trim()
    .replace(/^here'?s[^:\n]*:\s*/i, "")
    .replace(/^intro:\s*/i, "")
    .trim()
    .replace(/^["“]|["”]$/g, "")
    .trim();
}

const FALLBACK_INTRO = "Gather round — one of these three is a total lie, and it's your job to guess which!";

export async function generate(modelId, statements) {
  const run = completion({
    modelId,
    history: [
      {
        role: "system",
        content:
          "You write a single short, playful intro line (1 sentence) to kick off a game of 'Two Truths and a Lie'. " +
          "You are NEVER told which statement is true or false, and you must NEVER guess or judge — just write a fun, inviting intro line that sets up the game. " +
          "Reply with ONLY the intro line, no preamble, no statements repeated back.",
      },
      { role: "user", content: "Get the group ready to play." },
      { role: "assistant", content: "Three statements, one giant lie — let's see who can spot the fake!" },
      { role: "user", content: "Get the group ready to play." },
    ],
    stream: true,
    completionOpts: { temperature: 0.9, maxTokens: 80 },
  });

  let text = "";
  for await (const token of run.tokenStream) text += token;
  text = stripWrapping(text);

  const intro = looksUnusable(text) ? FALLBACK_INTRO : text;

  // The statements are never sent through the model for rewriting — they
  // are used exactly as the user typed them, guaranteeing none are dropped
  // or altered, and that the app never judges which is the lie.
  return { intro, statements };
}

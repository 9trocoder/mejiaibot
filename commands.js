// ==============================
// commands.js — Handle Slash Commands
// ==============================

import { PROMPTS } from "./prompts.js";

// Detect slash commands and return prompt
export function parseCommand(input) {
  if (!input.startsWith("/")) return null;

  const command = input.split(" ")[0].slice(1).toLowerCase();

  switch (command) {
    case "debug":
      return PROMPTS.debug + " " + input.replace("/debug", "").trim();
    case "explain":
      return PROMPTS.explain + " " + input.replace("/explain", "").trim();
    case "jamb":
      return PROMPTS.jamb + " " + input.replace("/jamb", "").trim();
    case "joke":
      return PROMPTS.joke;
    case "tip":
      return PROMPTS.tip;
    default:
      return null;
  }
}

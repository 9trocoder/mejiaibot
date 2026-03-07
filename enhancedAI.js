import { CONFIG } from "./config.js";

// Optional typing animation for AI responses
export function typeResponse(container, text, speed = 30) {
  container.textContent = "";
  let i = 0;
  const interval = setInterval(() => {
    container.textContent += text.charAt(i);
    i++;
    if (i >= text.length) clearInterval(interval);
    container.scrollIntoView({ behavior: "smooth", block: "end" });
  }, speed);
}

// Preprocess user input for clarity
export function preprocessInput(input) {
  return input
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s?.!]/g, ""); // remove strange chars
}

// Fetch AI response with enhanced error handling
export async function fetchAIResponse(model, messages) {
  try {
    const res = await fetch(CONFIG.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages }),
    });

    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    const data = await res.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error("AI fetch error:", err);
    return "⚠️ Something went wrong. Please try again.";
  }
}

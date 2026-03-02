// ==============================
// utils.js — Helper functions
// ==============================

// Copy any text to clipboard
export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

// Export chat history to .txt
export function exportHistory(session) {
  const content = session.messages
    .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join("\n\n");
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${session.title || "chat_history"}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

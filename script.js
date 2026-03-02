// ==============================
// script.js — Ultimate Version
// ==============================

import { CONFIG } from "./config.js";
import { PROMPTS } from "./prompts.js";
import { copyToClipboard, exportHistory } from "./utils.js";
import { parseCommand } from "./commands.js";

// ------------------------------
// DOM Elements
// ------------------------------
const chatContainer = document.getElementById("chat-container");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const modelSelect = document.getElementById("model-select");
const voiceBtn = document.getElementById("voice-btn");
const clearBtn = document.getElementById("clear-btn");
const themeBtn = document.getElementById("theme-btn");
const highlightLink = document.getElementById("highlight-theme");
const newChatBtn = document.querySelector(".new-chat-btn");
const historyList = document.querySelector(".history-list");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const sidebar = document.querySelector(".sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");

// ------------------------------
// State
// ------------------------------
let sessions = JSON.parse(localStorage.getItem("sessions")) || [];
let currentSessionId = localStorage.getItem("currentSessionId");
let chatHistory = [];

// Load current session if exists
if (currentSessionId) {
  const session = sessions.find((s) => s.id === currentSessionId);
  if (session) chatHistory = session.messages;
  else currentSessionId = null;
}

// ------------------------------
// SVG Icons
// ------------------------------
const SVG_USER = `<svg ...></svg>`; // keep your existing SVGs
const SVG_AI = `<svg ...></svg>`; 
const SVG_COPY = `<svg ...></svg>`;
const SVG_CHECK = `<svg ...></svg>`;
const SVG_SUN = `<svg ...></svg>`;
const SVG_MOON = `<svg ...></svg>`;
const SVG_TRASH = `<svg ...></svg>`;

// ------------------------------
// DOM Ready
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  marked.setOptions({
    highlight: function (code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
    breaks: true,
  });

  applyTheme(CONFIG.THEME_DEFAULT);
  renderHistory();
  renderSidebar();
});

// ------------------------------
// Render Chat History
// ------------------------------
function renderHistory() {
  chatContainer.innerHTML = "";
  if (chatHistory.length === 0) {
    chatContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-logo">${SVG_AI}</div>
        <h2>${CONFIG.CHAT_EMPTY_MESSAGE}</h2>
        <p>I can help you write code, debug issues, or explain complex topics.</p>
      </div>`;
    return;
  }

  chatHistory.forEach((msg) => appendMessageToDOM(msg.role, msg.content));
  scrollToBottom();
}

// ------------------------------
// Render Sidebar
// ------------------------------
function renderSidebar() {
  historyList.innerHTML = "";
  if (sessions.length === 0) {
    const empty = document.createElement("div");
    empty.className = "history-item";
    empty.textContent = "No previous chats";
    empty.style.cursor = "default";
    empty.style.opacity = "0.5";
    historyList.appendChild(empty);
    return;
  }

  sessions.forEach((session) => {
    const item = document.createElement("div");
    item.className = "history-item";
    if (session.id === currentSessionId) item.classList.add("active");

    const titleSpan = document.createElement("span");
    titleSpan.className = "history-title";
    titleSpan.textContent = session.title;
    item.appendChild(titleSpan);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-chat-btn";
    deleteBtn.innerHTML = SVG_TRASH;
    deleteBtn.title = "Delete chat";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteSession(session.id);
    });
    item.appendChild(deleteBtn);

    item.addEventListener("click", () => loadSession(session.id));
    historyList.appendChild(item);
  });
}

// ------------------------------
// Load / Delete Session
// ------------------------------
function loadSession(id) {
  currentSessionId = id;
  localStorage.setItem("currentSessionId", id);
  const session = sessions.find((s) => s.id === id);
  chatHistory = session ? session.messages : [];
  renderHistory();
  renderSidebar();
}

function deleteSession(id) {
  if (!confirm("Delete this chat?")) return;
  sessions = sessions.filter((s) => s.id !== id);
  localStorage.setItem("sessions", JSON.stringify(sessions));
  if (currentSessionId === id) startNewChat();
  else renderSidebar();
}

function startNewChat() {
  currentSessionId = null;
  localStorage.removeItem("currentSessionId");
  chatHistory = [];
  renderHistory();
  renderSidebar();
  userInput.focus();
}

// ------------------------------
// Append Message to DOM
// ------------------------------
function appendMessageToDOM(role, text) {
  const msgRow = document.createElement("div");
  msgRow.className = `message-row ${role}`;

  const innerDiv = document.createElement("div");
  innerDiv.className = "message-inner";

  const contentDiv = document.createElement("div");
  contentDiv.className = "content";

  if (role === "ai") {
    contentDiv.innerHTML = marked.parse(text);

    // Copy buttons for code blocks
    contentDiv.querySelectorAll("pre").forEach((pre) => {
      const code = pre.querySelector("code");
      if (!code) return;
      const btn = document.createElement("button");
      btn.className = "copy-code-btn";
      btn.innerHTML = `${SVG_COPY} Copy code`;
      btn.addEventListener("click", () => {
        copyToClipboard(code.textContent).then(() => {
          btn.innerHTML = `${SVG_CHECK} Copied!`;
          setTimeout(() => (btn.innerHTML = `${SVG_COPY} Copy code`), 2000);
        });
      });
      pre.appendChild(btn);
    });

    // Copy full message
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "message-actions";
    const copyMsgBtn = document.createElement("button");
    copyMsgBtn.className = "msg-copy-btn";
    copyMsgBtn.innerHTML = SVG_COPY;
    copyMsgBtn.title = "Copy response";
    copyMsgBtn.addEventListener("click", () => {
      copyToClipboard(text).then(() => {
        copyMsgBtn.innerHTML = SVG_CHECK;
        setTimeout(() => (copyMsgBtn.innerHTML = SVG_COPY), 2000);
      });
    });
    actionsDiv.appendChild(copyMsgBtn);
    contentDiv.appendChild(actionsDiv);
  } else {
    contentDiv.textContent = text;
  }

  innerDiv.appendChild(contentDiv);
  msgRow.appendChild(innerDiv);
  chatContainer.appendChild(msgRow);

  if (role === "ai") contentDiv.querySelectorAll("pre code").forEach((block) => hljs.highlightElement(block));

  scrollToBottom();
}

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ------------------------------
// Handle Chat
// ------------------------------
async function handleChat() {
  let text = userInput.value.trim();
  if (!text) return;

  // Check slash commands
  const cmdPrompt = parseCommand(text);
  if (cmdPrompt) text = cmdPrompt;

  addMessage("user", text);
  userInput.value = "";
  userInput.style.height = "50px";

  const loadingId = "loading-" + Date.now();
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "message-row ai";
  loadingDiv.id = loadingId;
  loadingDiv.innerHTML = `<div class="message-inner"><div class="content">Thinking...<span class="cursor"></span></div></div>`;
  chatContainer.appendChild(loadingDiv);
  scrollToBottom();

  try {
    const messages = chatHistory
      .filter(msg => !msg.content.startsWith("Error:") && !msg.content.startsWith("⚠️"))
      .map(msg => ({ role: msg.role === "user" ? "user" : "assistant", content: msg.content }));

    const response = await fetch(CONFIG.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: modelSelect.value || CONFIG.DEFAULT_MODEL, messages }),
    });

    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) loadingElement.remove();

    if (!response.ok) {
      let errMsg = `API Error: ${response.status}`;
      try { const errData = await response.json(); errMsg = errData.error?.message || errMsg; } catch {}
      throw new Error(errMsg);
    }

    const data = await response.json();
    if (data.error) throw new Error(data.error?.message || "Unknown API error");
    if (data.choices && data.choices[0]) addMessage("ai", data.choices[0].message.content);

  } catch (error) {
    console.error("Network Error Details:", error);
    appendMessageToDOM("ai", `⚠️ **Error:** ${error.message}`);
  }
}

// ------------------------------
// Add Message to State
// ------------------------------
function addMessage(role, content) {
  const newMessage = { role, content };
  chatHistory.push(newMessage);

  if (!currentSessionId) {
    currentSessionId = Date.now().toString();
    localStorage.setItem("currentSessionId", currentSessionId);

    const title = content.length > 30 ? content.substring(0, 30) + "..." : content;
    sessions.unshift({ id: currentSessionId, title, messages: chatHistory });
  } else {
    const session = sessions.find((s) => s.id === currentSessionId);
    if (session) session.messages = chatHistory;
  }

  localStorage.setItem("sessions", JSON.stringify(sessions));
  appendMessageToDOM(role, content);
  renderSidebar();
}

// ------------------------------
// Theme Handling
// ------------------------------
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  if (highlightLink) {
    highlightLink.href = theme === "light"
      ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css"
      : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css";
  }

  if (themeBtn) themeBtn.innerHTML = theme === "light" ? SVG_MOON : SVG_SUN;
}

// ------------------------------
// Event Listeners
// ------------------------------
sendBtn.addEventListener("click", handleChat);

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleChat();
  }
});

userInput.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
  if (this.value === "") this.style.height = "50px";
});

clearBtn.addEventListener("click", () => {
  if (!confirm("Are you sure you want to clear the chat history?")) return;
  chatHistory = [];
  if (currentSessionId) {
    const session = sessions.find((s) => s.id === currentSessionId);
    if (session) session.messages = [];
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }
  renderHistory();
});

themeBtn.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  applyTheme(currentTheme === "light" ? "dark" : "light");
});

if (newChatBtn) newChatBtn.addEventListener("click", startNewChat);

if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  sidebarOverlay.classList.toggle("active");
});

if (sidebarOverlay) sidebarOverlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("active");
});

// ------------------------------
// Speech Recognition
// ------------------------------
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";

  voiceBtn.addEventListener("click", () => {
    if (voiceBtn.classList.contains("listening")) recognition.stop();
    else { recognition.start(); voiceBtn.classList.add("listening"); userInput.placeholder = "Listening..."; }
  });

  recognition.onresult = (event) => { userInput.value = event.results[0][0].transcript; };
  recognition.onerror = (event) => console.error("Speech recognition error", event.error);
  recognition.onend = () => { voiceBtn.classList.remove("listening"); userInput.placeholder = "Send a message..."; };
} else voiceBtn.style.display = "none";

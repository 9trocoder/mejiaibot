// adding  url
// declaration of variables
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

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

let sessions = JSON.parse(localStorage.getItem("sessions")) || [];
let currentSessionId = localStorage.getItem("currentSessionId");
let chatHistory = [];

// load current session if exists
if (currentSessionId) {
  const session = sessions.find((s) => s.id === currentSessionId);
  if (session) {
    chatHistory = session.messages;
  } else {
    currentSessionId = null;
  }
}

// svg icons for the app
const SVG_USER = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
const SVG_AI = `<svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`;
const SVG_COPY = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`;
const SVG_CHECK = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const SVG_SUN = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
const SVG_MOON = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
const SVG_TRASH = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

document.addEventListener("DOMContentLoaded", () => {
  // Configure Marked.js options
  marked.setOptions({
    highlight: function (code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
    breaks: true, // Enable line breaks
  });

  // Apply saved theme
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  // Render existing history
  renderHistory();

  // Render Sidebar
  renderSidebar();
});

// 1. Render Chat History
function renderHistory() {
  // Clear current view (except the initial greeting if history is empty)
  chatContainer.innerHTML = "";

  if (chatHistory.length === 0) {
    chatContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-logo">${SVG_AI}</div>
                <h2>How can I help you today?</h2>
                <p>I can help you write code, debug issues, or explain complex topics.</p>
            </div>`;
    return;
  }

  chatHistory.forEach((msg) => {
    appendMessageToDOM(msg.role, msg.content);
  });
  scrollToBottom();
}

// 2. Render Sidebar
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

    if (session.id === currentSessionId) {
      item.classList.add("active");
    }
    item.addEventListener("click", () => loadSession(session.id));
    historyList.appendChild(item);
  });
}

// 3. Load Specific Session
function loadSession(id) {
  currentSessionId = id;
  localStorage.setItem("currentSessionId", id);
  const session = sessions.find((s) => s.id === id);
  chatHistory = session ? session.messages : [];
  renderHistory();
  renderSidebar();
}

// 4. Start New Chat
function startNewChat() {
  currentSessionId = null;
  localStorage.removeItem("currentSessionId");
  chatHistory = [];
  renderHistory();
  renderSidebar();
  userInput.focus();
}

// 5. Delete Session
function deleteSession(id) {
  if (confirm("Delete this chat?")) {
    sessions = sessions.filter((s) => s.id !== id);
    localStorage.setItem("sessions", JSON.stringify(sessions));

    if (currentSessionId === id) {
      startNewChat();
    } else {
      renderSidebar();
    }
  }
}

// 2. Append Message to DOM
function appendMessageToDOM(role, text) {
  const msgRow = document.createElement("div");
  msgRow.className = `message-row ${role}`;

  const innerDiv = document.createElement("div");
  innerDiv.className = "message-inner";

  const contentDiv = document.createElement("div");
  contentDiv.className = "content";

  // Render Markdown for AI, Plain text for User
  if (role === "ai") {
    contentDiv.innerHTML = marked.parse(text);

    // 1. Add Copy Button to Code Blocks
    contentDiv.querySelectorAll("pre").forEach((pre) => {
      const code = pre.querySelector("code");
      if (!code) return;

      const btn = document.createElement("button");
      btn.className = "copy-code-btn";
      btn.innerHTML = `${SVG_COPY} Copy code`;
      btn.addEventListener("click", () => {
        navigator.clipboard.writeText(code.textContent).then(() => {
          btn.innerHTML = `${SVG_CHECK} Copied!`;
          setTimeout(() => (btn.innerHTML = `${SVG_COPY} Copy code`), 2000);
        });
      });
      pre.appendChild(btn);
    });

    // 2. Add Copy Button to Message Content
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "message-actions";
    const copyMsgBtn = document.createElement("button");
    copyMsgBtn.className = "msg-copy-btn";
    copyMsgBtn.innerHTML = SVG_COPY;
    copyMsgBtn.title = "Copy response";
    copyMsgBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(text).then(() => {
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

  // Trigger syntax highlighting for new code blocks
  if (role === "ai") {
    contentDiv.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);
    });
  }

  scrollToBottom();
}

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 3. Handle API Interaction
async function handleChat() {
  const text = userInput.value.trim();

  console.log(CONFIG.API_KEY);
  if (!text) return;

  // 1. Add User Message
  addMessage("user", text);
  userInput.value = "";
  userInput.style.height = "50px"; // Reset height

  // 2. Show Loading State
  const loadingId = "loading-" + Date.now();
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "message-row ai";
  loadingDiv.id = loadingId;
  loadingDiv.innerHTML = `
        <div class="message-inner">
            <div class="content">Thinking...<span class="cursor"></span></div>
        </div>
    `;
  chatContainer.appendChild(loadingDiv);
  scrollToBottom();

  try {
    // Prepare API Payload
    // We map our history to the format OpenAI/OpenRouter expects
    const messages = chatHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    const selectedModel = modelSelect.value;
    console.log("Attempting to fetch with model:", selectedModel);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CONFIG.API_KEY}`,
        "Content-Type": "application/json",
        // OpenRouter specific headers
        "HTTP-Referer": "http://localhost:3000", // Safer for local testing
        "X-Title": "My AI Chatbot",
      },
      body: JSON.stringify({
        model: modelSelect.value,
        messages: messages,
      }),
    });

    const data = await response.json();

    // Remove loading spinner
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) loadingElement.remove();

    if (!response.ok || data.error) {
      console.error("API Error Details:", data);
      throw new Error(data.error?.message || `API Error: ${response.status}`);
    }

    if (data.choices && data.choices[0]) {
      const aiResponse = data.choices[0].message.content;
      addMessage("ai", aiResponse);
    }
  } catch (error) {
    console.error("Network Error Details:", error);
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) loadingElement.remove();
    addMessage("ai", `Error: ${error.message}`);
  }
}

// 4. Add Message to State & Storage
function addMessage(role, content) {
  const newMessage = { role, content };
  chatHistory.push(newMessage);

  if (!currentSessionId) {
    // Create new session
    currentSessionId = Date.now().toString();
    localStorage.setItem("currentSessionId", currentSessionId);

    // Generate title from first user message
    let title =
      content.length > 30 ? content.substring(0, 30) + "..." : content;

    const newSession = {
      id: currentSessionId,
      title: title,
      messages: chatHistory,
    };
    sessions.unshift(newSession);
  } else {
    // Update existing session
    const session = sessions.find((s) => s.id === currentSessionId);
    if (session) session.messages = chatHistory;
  }

  localStorage.setItem("sessions", JSON.stringify(sessions));
  appendMessageToDOM(role, content);
  renderSidebar();
}

// 5. Theme Handling
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  // Update Highlight.js Theme
  const themeUrl =
    theme === "light"
      ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css"
      : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css";
  if (highlightLink) highlightLink.href = themeUrl;

  // Update Button Icon
  if (themeBtn) themeBtn.innerHTML = theme === "light" ? SVG_MOON : SVG_SUN;
}

// Send Button
sendBtn.addEventListener("click", handleChat);

// Enter Key (Shift+Enter for new line)
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleChat();
  }
});

// Auto-resize Textarea
userInput.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
  if (this.value === "") this.style.height = "50px";
});

// Clear History
clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear the chat history?")) {
    chatHistory = [];
    if (currentSessionId) {
      const session = sessions.find((s) => s.id === currentSessionId);
      if (session) session.messages = [];
      localStorage.setItem("sessions", JSON.stringify(sessions));
    }
    renderHistory();
  }
});

// Theme Toggle
themeBtn.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(newTheme);
});

// New Chat
if (newChatBtn) {
  newChatBtn.addEventListener("click", startNewChat);
}

// Mobile Menu Toggle
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    sidebarOverlay.classList.toggle("active");
  });
}

// Close Sidebar on Overlay Click
if (sidebarOverlay) {
  sidebarOverlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("active");
  });
}

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";

  voiceBtn.addEventListener("click", () => {
    if (voiceBtn.classList.contains("listening")) {
      recognition.stop();
    } else {
      recognition.start();
      voiceBtn.classList.add("listening");
      userInput.placeholder = "Listening...";
    }
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
    // Optional: Auto-send
    // handleChat();
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error", event.error);
  };

  recognition.onend = () => {
    voiceBtn.classList.remove("listening");
    userInput.placeholder = "Send a message...";
  };
} else {
  console.log("Web Speech API not supported in this browser.");
  voiceBtn.style.display = "none";
}

// adding api key and url
// declaration of variables
const API_KEY =
  "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";
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

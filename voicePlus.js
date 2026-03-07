import { fetchAIResponse, preprocessInput, typeResponse } from "./enhancedAI.js";
import { userInput, chatContainer, modelSelect } from "./script.js"; // adjust if needed

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export class VoicePlus {
  constructor() {
    if (!SpeechRecognition) {
      console.warn("Web Speech API not supported in this browser.");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.lang = "en-US"; // default, can be changed dynamically
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.initEvents();
  }

  initEvents() {
    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const processed = preprocessInput(transcript);
      userInput.value = processed;
      userInput.focus();
      // optional: auto-send
      // handleChat();
    };

    this.recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
    };

    this.recognition.onend = () => {
      console.log("Voice recognition ended.");
    };
  }

  start() {
    this.recognition.start();
    console.log("VoicePlus listening...");
  }

  stop() {
    this.recognition.stop();
    console.log("VoicePlus stopped.");
  }

  setLanguage(langCode) {
    this.recognition.lang = langCode;
  }

  // Optional: Smart voice command detection
  async handleCommand(transcript) {
    const cmd = transcript.toLowerCase();
    if (cmd.includes("clear chat")) {
      chatContainer.innerHTML = "";
      console.log("Chat cleared via voice.");
      return true;
    }
    if (cmd.includes("export chat")) {
      // assume exportChat imported from utils.js
      exportChat(window.chatHistory || []);
      console.log("Chat exported via voice.");
      return true;
    }
    return false;
  }
}

// Usage Example
// const vp = new VoicePlus();
// vp.start();

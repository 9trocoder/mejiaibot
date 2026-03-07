export class AnalyticsTracker {
  constructor() {
    this.startTime = null;
    this.sessionEvents = [];
  }

  startSession() {
    this.startTime = Date.now();
    this.sessionEvents = [];
    console.log("Analytics session started.");
  }

  logEvent(eventType, details = {}) {
    const timestamp = Date.now();
    this.sessionEvents.push({ eventType, details, timestamp });
    console.log(`[Analytics] ${eventType}`, details);
  }

  logUserMessage(message) {
    this.logEvent("user_message", { message });
  }

  logAIResponse(message, responseTime) {
    this.logEvent("ai_response", { message, responseTime });
  }

  getSessionDuration() {
    if (!this.startTime) return 0;
    return Date.now() - this.startTime;
  }

  exportAnalytics() {
    const blob = new Blob([JSON.stringify(this.sessionEvents, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    console.log("Analytics exported.");
  }
}

// Usage Example
// const tracker = new AnalyticsTracker();
// tracker.startSession();
// tracker.logUserMessage("Hello");
// tracker.logAIResponse("Hi, how can I help?", 123);

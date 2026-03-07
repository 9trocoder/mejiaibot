class ContextManager {
  constructor() {
    this.history = [];
  }

  addMessage(role, content) {
    this.history.push({ role, content });

    if (this.history.length > 10) {
      this.history.shift();
    }
  }

  getContext() {
    return this.history;
  }
}

module.exports = new ContextManager();

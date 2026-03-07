export class ThemeManager {
  constructor(defaultTheme = "dark") {
    this.currentTheme = localStorage.getItem("theme") || defaultTheme;
    this.applyTheme(this.currentTheme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    this.currentTheme = theme;
    localStorage.setItem("theme", theme);

    // Smooth transition for background & text
    document.documentElement.style.transition = "background 0.3s, color 0.3s";

    // Optional: update syntax highlighting
    const highlightLink = document.getElementById("highlight-theme");
    if (highlightLink) {
      highlightLink.href =
        theme === "light"
          ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css"
          : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css";
    }

    console.log(`Theme applied: ${theme}`);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.applyTheme(newTheme);
  }

  setCustomTheme(customColors) {
    Object.keys(customColors).forEach((prop) => {
      document.documentElement.style.setProperty(`--${prop}`, customColors[prop]);
    });
    console.log("Custom theme applied:", customColors);
  }
}

// Usage Example
// const tm = new ThemeManager();
// tm.toggleTheme();
// tm.setCustomTheme({ "bg-color": "#111", "text-color": "#eee" });

const modes = {
  fast: "Give a concise answer.",
  deep: "Provide step-by-step reasoning.",
  research: "Provide an analytical explanation with multiple perspectives."
};

function getMode(mode) {
  return modes[mode] || modes.fast;
}

module.exports = getMode;

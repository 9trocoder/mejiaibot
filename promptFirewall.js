function detectPromptAttack(input) {

  const attackPatterns = [
    "ignore previous instructions",
    "reveal system prompt",
    "bypass restrictions",
    "pretend you are"
  ];

  for (let pattern of attackPatterns) {
    if (input.toLowerCase().includes(pattern)) {
      return true;
    }
  }

  return false;
}

module.exports = detectPromptAttack;

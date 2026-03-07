function scoreResponse(text) {

  let score = 0;

  if (text.length > 50) score += 1;
  if (text.includes("Step")) score += 1;
  if (text.includes("because")) score += 1;

  return score;
}

module.exports = scoreResponse;

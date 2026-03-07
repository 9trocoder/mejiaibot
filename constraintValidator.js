function checkConstraints(prompt, response) {
  const issues = [];

  if (prompt.includes("exactly") && !response.match(/\bexactly\b/i)) {
    issues.push("Possible constraint violation.");
  }

  if (prompt.includes("step") && !response.includes("Step")) {
    issues.push("Missing step-by-step reasoning.");
  }

  return issues;
}

module.exports = checkConstraints;

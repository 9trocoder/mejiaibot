function logMetrics(prompt, response, issues) {

  const log = {
    timestamp: new Date(),
    promptLength: prompt.length,
    responseLength: response.length,
    issuesDetected: issues.length
  };

  console.log("AI Metrics:", log);
}

module.exports = logMetrics;

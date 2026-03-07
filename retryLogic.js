async function retryIfBadResponse(llmCall, retries = 2) {
  for (let i = 0; i < retries; i++) {
    const result = await llmCall();

    if (result && result.length > 10) {
      return result;
    }
  }

  return "I'm unable to produce a reliable answer right now.";
}

module.exports = retryIfBadResponse;

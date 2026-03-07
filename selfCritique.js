async function selfCritique(llm, prompt, response) {
  const critiquePrompt = `
You are an AI reviewer.

User Prompt:
${prompt}

AI Response:
${response}

Evaluate:
1. Is the reasoning logically consistent?
2. Did the response violate any instructions?
3. Is there any hallucination risk?

Answer only with:
PASS
or
FAIL with explanation.
`;

  const review = await llm.generate(critiquePrompt);

  return review;
}

module.exports = selfCritique;

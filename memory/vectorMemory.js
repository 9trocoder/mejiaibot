import knowledge from "./knowledgeBase.json" assert { type: "json" };

function findRelevantContext(prompt) {

  const lowerPrompt = prompt.toLowerCase();

  for (let item of knowledge) {
    if (lowerPrompt.includes(item.topic)) {
      return item.content;
    }
  }

  return null;
}

export default findRelevantContext;

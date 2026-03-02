export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get the key from Vercel Environment Variables
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "Server Configuration Error: Missing API Key" });
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": req.headers.referer || "https://mejiaibot.vercel.app",
          "X-Title": "MejiAI Bot",
        },
        body: JSON.stringify(req.body),
      },
    );

    const data = await response.json();

    // Forward the status and data from OpenRouter to your frontend
    res.status(response.status).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

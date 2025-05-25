import axios from "axios";

export async function generateWithOllama(prompt: string, code: string, model = "phi", user = "admin"): Promise<string> {
  try {
    const fullPrompt = `${prompt}\n\n\`\`\`\n${code}\n\`\`\``;
    const response = await axios.post("http://localhost:11434/api/generate", {
      model,
      prompt: fullPrompt,
      stream: false,
      user
    });
    return response.data.response.trim();
  } catch (err: any) {
    console.error("❌ Ollama generation failed:", err.response?.data || err.message);
    throw err;
  }
}


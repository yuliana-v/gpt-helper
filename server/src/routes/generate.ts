import { Router } from "express";
import { generateWithOllama } from "../services/ollamaService";
import { logHistory } from "../services/historyService";
import { GenerationRequest } from "../types";
import { verifyFirebaseToken } from '../middleware/authMiddleware';


const router = Router();

router.post("/", verifyFirebaseToken, async (req, res) => {
  console.log("user:", req);
  const data = req.body as GenerationRequest;
  const { user, ...rest } = data;
  const userId = (req as any).user?.uid;

  try {
    const result = await generateWithOllama(data.prompt, data.code, data.model, data.user);
    await logHistory({ user: userId, ...rest, result });
    res.json({ result });
  } catch (error) {
    console.error("Generation failed:", error);
    res.status(500).json({ error: "Failed to generate content." });
  }
});

export default router;

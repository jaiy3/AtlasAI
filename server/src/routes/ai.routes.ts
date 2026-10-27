import { Router } from "express";
import { z } from "zod";
import { askPortfolioAI } from "../services/ai.service";

const router = Router();

const askSchema = z.object({
  question: z.string().trim().min(1, "A question is required").max(500),
  portfolio: z.unknown().optional(),
});

router.post("/portfolio", async (req, res) => {
  const parsed = askSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid request",
    });
  }

  try {
    const answer = await askPortfolioAI(
      parsed.data.question,
      parsed.data.portfolio
    );

    return res.status(200).json({ success: true, data: { answer } });
  } catch (error) {
    console.error("AI error:", error);
    return res.status(502).json({
      success: false,
      message: "Unable to process AI request",
    });
  }
});

export default router;

import { Router } from "express";
import { askPortfolioAI } from "../services/ai.service";

const router = Router();

router.post("/portfolio", async (req, res) => {
  try {
    const { question, portfolio } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({
        success: false,
        message: "A question is required",
      });
    }

    const answer = await askPortfolioAI(
      question,
      portfolio
    );

    return res.status(200).json({
      success: true,
      data: {
        answer,
      },
    });
  } catch (error) {
    console.error("AI error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process AI request",
    });
  }
});

export default router;
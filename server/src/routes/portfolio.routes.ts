import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getPortfolio } from "../services/portfolio.service";

const router = Router();

router.get("/:address", authenticate, async (req, res) => {
  try {
    const address = req.params.address as `0x${string}`;

    const portfolio = await getPortfolio(address);

    return res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch portfolio";

    return res.status(500).json({
      success: false,
      message,
    });
  }
});

export default router;
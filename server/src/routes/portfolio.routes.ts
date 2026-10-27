import { Router } from "express";
import { isAddress } from "viem";
import { authenticate } from "../middleware/auth.middleware";
import { getPortfolio } from "../services/portfolio.service";

const router = Router();

router.get("/:address", authenticate, async (req, res) => {
  const address = String(req.params.address);

  if (!isAddress(address)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Ethereum address",
    });
  }

  try {
    const portfolio = await getPortfolio(address);
    return res.status(200).json({ success: true, data: portfolio });
  } catch (error) {
    console.error("Portfolio request failed:", error);
    return res.status(502).json({
      success: false,
      message: "Unable to load portfolio from the data provider",
    });
  }
});

export default router;

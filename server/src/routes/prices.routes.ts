import { Router } from "express";
import { getTokenPrices } from "../services/prices.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const symbolsParam = req.query.symbols;

    if (typeof symbolsParam !== "string") {
      return res.status(400).json({
        success: false,
        message: "Symbols are required",
      });
    }

    const symbols = symbolsParam
      .split(",")
      .map((symbol) => symbol.trim().toUpperCase())
      .filter(Boolean);

    if (symbols.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one symbol is required",
      });
    }

    const prices = await getTokenPrices(symbols);

    return res.status(200).json({
      success: true,
      data: prices,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch token prices",
    });
  }
});

export default router;
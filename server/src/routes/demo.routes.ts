import { Router } from "express";
import { isAddress } from "viem";
import { getPortfolio, type Portfolio } from "../services/portfolio.service";

/**
 * Public, read-only demo: the portfolio of a well-known public wallet, so
 * visitors can explore the product without signing up or connecting a wallet.
 * Cached for five minutes to keep upstream API usage flat regardless of traffic.
 */
const DEMO_WALLET = (process.env.DEMO_WALLET_ADDRESS ??
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045") as `0x${string}`;
const DEMO_LABEL = process.env.DEMO_WALLET_LABEL ?? "vitalik.eth";
const CACHE_MS = 5 * 60 * 1000;

let cache: { data: Portfolio; expiresAt: number } | null = null;
let inFlight: Promise<Portfolio> | null = null;

const router = Router();

router.get("/portfolio", async (_req, res) => {
  if (!isAddress(DEMO_WALLET)) {
    return res.status(500).json({ success: false, message: "Demo wallet misconfigured" });
  }

  try {
    if (!cache || cache.expiresAt < Date.now()) {
      // Coalesce concurrent cache misses into one upstream request.
      inFlight ??= getPortfolio(DEMO_WALLET).finally(() => {
        inFlight = null;
      });
      cache = { data: await inFlight, expiresAt: Date.now() + CACHE_MS };
    }

    res.setHeader("Cache-Control", "public, max-age=60");
    return res.json({ success: true, data: { ...cache.data, label: DEMO_LABEL, demo: true } });
  } catch (error) {
    console.error("Demo portfolio failed:", error);
    return res.status(502).json({ success: false, message: "Demo data is temporarily unavailable" });
  }
});

export default router;

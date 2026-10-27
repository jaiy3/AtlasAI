import express from "express";
import cors from "cors";

import authRoutes from "./auth/auth.routes";
import portfolioRoutes from "./routes/portfolio.routes";
import pricesRoutes from "./routes/prices.routes";
import aiRoutes from "./routes/ai.routes";
import demoRoutes from "./routes/demo.routes";
import { rateLimit } from "./middleware/rate-limit.middleware";

const app = express();

// Behind one proxy on Render/Railway; needed for correct client IPs in rate limiting.
app.set("trust proxy", 1);

const allowedOrigins = process.env.CLIENT_ORIGIN?.split(",").map((o) => o.trim());
app.use(cors(allowedOrigins ? { origin: allowedOrigins } : undefined));
app.use(express.json({ limit: "200kb" }));

app.get("/", (_req, res) => {
  res.json({ success: true, service: "AtlasAI API" });
});

app.get("/health", (_req, res) => {
  res.json({ success: true, status: "ok" });
});

app.use(
  "/api/auth",
  rateLimit({ windowMs: 15 * 60_000, max: 30, message: "Too many authentication attempts" }),
  authRoutes
);
app.use(
  "/api/prices",
  rateLimit({ windowMs: 60_000, max: 60, message: "Too many price requests" }),
  pricesRoutes
);
app.use("/api/portfolio", portfolioRoutes);
app.use(
  "/api/demo",
  rateLimit({ windowMs: 60_000, max: 30, message: "Too many demo requests" }),
  demoRoutes
);
app.use(
  "/api/ai",
  rateLimit({ windowMs: 10 * 60_000, max: 10, message: "AI request limit reached. Try again in a few minutes." }),
  aiRoutes
);

export default app;

import express from "express";
import cors from "cors";

import authRoutes from "./auth/auth.routes";
import portfolioRoutes from "./routes/portfolio.routes";
import pricesRoutes from "./routes/prices.routes";

import aiRoutes from "./routes/ai.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AtlasAI Backend Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/prices", pricesRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/ai", aiRoutes);

export default app;
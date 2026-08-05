import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("AtlasAI Backend Running 🚀");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
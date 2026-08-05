const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("AtlasAI Backend Running 🚀");
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
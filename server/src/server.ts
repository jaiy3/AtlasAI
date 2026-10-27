import "dotenv/config";
import app from "./app";
import { getJwtSecret } from "./config/secrets";

// Fail fast on missing configuration instead of at the first login.
getJwtSecret();

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`AtlasAI API listening on port ${PORT}`);
});

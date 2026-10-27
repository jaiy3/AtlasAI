/**
 * Reads a required secret from the environment and fails fast if it is missing.
 * A hard-coded fallback secret would let anyone forge valid JWTs in production.
 */
export const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
};

export const getJwtSecret = () => requireEnv("JWT_SECRET");

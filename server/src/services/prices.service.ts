export type TokenPrice = {
  symbol: string;
  price: string | null;
  lastUpdatedAt: string | null;
};

export const getTokenPrices = async (
  symbols: string[]
): Promise<TokenPrice[]> => {
  const apiKey = process.env.ALCHEMY_API_KEY;

  if (!apiKey) {
    throw new Error("Alchemy API key is not configured");
  }

  const params = new URLSearchParams();

  symbols.forEach((symbol) => {
    params.append("symbols", symbol);
  });

  const response = await fetch(
    `https://api.g.alchemy.com/prices/v1/${apiKey}/tokens/by-symbol?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch token prices");
  }

  const data = await response.json();

  return (data.data ?? []).map(
    (token: {
      symbol: string;
      prices?: {
        currency: string;
        value: string;
        lastUpdatedAt: string;
      }[];
    }) => {
      const usdPrice = token.prices?.find(
        (price) => price.currency.toLowerCase() === "usd"
      );

      return {
        symbol: token.symbol,
        price: usdPrice?.value ?? null,
        lastUpdatedAt: usdPrice?.lastUpdatedAt ?? null,
      };
    }
  );
};
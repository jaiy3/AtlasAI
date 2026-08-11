import api from "./api";

export type TokenPrice = {
  symbol: string;
  price: string | null;
  lastUpdatedAt: string | null;
};

export const getTokenPrices = async (
  symbols: string[]
) => {
  const response = await api.get("/prices", {
    params: {
      symbols: symbols.join(","),
    },
  });

  return response.data.data as TokenPrice[];
};
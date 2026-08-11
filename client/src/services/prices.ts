import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:3001/api",
});

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
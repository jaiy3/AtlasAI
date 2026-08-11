import OpenAI from "openai";
import { getTokenPrices } from "./prices.service";

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  throw new Error("OPENROUTER_API_KEY is not configured");
}

const openrouter = new OpenAI({
  apiKey,
  baseURL: "https://openrouter.ai/api/v1",
});

const symbolAliases: Record<string, string> = {
  bitcoin: "BTC",
  btc: "BTC",

  ethereum: "ETH",
  ether: "ETH",
  eth: "ETH",

  solana: "SOL",
  sol: "SOL",

  usdcoin: "USDC",
  "usd coin": "USDC",
  usdc: "USDC",

  tether: "USDT",
  "tether usd": "USDT",
  usdt: "USDT",

  binance: "BNB",
  "binance coin": "BNB",
  bnb: "BNB",

  xrp: "XRP",

  cardano: "ADA",
  ada: "ADA",

  dogecoin: "DOGE",
  doge: "DOGE",

  polygon: "POL",
  matic: "POL",
  pol: "POL",

  chainlink: "LINK",
  link: "LINK",

  avalanche: "AVAX",
  avax: "AVAX",
};

const getRelevantSymbols = (question: string): string[] => {
  const normalizedQuestion = question.toLowerCase();

  const symbols = Object.entries(symbolAliases)
    .filter(([name]) => normalizedQuestion.includes(name))
    .map(([, symbol]) => symbol);

  return [...new Set(symbols)];
};

export const askPortfolioAI = async (
  question: string,
  portfolio: unknown
) => {
  const relevantSymbols = getRelevantSymbols(question);

  let marketData: unknown[] = [];

  if (relevantSymbols.length > 0) {
    try {
      marketData = await getTokenPrices(relevantSymbols);
    } catch (error) {
      console.error(
        "Failed to fetch market data for AI:",
        error
      );
    }
  }

  const response = await openrouter.chat.completions.create({
    model: "openrouter/free",

    messages: [
      {
        role: "system",
        content: `
You are AtlasAI, an AI assistant for cryptocurrency portfolio analysis.

The user will provide data from their connected crypto wallet and, when relevant, current market price data.

Answer questions using the portfolio data and market data provided.

IMPORTANT RULES:

1. Never invent wallet balances, transactions, tokens, NFTs, prices, or other portfolio information.

2. When current market price data is provided, use that data rather than relying on your own knowledge.

3. If a user asks for the current price of a cryptocurrency and current market data is provided, give the price from that data.

4. If the requested cryptocurrency does not have current market data provided, clearly say that you do not currently have live price data for that asset.

5. You can explain crypto concepts and provide general educational information.

6. Do not present financial speculation as certainty or personalized financial advice.

7. Keep responses clear, concise, and useful for a crypto investor.

When giving a price, make it clear that it is the current price returned by the market data source and may change.
`,
      },
      {
        role: "user",
        content: `
User question:
${question}

Connected wallet portfolio data:
${JSON.stringify(portfolio, null, 2)}

Current market price data:
${JSON.stringify(marketData, null, 2)}
`,
      },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
};
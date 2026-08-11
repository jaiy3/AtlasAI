import api from "./api";

export const askPortfolioAI = async (
  question: string,
  portfolio: unknown
) => {
  const response = await api.post("/ai/portfolio", {
    question,
    portfolio,
  });

  return response.data.data.answer as string;
};
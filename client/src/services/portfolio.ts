import api from "./api";

export const getPortfolio = async (
  token: string,
  walletAddress: string
) => {
  const response = await api.get(
    `/portfolio/${walletAddress}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
/** Public demo portfolio (a well-known public wallet). No login or wallet needed. */
export const getDemoPortfolio = async () => {
  const response = await api.get("/demo/portfolio");
  return response.data;
};

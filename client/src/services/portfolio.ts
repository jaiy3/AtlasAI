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
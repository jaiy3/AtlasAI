import {
  alchemyClient,
  getTokenBalances,
  getNFTs,
  getTransactions,
} from "./alchemy.service";

export const getPortfolio = async (
  walletAddress: `0x${string}`
) => {
  console.log(
    "Fetching portfolio from Alchemy for:",
    walletAddress
  );

  const balance = await alchemyClient.getBalance({
    address: walletAddress,
  });

  console.log("Alchemy balance:", balance.toString());

  const tokens = await getTokenBalances(walletAddress);

  const nfts = await getNFTs(walletAddress);

  const transactions = await getTransactions(walletAddress);

return {
  walletAddress,
  balance: balance.toString(),
  tokens,
  nfts,
  transactions,
};
};
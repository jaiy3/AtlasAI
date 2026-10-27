import { formatEther, formatUnits } from "viem";
import {
  alchemyClient,
  getNFTs,
  getTokenBalances,
  getTransactions,
} from "./alchemy.service";
import { getTokenPrices } from "./prices.service";
import { TRACKED_TOKENS } from "./tokens";

export type PortfolioToken = {
  contractAddress: string;
  symbol: string;
  name: string;
  balance: string;
  priceUsd: number | null;
  valueUsd: number | null;
};

/**
 * Builds one normalised portfolio view from several Alchemy sources plus live
 * prices. Independent upstream calls run in parallel; a failure in a
 * non-critical source (NFTs, prices) degrades that section instead of failing
 * the whole response.
 */
export const getPortfolio = async (walletAddress: `0x${string}`) => {
  const [weiBalance, rawBalances, nftsResult, transactions] = await Promise.all([
    alchemyClient.getBalance({ address: walletAddress }),
    getTokenBalances(
      walletAddress,
      TRACKED_TOKENS.map((token) => token.address)
    ),
    getNFTs(walletAddress).catch(() => ({ totalCount: 0, ownedNfts: [] })),
    getTransactions(walletAddress),
  ]);

  const held = TRACKED_TOKENS.flatMap((token) => {
    const raw = rawBalances.find(
      (b) => b.contractAddress.toLowerCase() === token.address.toLowerCase()
    );
    if (!raw?.tokenBalance || BigInt(raw.tokenBalance) === 0n) return [];
    return [
      {
        token,
        balance: formatUnits(BigInt(raw.tokenBalance), token.decimals),
      },
    ];
  });

  const priceSymbols = ["ETH", ...held.map((h) => h.token.symbol)];
  const prices = await getTokenPrices(priceSymbols).catch(() => []);
  const priceOf = (symbol: string) => {
    const match = prices.find((p) => p.symbol.toUpperCase() === symbol);
    return match?.price ? Number(match.price) : null;
  };

  const tokens: PortfolioToken[] = held
    .map(({ token, balance }) => {
      const priceUsd = priceOf(token.symbol);
      return {
        contractAddress: token.address,
        symbol: token.symbol,
        name: token.name,
        balance,
        priceUsd,
        valueUsd: priceUsd === null ? null : Number(balance) * priceUsd,
      };
    })
    .sort((a, b) => (b.valueUsd ?? -1) - (a.valueUsd ?? -1));

  const ethBalance = formatEther(weiBalance);
  const ethPrice = priceOf("ETH");
  const ethValueUsd = ethPrice === null ? null : Number(ethBalance) * ethPrice;
  const tokensValueUsd = tokens.reduce((sum, t) => sum + (t.valueUsd ?? 0), 0);

  return {
    walletAddress,
    balance: weiBalance.toString(),
    ethBalance,
    tokens,
    nfts: nftsResult,
    transactions,
    totals: {
      ethValueUsd,
      tokensValueUsd,
      totalValueUsd: (ethValueUsd ?? 0) + tokensValueUsd,
    },
    fetchedAt: new Date().toISOString(),
  };
};

export type Portfolio = Awaited<ReturnType<typeof getPortfolio>>;

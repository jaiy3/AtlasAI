import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const alchemyKey = process.env.ALCHEMY_API_KEY;

if (!alchemyKey) {
  throw new Error("ALCHEMY_API_KEY is not configured");
}

export const alchemyClient = createPublicClient({
  chain: mainnet,
  transport: http(
    `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`
  ),
});

export type RawTokenBalance = {
  contractAddress: string;
  tokenBalance: string | null;
  error?: string | null;
};

export const getTokenBalances = async (
  walletAddress: string,
  contractAddresses: readonly string[]
): Promise<RawTokenBalance[]> => {
  const response = await fetch(
    `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getTokenBalances",
        params: [walletAddress, contractAddresses],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Alchemy token request failed: ${response.status}`
    );
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.result?.tokenBalances ?? [];
};

export type PortfolioNFT = {
  name: string;
  tokenId: string;
  image: string | null;
  collection: { name: string | null };
};

type AlchemyNFT = {
  name?: string | null;
  tokenId?: string;
  image?: { cachedUrl?: string; thumbnailUrl?: string; originalUrl?: string };
  contract?: {
    name?: string | null;
    isSpam?: boolean;
    openSeaMetadata?: { collectionName?: string | null };
  };
};

/**
 * NFTs for an owner, normalised for the client. Spam-flagged contracts and
 * items with neither a name nor an image are dropped.
 */
export const getNFTs = async (
  walletAddress: string,
  limit = 12
): Promise<{ totalCount: number; ownedNfts: PortfolioNFT[] }> => {
  const params = new URLSearchParams({
    owner: walletAddress,
    withMetadata: "true",
    pageSize: "50",
  });

  const response = await fetch(
    `https://eth-mainnet.g.alchemy.com/nft/v3/${alchemyKey}/getNFTsForOwner?${params}`
  );

  if (!response.ok) {
    throw new Error(
      `Alchemy NFT request failed: ${response.status}`
    );
  }

  const data = (await response.json()) as {
    totalCount?: number;
    ownedNfts?: AlchemyNFT[];
  };

  const ownedNfts = (data.ownedNfts ?? [])
    .filter((nft) => !nft.contract?.isSpam)
    .map((nft) => ({
      name: nft.name ?? `#${nft.tokenId ?? "?"}`,
      tokenId: nft.tokenId ?? "",
      image:
        nft.image?.thumbnailUrl ??
        nft.image?.cachedUrl ??
        nft.image?.originalUrl ??
        null,
      collection: {
        name:
          nft.contract?.openSeaMetadata?.collectionName ??
          nft.contract?.name ??
          null,
      },
    }))
    .filter((nft) => nft.image || nft.name)
    .slice(0, limit);

  return { totalCount: data.totalCount ?? ownedNfts.length, ownedNfts };
};

export const getTransactions = async (
  walletAddress: string
) => {
  const baseParams = {
    fromBlock: "0x0",
    toBlock: "latest",
    category: [
      "external",
      "erc20",
      "erc721",
      "erc1155",
    ],
    withMetadata: true,
    maxCount: "0x14",
    order: "desc",
  };

  const fetchTransfers = async (
    direction: "fromAddress" | "toAddress"
  ) => {
    const response = await fetch(
      `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "alchemy_getAssetTransfers",
          params: [
            {
              ...baseParams,
              [direction]: walletAddress,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Alchemy transaction request failed: ${response.status}`
      );
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.result?.transfers ?? [];
  };

  const [sent, received] = await Promise.all([
    fetchTransfers("fromAddress"),
    fetchTransfers("toAddress"),
  ]);

  const transactions = [...sent, ...received];

  transactions.sort((a, b) => {
    const dateA = new Date(
      a.metadata?.blockTimestamp ?? 0
    ).getTime();

    const dateB = new Date(
      b.metadata?.blockTimestamp ?? 0
    ).getTime();

    return dateB - dateA;
  });

  return transactions.slice(0, 20);
};
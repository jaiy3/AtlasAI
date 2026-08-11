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

export const getTokenBalances = async (
  walletAddress: string
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
        method: "alchemy_getTokenBalances",
        params: [walletAddress, "erc20"],
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

  return data.result;
};

export const getNFTs = async (walletAddress: string) => {
  const response = await fetch(
    `https://eth-mainnet.g.alchemy.com/nft/v3/${alchemyKey}/getNFTsForOwner?owner=${walletAddress}&withMetadata=true`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Alchemy NFT request failed: ${response.status}`
    );
  }

  const data = await response.json();

  return data;
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
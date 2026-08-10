import { getDefaultConfig } from "@rainbow-me/rainbowkit";

import {
  rainbowWallet,
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "AtlasAI",

  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,

  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
  ],

  wallets: [
    {
      groupName: "Popular",
      wallets: [
        rainbowWallet,
        metaMaskWallet,
        walletConnectWallet,
      ],
    },
  ],
});
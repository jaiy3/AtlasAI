import React from "react";
import ReactDOM from "react-dom/client";

import "@rainbow-me/rainbowkit/styles.css";

import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { DisclaimerComponent } from "@rainbow-me/rainbowkit";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import App from "./App";
import "./index.css";

import AuthProvider from "./contexts/AuthProvider";
import { config } from "./config/wagmi";

const queryClient = new QueryClient();

const WalletDisclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <Text>
    WalletConnect QR codes must be scanned using the QR scanner inside a
    compatible wallet app. Your phone's regular camera cannot connect to it.{" "}
    <Link href="/wallet-help">Don't have a wallet? Get one.</Link>
  </Text>
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          appInfo={{
            appName: "AtlasAI",
            learnMoreUrl: "/wallet-help",
            disclaimer: WalletDisclaimer,
          }}
>
          <AuthProvider>
            <App />
          </AuthProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
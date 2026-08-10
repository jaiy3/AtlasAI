import { useAccount, useBalance } from "wagmi";

import WalletConnect from "../../components/WalletConnect";

export default function Dashboard() {
  const { address, isConnected } = useAccount();

  const { data: balance, isLoading: balanceLoading } = useBalance({
    address,
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px",
        }}
      >
        <h1>Dashboard</h1>

        <div style={{ textAlign: "right" }}>
          <WalletConnect />

          <p
            style={{
              margin: "6px 0 0",
              fontSize: "12px",
              color: "#888",
            }}
          >
            Don't have a wallet?{" "}
            <a
              href="/wallet-help"
              style={{
                color: "#6c63ff",
                textDecoration: "none",
              }}
            >
              Get one
            </a>
          </p>
        </div>
      </div>

      <main style={{ padding: "24px" }}>
        <h2>Portfolio</h2>

        {!isConnected ? (
          <p>Connect your wallet to view your crypto portfolio.</p>
        ) : (
          <div>
            <p>
              <strong>Wallet:</strong>{" "}
              {address}
            </p>

            <p>
              <strong>Balance:</strong>{" "}
              {balanceLoading
                ? "Loading..."
                : `${balance?.formatted ?? "0"} ${balance?.symbol ?? ""}`}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
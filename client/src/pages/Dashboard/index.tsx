import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";

import WalletConnect from "../../components/WalletConnect";
import { getPortfolio } from "../../services/portfolio";
import { getTokenPrices } from "../../services/prices";
import type { TokenPrice } from "../../services/prices";
import { askPortfolioAI } from "../../services/ai";

import "./Dashboard.css";

type TokenBalance = {
  contractAddress: string;
  tokenBalance: string;
  error?: string;
};

type NFT = {
  name?: string;
  description?: string;
  image?: string;
  collection?: {
    name?: string;
  };
  tokenId?: string;
};

type Transaction = {
  hash: string;
  from?: string;
  to?: string;
  value?: string;
  asset?: string;
  category?: string;
  metadata?: {
    blockTimestamp?: string;
  };
};

type ActivityDay = {
  label: string;
  count: number;
};

const DEFAULT_WATCHLIST = ["ETH", "BTC", "USDC"];

export default function Dashboard() {
  const { address, isConnected } = useAccount();

  const [balance, setBalance] = useState<string | null>(null);
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [portfolioSummary, setPortfolioSummary] = useState({
    tokens: 0,
    nfts: 0,
    transactions: 0,
  });

  const [activity, setActivity] = useState<ActivityDay[]>([]);

  const [loadingBalance, setLoadingBalance] = useState(false);
  const [portfolioError, setPortfolioError] = useState("");

  const [watchlist, setWatchlist] =
    useState<string[]>(DEFAULT_WATCHLIST);

  const [watchlistPrices, setWatchlistPrices] = useState<
    TokenPrice[]
  >([]);

  const [loadingPrices, setLoadingPrices] = useState(false);
  const [watchlistSearch, setWatchlistSearch] = useState("");
  const [searchResult, setSearchResult] =
    useState<TokenPrice | null>(null);
  const [searchingToken, setSearchingToken] = useState(false);

  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState("");

  /*
   * Load portfolio data
   */
  useEffect(() => {
    if (!address || !isConnected) {
      setBalance(null);
      setTokens([]);
      setNfts([]);
      setTransactions([]);
      setActivity([]);
      return;
    }

    const loadPortfolio = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setPortfolioError("Please log in to AtlasAI first.");
        return;
      }

      try {
        setLoadingBalance(true);
        setPortfolioError("");

        const response = await getPortfolio(token, address);

        const weiBalance = BigInt(response.data.balance);
        const ethBalance = formatEther(weiBalance);

        const tokenBalances =
          response.data.tokens?.tokenBalances ?? [];

        const ownedNfts =
          response.data.nfts?.ownedNfts ?? [];

        const recentTransactions =
          response.data.transactions ?? [];

        setBalance(ethBalance);
        setTokens(tokenBalances);
        setNfts(ownedNfts);
        setTransactions(recentTransactions);

        setPortfolioSummary({
          tokens: tokenBalances.length,
          nfts: ownedNfts.length,
          transactions: recentTransactions.length,
        });

        const days: ActivityDay[] = [];

        for (let i = 6; i >= 0; i--) {
          const date = new Date();

          date.setHours(0, 0, 0, 0);
          date.setDate(date.getDate() - i);

          const label = date.toLocaleDateString("en-US", {
            weekday: "short",
          });

          const count = recentTransactions.filter(
            (transaction: Transaction) => {
              if (!transaction.metadata?.blockTimestamp) {
                return false;
              }

              const transactionDate = new Date(
                transaction.metadata.blockTimestamp
              );

              return (
                transactionDate.getFullYear() ===
                  date.getFullYear() &&
                transactionDate.getMonth() ===
                  date.getMonth() &&
                transactionDate.getDate() ===
                  date.getDate()
              );
            }
          ).length;

          days.push({
            label,
            count,
          });
        }

        setActivity(days);
      } catch (error) {
        console.error(error);
        setPortfolioError(
          "Unable to load portfolio data."
        );
      } finally {
        setLoadingBalance(false);
      }
    };

    loadPortfolio();
  }, [address, isConnected]);

  /*
   * Load watchlist prices
   */
  useEffect(() => {
    const loadPrices = async () => {
      if (watchlist.length === 0) {
        setWatchlistPrices([]);
        return;
      }

      try {
        setLoadingPrices(true);

        const prices = await getTokenPrices(watchlist);

        setWatchlistPrices(prices);
      } catch (error) {
        console.error(
          "Failed to load watchlist prices:",
          error
        );
      } finally {
        setLoadingPrices(false);
      }
    };

    loadPrices();
  }, [watchlist]);

  /*
   * Search for a token before adding it
   */
  const handleTokenSearch = async () => {
    const symbol = watchlistSearch
      .trim()
      .toUpperCase();

    if (!symbol) {
      setSearchResult(null);
      return;
    }

    if (watchlist.includes(symbol)) {
      setSearchResult(null);
      return;
    }

    try {
      setSearchingToken(true);
      setSearchResult(null);

      const results = await getTokenPrices([symbol]);

      if (results.length > 0) {
        setSearchResult(results[0]);
      }
    } catch (error) {
      console.error(
        "Failed to search for token:",
        error
      );
    } finally {
      setSearchingToken(false);
    }
  };

  const addToWatchlist = () => {
    if (!searchResult) return;

    const symbol = searchResult.symbol.toUpperCase();

    if (!watchlist.includes(symbol)) {
      setWatchlist((current) => [
        ...current,
        symbol,
      ]);
    }

    setWatchlistSearch("");
    setSearchResult(null);
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist((current) =>
      current.filter(
        (item) => item !== symbol
      )
    );
  };

  /*
   * Ask AtlasAI
   */
  const handleAskAI = async () => {
    const question = aiQuestion.trim();

    if (!question) {
      return;
    }

    try {
      setLoadingAI(true);
      setAiError("");
      setAiResponse("");

      const portfolio = {
        wallet: address,
        ethBalance: balance,
        tokens,
        nfts,
        transactions,
        watchlist: watchlistPrices,
      };

      const response = await askPortfolioAI(
        question,
        portfolio
      );

      setAiResponse(response);
    } catch (error) {
      console.error("AI request failed:", error);
      setAiError(
        "Unable to get an AI response right now."
      );
    } finally {
      setLoadingAI(false);
    }
  };

  /*
   * Activity chart
   */
  const maxActivity = useMemo(
    () =>
      Math.max(
        ...activity.map((day) => day.count),
        1
      ),
    [activity]
  );

  const totalActivity = activity.reduce(
    (sum, day) => sum + day.count,
    0
  );

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="brand">
          <div className="brand-mark">A</div>

          <div>
            <div className="brand-name">
              AtlasAI
            </div>

            <div className="brand-tagline">
              Intelligent portfolio analytics
            </div>
          </div>
        </div>

        <div className="header-actions">
          <WalletConnect />

          <p className="wallet-help">
            Don't have a wallet?{" "}
            <a href="/wallet-help">
              Get one
            </a>
          </p>
        </div>
      </header>

      <main className="dashboard-main">
        {!isConnected ? (
          <section className="connect-state">
            <div className="connect-icon">
              ✦
            </div>

            <h1>Connect your wallet</h1>

            <p>
              Connect a wallet to unlock your
              portfolio analytics, market data,
              and AtlasAI insights.
            </p>

            <WalletConnect />
          </section>
        ) : (
          <>
            {/* Hero */}
            <section className="portfolio-hero">
              <div>
                <span className="eyebrow">
                  YOUR PORTFOLIO
                </span>

                <h1>Portfolio</h1>

                <p>
                  Track your assets, activity,
                  and market data in one place.
                </p>
              </div>

              <div className="hero-status">
                <span className="status-dot" />
                Wallet connected
              </div>
            </section>

            {/* Connected wallet */}
            <section className="wallet-banner">
              <div className="wallet-banner-icon">
                ◈
              </div>

              <div>
                <span>
                  Connected wallet
                </span>

                <strong>
                  {address}
                </strong>
              </div>
            </section>

            {/* Summary */}
            <section className="summary-grid">
              <div className="summary-card summary-card-purple">
                <div className="summary-card-top">
                  <span>ETH Balance</span>
                  <span className="card-icon">
                    Ξ
                  </span>
                </div>

                <strong>
                  {loadingBalance
                    ? "..."
                    : `${balance ?? "0"} ETH`}
                </strong>

                <small>
                  Native Ethereum balance
                </small>
              </div>

              <div className="summary-card summary-card-blue">
                <div className="summary-card-top">
                  <span>Tokens</span>
                  <span className="card-icon">
                    ◉
                  </span>
                </div>

                <strong>
                  {portfolioSummary.tokens}
                </strong>

                <small>
                  ERC-20 assets detected
                </small>
              </div>

              <div className="summary-card summary-card-pink">
                <div className="summary-card-top">
                  <span>NFTs</span>
                  <span className="card-icon">
                    ◆
                  </span>
                </div>

                <strong>
                  {portfolioSummary.nfts}
                </strong>

                <small>
                  Collectibles in wallet
                </small>
              </div>

              <div className="summary-card summary-card-green">
                <div className="summary-card-top">
                  <span>Transactions</span>
                  <span className="card-icon">
                    ↗
                  </span>
                </div>

                <strong>
                  {portfolioSummary.transactions}
                </strong>

                <small>
                  Recent wallet activity
                </small>
              </div>
            </section>

            {/* Assets */}
            <section className="dashboard-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    ASSETS
                  </span>

                  <h2>Token Balances</h2>

                  <p>
                    ERC-20 assets currently held
                    by your wallet.
                  </p>
                </div>
              </div>

              {loadingBalance ? (
                <div className="empty-card loading-card">
                  Loading token balances...
                </div>
              ) : tokens.length === 0 ? (
                <div className="empty-card">
                  <div className="empty-icon">
                    ◉
                  </div>

                  <div>
                    <strong>
                      No tokens yet
                    </strong>

                    <p>
                      ERC-20 tokens held by this
                      wallet will appear here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="asset-grid">
                  {tokens.map((token) => (
                    <div
                      className="asset-card"
                      key={token.contractAddress}
                    >
                      <div className="asset-icon">
                        ◉
                      </div>

                      <div>
                        <strong>
                          Token
                        </strong>

                        <span>
                          {token.contractAddress}
                        </span>

                        <small>
                          Balance:{" "}
                          {token.tokenBalance}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* NFTs */}
            <section className="dashboard-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    COLLECTIBLES
                  </span>

                  <h2>NFTs</h2>

                  <p>
                    Digital collectibles owned
                    by your wallet.
                  </p>
                </div>
              </div>

              {loadingBalance ? (
                <div className="empty-card">
                  Loading NFTs...
                </div>
              ) : nfts.length === 0 ? (
                <div className="empty-card">
                  <div className="empty-icon pink">
                    ◆
                  </div>

                  <div>
                    <strong>
                      No NFTs yet
                    </strong>

                    <p>
                      NFTs owned by this wallet
                      will appear here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="nft-grid">
                  {nfts.map((nft) => (
                    <div
                      className="nft-card"
                      key={`${nft.tokenId}-${nft.name}`}
                    >
                      {nft.image ? (
                        <img
                          src={nft.image}
                          alt={
                            nft.name ??
                            "NFT"
                          }
                        />
                      ) : (
                        <div className="nft-placeholder">
                          ◆
                        </div>
                      )}

                      <div className="nft-content">
                        <strong>
                          {nft.name ??
                            "Unnamed NFT"}
                        </strong>

                        <span>
                          {nft.collection
                            ?.name ??
                            "Unknown collection"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Watchlist */}
            <section className="dashboard-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    MARKET
                  </span>

                  <h2>Watchlist</h2>

                  <p>
                    Track the assets you're
                    interested in.
                  </p>
                </div>
              </div>

              <div className="watchlist-search">
                <input
                  value={watchlistSearch}
                  onChange={(event) =>
                    setWatchlistSearch(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter"
                    ) {
                      handleTokenSearch();
                    }
                  }}
                  placeholder="Search token symbol, e.g. SOL"
                />

                <button
                  type="button"
                  onClick={handleTokenSearch}
                  disabled={searchingToken}
                >
                  {searchingToken
                    ? "Searching..."
                    : "Search"}
                </button>
              </div>

              {searchResult && (
                <div className="token-result">
                  <div>
                    <span className="token-result-icon">
                      {searchResult.symbol
                        .slice(0, 1)}
                    </span>

                    <div>
                      <strong>
                        {searchResult.symbol}
                      </strong>

                      <small>
                        Verified market result
                      </small>
                    </div>
                  </div>

                  <div className="token-result-right">
                    <strong>
                      {searchResult.price
                        ? `$${Number(
                            searchResult.price
                          ).toLocaleString()}`
                        : "Price unavailable"}
                    </strong>

                    <button
                      type="button"
                      onClick={
                        addToWatchlist
                      }
                    >
                      Add to watchlist
                    </button>
                  </div>
                </div>
              )}

              <div className="watchlist-grid">
                {watchlistPrices.map(
                  (token) => (
                    <div
                      className="watch-card"
                      key={token.symbol}
                    >
                      <div className="watch-card-top">
                        <div className="watch-token">
                          <span className="watch-token-icon">
                            {token.symbol.slice(
                              0,
                              1
                            )}
                          </span>

                          <div>
                            <strong>
                              {token.symbol}
                            </strong>

                            <small>
                              Market price
                            </small>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromWatchlist(
                              token.symbol
                            )
                          }
                          className="remove-button"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="watch-price">
                        {loadingPrices
                          ? "..."
                          : token.price
                          ? `$${Number(
                              token.price
                            ).toLocaleString()}
`
                          : "Price unavailable"}
                      </div>

                      {token.lastUpdatedAt && (
                        <small className="updated">
                          Updated{" "}
                          {new Date(
                            token.lastUpdatedAt
                          ).toLocaleTimeString()}
                        </small>
                      )}
                    </div>
                  )
                )}
              </div>
            </section>

            {/* AI + Activity */}
            <section className="feature-grid">
              {/* AI */}
              <div className="ai-card">
                <div className="ai-header">
                  <div className="ai-title">
                    <div className="ai-icon">
                      ✦
                    </div>

                    <div>
                      <span className="eyebrow">
                        INTELLIGENCE
                      </span>

                      <h2>
                        Ask AtlasAI
                      </h2>
                    </div>
                  </div>

                  <span className="ai-badge">
                    AI
                  </span>
                </div>

                <p className="ai-description">
                  Ask questions about your
                  wallet, assets, transactions,
                  or portfolio activity.
                </p>

                <textarea
                  value={aiQuestion}
                  onChange={(event) =>
                    setAiQuestion(
                      event.target.value
                    )
                  }
                  placeholder="Ask something about your portfolio..."
                  rows={5}
                />

                <div className="ai-footer">
                  <span>
                    AtlasAI only uses the
                    portfolio data available
                    to it.
                  </span>

                  <button
                    type="button"
                    onClick={handleAskAI}
                    disabled={
                      loadingAI ||
                      !aiQuestion.trim()
                    }
                  >
                    {loadingAI
                      ? "Thinking..."
                      : "Ask AtlasAI →"}
                  </button>
                </div>

                {aiError && (
                  <div className="ai-error">
                    {aiError}
                  </div>
                )}

                {aiResponse && (
                  <div className="ai-response">
                    <div className="response-label">
                      <span>✦</span>
                      AtlasAI
                    </div>

                    <p>
                      {aiResponse}
                    </p>
                  </div>
                )}
              </div>

              {/* Activity */}
              <div className="activity-card">
                <div className="section-heading compact">
                  <div>
                    <span className="eyebrow">
                      ACTIVITY
                    </span>

                    <h2>
                      Transaction Activity
                    </h2>

                    <p>
                      Transactions over the
                      last 7 days.
                    </p>
                  </div>

                  <div className="activity-total">
                    <strong>
                      {totalActivity}
                    </strong>

                    <span>
                      transactions
                    </span>
                  </div>
                </div>

                <div className="activity-chart">
                  {activity.map((day) => {
                    const height =
                      day.count === 0
                        ? 5
                        : Math.max(
                            (day.count /
                              maxActivity) *
                              150,
                            18
                          );

                    return (
                      <div
                        className="activity-column"
                        key={day.label}
                      >
                        <span className="activity-count">
                          {day.count}
                        </span>

                        <div
                          className="activity-bar"
                          style={{
                            height: `${height}px`,
                          }}
                        />

                        <span className="activity-label">
                          {day.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Transactions */}
            <section className="dashboard-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    HISTORY
                  </span>

                  <h2>
                    Recent Transactions
                  </h2>

                  <p>
                    Recent activity from your
                    connected wallet.
                  </p>
                </div>
              </div>

              {loadingBalance ? (
                <div className="empty-card">
                  Loading transactions...
                </div>
              ) : transactions.length === 0 ? (
                <div className="empty-card">
                  <div className="empty-icon green">
                    ↗
                  </div>

                  <div>
                    <strong>
                      No transactions yet
                    </strong>

                    <p>
                      Recent wallet activity
                      will appear here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="transactions-card">
                  {transactions.map(
                    (transaction) => (
                      <div
                        className="transaction-row"
                        key={transaction.hash}
                      >
                        <div className="transaction-icon">
                          ↗
                        </div>

                        <div className="transaction-main">
                          <strong>
                            {transaction.category ??
                              "Transaction"}
                          </strong>

                          <span>
                            {transaction.hash.slice(
                              0,
                              10
                            )}
                            ...
                            {transaction.hash.slice(
                              -8
                            )}
                          </span>
                        </div>

                        <div className="transaction-asset">
                          <span>
                            {transaction.asset ??
                              "Unknown"}
                          </span>

                          <small>
                            {transaction.metadata
                              ?.blockTimestamp
                              ? new Date(
                                  transaction
                                    .metadata
                                    .blockTimestamp
                                ).toLocaleString()
                              : "Date unavailable"}
                          </small>
                        </div>

                        <div className="transaction-value">
                          {transaction.value ??
                            "0"}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>

            {portfolioError && (
              <div className="portfolio-error">
                {portfolioError}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
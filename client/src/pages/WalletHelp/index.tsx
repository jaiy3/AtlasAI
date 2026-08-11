import "./wallet-help.css";

export default function WalletHelp() {
  return (
    <div className="wallet-help-page">
      <div className="wallet-help-container">
        {/* Brand */}
        <div className="wallet-help-brand">
          <div className="wallet-help-brand-mark">
            A
          </div>

          <div>
            <strong>AtlasAI</strong>

            <span>
              Intelligent portfolio analytics
            </span>
          </div>
        </div>

        {/* Main card */}
        <div className="wallet-help-card">
          <div className="wallet-help-icon">
            ◈
          </div>

          <span className="wallet-help-eyebrow">
            GET CONNECTED
          </span>

          <h1>Get a crypto wallet</h1>

          <p className="wallet-help-intro">
            A crypto wallet lets you securely connect to
            AtlasAI and view your portfolio, assets,
            transactions, and market insights.
          </p>

          {/* Wallet options */}
          <div className="wallet-help-options">
            <a
              className="wallet-help-option"
              href="https://rainbow.me/en/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="wallet-option-top">
                <div className="wallet-option-icon rainbow">
                  R
                </div>

                <span className="wallet-option-arrow">
                  ↗
                </span>
              </div>

              <h2>Rainbow</h2>

              <p>
                A simple, polished wallet for mobile and
                browser.
              </p>

              <span className="wallet-option-link">
                Get Rainbow
              </span>
            </a>

            <a
              className="wallet-help-option"
              href="https://metamask.io/download/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="wallet-option-top">
                <div className="wallet-option-icon metamask">
                  M
                </div>

                <span className="wallet-option-arrow">
                  ↗
                </span>
              </div>

              <h2>MetaMask</h2>

              <p>
                A popular wallet available on mobile and
                browser.
              </p>

              <span className="wallet-option-link">
                Get MetaMask
              </span>
            </a>
          </div>

          {/* WalletConnect */}
          <div className="walletconnect-help">
            <div className="walletconnect-help-icon">
              ◇
            </div>

            <div>
              <h2>Already have another wallet?</h2>

              <p>
                AtlasAI supports wallets compatible with
                WalletConnect. Browse available wallets
                and choose the one that's right for you.
              </p>

              <a
                href="https://walletguide.walletconnect.network/"
                target="_blank"
                rel="noreferrer"
              >
                Browse WalletConnect wallets →
              </a>
            </div>
          </div>

          {/* Back */}
          <button
            type="button"
            className="wallet-help-back"
            onClick={() => window.history.back()}
          >
            ← Back to AtlasAI
          </button>
        </div>

        <p className="wallet-help-footer">
          AtlasAI never asks for your wallet recovery phrase
          or private keys.
        </p>
      </div>
    </div>
  );
}
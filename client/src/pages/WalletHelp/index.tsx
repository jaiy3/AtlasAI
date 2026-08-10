export default function WalletHelp() {
  return (
    <div className="wallet-help-page">
      <div className="wallet-help-card">
        <h1>Get a Wallet</h1>

        <p className="wallet-help-intro">
          To connect to AtlasAI, you'll need a compatible crypto wallet.
          Wallets are apps or browser extensions that let you connect to
          Web3 applications.
        </p>

        <h2>Already have a wallet?</h2>

        <p>
          If you already have a compatible wallet, return to AtlasAI and
          choose your wallet from the Connect Wallet menu.
        </p>

        <h2>Don't have a wallet yet?</h2>

        <p>
          You can install a wallet such as Rainbow, MetaMask or any compatible WalletConnect wallet on your
          device, then return to AtlasAI and connect it.
        </p>

        <div className="wallet-help-options">
          <div className="wallet-help-option">
            <h3>Rainbow</h3>

            <p>
              Rainbow is available as a mobile app and browser extension.
            </p>

            <a
              href="https://rainbow.me/en/"
              target="_blank"
              rel="noreferrer"
            >
              Get Rainbow
            </a>
          </div>

          <div className="wallet-help-option">
            <h3>MetaMask</h3>

            <p>
              MetaMask is available as a mobile app and browser extension.
            </p>

            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noreferrer"
            >
              Get MetaMask
            </a>
          </div>
        </div>

        <div className="wallet-help-walletconnect">
          <h2>Looking for a WalletConnect wallet?</h2>

          <p>
            WalletConnect connects AtlasAI to compatible wallet apps.
            If you don't have a wallet yet, you can browse compatible
            wallets and choose one for your device.
          </p>

          <a
            href="https://walletguide.walletconnect.network/"
            target="_blank"
            rel="noreferrer"
          >
            Browse WalletConnect Wallets
          </a>
        </div>
        
        <button
          type="button"
          onClick={() => window.history.back()}
        >
          Back to AtlasAI
        </button>
      </div>
    </div>
  );
}
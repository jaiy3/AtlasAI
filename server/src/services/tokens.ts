/**
 * Curated list of major Ethereum mainnet ERC-20 tokens.
 *
 * Querying balances for a known list (rather than every token a wallet has
 * ever received) filters out airdropped spam tokens and avoids one metadata
 * request per token. Decimals are fixed per contract, so they are stored here.
 */
export const TRACKED_TOKENS = [
  { symbol: "USDC", name: "USD Coin", decimals: 6, address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
  { symbol: "USDT", name: "Tether", decimals: 6, address: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
  { symbol: "DAI", name: "Dai", decimals: 18, address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" },
  { symbol: "WETH", name: "Wrapped Ether", decimals: 18, address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
  { symbol: "WBTC", name: "Wrapped Bitcoin", decimals: 8, address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" },
  { symbol: "STETH", name: "Lido Staked Ether", decimals: 18, address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84" },
  { symbol: "LINK", name: "Chainlink", decimals: 18, address: "0x514910771AF9Ca656af840dff83E8264EcF986CA" },
  { symbol: "UNI", name: "Uniswap", decimals: 18, address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984" },
  { symbol: "AAVE", name: "Aave", decimals: 18, address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9" },
  { symbol: "MKR", name: "Maker", decimals: 18, address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2" },
  { symbol: "LDO", name: "Lido DAO", decimals: 18, address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32" },
  { symbol: "ENS", name: "Ethereum Name Service", decimals: 18, address: "0xC18360217D8F7Ab5e7c516566761Ea12Ce7f9D72" },
  { symbol: "ARB", name: "Arbitrum", decimals: 18, address: "0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1" },
  { symbol: "SHIB", name: "Shiba Inu", decimals: 18, address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE" },
  { symbol: "PEPE", name: "Pepe", decimals: 18, address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933" },
] as const;

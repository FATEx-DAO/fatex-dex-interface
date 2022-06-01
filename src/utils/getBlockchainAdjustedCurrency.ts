import { Blockchain, Currency, ETHER, BINANCE_COIN, HARMONY, MATIC } from '@fatex-dao/sdk'

export default function getBlockchainAdjustedCurrency(
  blockchain: Blockchain,
  currency: Currency | undefined
): Currency | undefined {
  if (!currency) return currency
  if (currency !== ETHER) return currency
  switch (blockchain) {
    case Blockchain.BINANCE_SMART_CHAIN:
      return BINANCE_COIN
    case Blockchain.HARMONY:
      return HARMONY
    case Blockchain.POLYGON:
      return MATIC
    default:
      return ETHER
  }
}

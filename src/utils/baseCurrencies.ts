import { BINANCE_COIN, ChainId, Currency, ETHER, HARMONY, MATIC, WETH } from '@fatex-dao/sdk'
import { GOVERNANCE_TOKEN } from '../constants/governance-token'

const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1')

export default function baseCurrencies(chainId: ChainId | undefined): Currency[] {
  const currencies: Currency[] = []

  if (chainId) {
    switch (chainId) {
      case ChainId.BSC_MAINNET:
      case ChainId.BSC_TESTNET:
        currencies.push(BINANCE_COIN)
        currencies.push(WETH[chainId])
        break
      case ChainId.POLYGON_MAINNET:
        currencies.push(MATIC)
        currencies.push(WETH[chainId])
        currencies.push(GOVERNANCE_TOKEN[chainId])
        break
      case ChainId.HARMONY_MAINNET:
      case ChainId.HARMONY_TESTNET:
        currencies.push(HARMONY)
        currencies.push(WETH[chainId])
        currencies.push(GOVERNANCE_TOKEN[chainId])
        break
      default:
        currencies.push(ETHER)
        currencies.push(WETH[chainId])
        break
    }
  } else {
    currencies.push(ETHER)
    currencies.push(WETH[NETWORK_CHAIN_ID as ChainId])
  }

  return currencies
}

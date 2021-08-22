import { ChainId, Currency, ETHER, HARMONY, BINANCE_COIN, WETH } from '@fatex-dao/sdk'
import { GOVERNANCE_TOKEN } from '../constants/governance-token'

const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1')

export default function baseCurrencies(chainId: ChainId | undefined): Currency[] {
  const currencies: Currency[] = []

  if (chainId) {
    switch (chainId) {
      case 56:
      case 97:
        currencies.push(BINANCE_COIN)
        currencies.push(WETH[chainId])
        break
      case 1666600000:
      case 1666700000:
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

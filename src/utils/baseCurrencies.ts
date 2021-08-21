import { ChainId, Currency, ETHER, HARMONY, BINANCE_COIN, WETH } from '@fatex-dao/sdk'
import { NETWORK_CHAIN_ID } from '../connectors'

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
        //currencies.push(FATE)
        currencies.push(HARMONY)
        //currencies.push(X_FATE)
        currencies.push(WETH[chainId])
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

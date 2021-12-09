import { ChainId, Token, WETH } from '@fatex-dao/sdk'
import { TOKENS } from '@fatex-dao/sdk-extra'

export default function getTokenWithDefault(chainId: ChainId | undefined, symbol: string): Token | undefined {
  if (chainId === undefined) return undefined
  symbol = symbol.toUpperCase()

  switch (symbol) {
    case 'WETH':
    case 'WBNB':
    case 'WONE':
      return WETH[chainId]
    default:
      // 2047000000000
      return TOKENS[chainId].firstBySymbol(symbol)
  }
}

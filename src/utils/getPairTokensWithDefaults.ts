import { ChainId, Token } from '@fatex-dao/sdk'
import getTokenWithDefault from './getTokenWithDefault'
import { ZERO_ONE_ADDRESS } from '../constants/index'

export default function getPairTokensWithDefaults(chainId: ChainId, pairSymbol: string): [Token, Token] {
  pairSymbol = pairSymbol.toUpperCase()
  const tokenSymbols = pairSymbol.split('/').map(symbol => symbol.trim())
  const defaultToken = new Token(chainId, ZERO_ONE_ADDRESS, 18, 'DEFAULT', 'DEFAULT')

  if (tokenSymbols.length == 2) {
    const token0 = getTokenWithDefault(chainId, tokenSymbols[0])
    const token1 = getTokenWithDefault(chainId, tokenSymbols[1])
    if (token0 && token1) {
      return [token0, token1]
    }
  }

  return [defaultToken, defaultToken]
}

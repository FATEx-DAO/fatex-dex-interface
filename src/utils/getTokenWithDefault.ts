import { ChainId, Token, WETH } from '@fatex-dao/sdk'
import { TOKENS } from '@fatex-dao/sdk-extra'
import { GOVERNANCE_TOKEN, ZERO_ONE_ADDRESS } from '../constants/index'

export default function getTokenWithDefault(chainId: ChainId, symbol: string): Token {
  symbol = symbol.toUpperCase()
  let token: Token

  switch (symbol) {
    case 'WMATIC':
      token = WETH[chainId]
      break
    default:
      const retrievedToken = TOKENS[chainId].firstBySymbol(symbol)
      token = retrievedToken ? retrievedToken : new Token(chainId, ZERO_ONE_ADDRESS, 18, symbol, symbol)
      break
  }

  if (
    (!token || token.address === ZERO_ONE_ADDRESS) &&
    [ChainId.HARMONY_TESTNET, ChainId.BSC_TESTNET].includes(chainId)
  ) {
    const govToken = GOVERNANCE_TOKEN[chainId]
    if (symbol.toUpperCase() === govToken.symbol?.toUpperCase()) {
      token = govToken
    }
  }

  return token
}

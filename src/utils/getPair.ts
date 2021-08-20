import { Token, TokenAmount, Pair } from '@fatex-dao/sdk'
import { BigNumber } from 'ethers'

export default function getPair(
  tokenA: Token | undefined,
  tokenB: Token | undefined,
  reserve0: BigNumber,
  reserve1: BigNumber
): Pair | undefined {
  if (tokenA && tokenB && reserve0 && reserve1) {
    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
    return token0 && token1
      ? new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString()))
      : undefined
  }

  return undefined
}

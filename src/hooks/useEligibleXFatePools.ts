import { useMemo } from 'react'
import { CallState } from '../state/multicall/hooks'
import { JSBI, Pair, TokenAmount } from '@fatex-dao/sdk'
import { useTotalSupplies } from '../data/TotalSupply'

function isFatexFatePair(pair: Pair) {
  return (
    (pair.token0.symbol === 'FATE' && pair.token1.symbol === 'xFATE') ||
    (pair.token1.symbol === 'FATE' && pair.token0.symbol === 'xFATE')
  )
}

export default function useEligibleXFatePools(
  pairs: (Pair | null)[],
  balanceResultsMap: { [address: string]: CallState }
): string[][] {
  const tokens = useMemo(() => pairs.map(pair => pair?.liquidityToken), [pairs])
  const totalSupplies = useTotalSupplies(tokens)
  return useMemo<string[][]>(() => {
    const claimFrom: string[] = []
    const claimTo: string[] = []
    const ZERO = JSBI.BigInt('0')

    for (let i = 0; pairs && i < pairs.length; i++) {
      const pair = pairs[i]
      const state = balanceResultsMap[pair?.liquidityToken.address ?? '']
      const totalSupply = totalSupplies[i]
      if (state && !state.loading && state?.result !== undefined && pair && totalSupply) {
        const balance = new TokenAmount(pair.liquidityToken, state.result?.[0].toString())
        const amount0 = balance.multiply(pair.reserve0.numerator).divide(totalSupply)
        const amount1 = balance.multiply(pair.reserve1.numerator).divide(totalSupply)
        if (JSBI.GT(amount0.quotient, ZERO) && JSBI.GT(amount1.quotient, ZERO) && !isFatexFatePair(pair)) {
          claimFrom.push(pair.token0.address)
          claimTo.push(pair.token1.address)
        }
      }
    }

    return [claimFrom, claimTo]
  }, [pairs, balanceResultsMap])
}

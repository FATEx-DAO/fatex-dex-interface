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

    for (let index = 0; pairs && index < pairs.length; index++) {
      const pair = pairs[index]
      const state = balanceResultsMap[pair?.liquidityToken.address ?? '']
      const totalSupply = totalSupplies[index]
      if (state && !state.loading && state?.result !== undefined && pair && totalSupply) {
        // let minimumAmountWei = '1000'
        // if (
        //   (pair.token0.decimals === 8 && pair.token1.decimals === 18) ||
        //   (pair.token0.decimals === 18 && pair.token1.decimals === 8)
        // ) {
        //   minimumAmountWei = '1000000000'
        // }
        const balance = new TokenAmount(pair.liquidityToken, state.result?.[0].toString())
        const amount0 = balance.multiply(pair.reserve0.quotient).divide(totalSupply.quotient)
        const amount1 = balance.multiply(pair.reserve1.quotient).divide(totalSupply.quotient)
        if (JSBI.GT(amount0, ZERO) && JSBI.GT(amount1, ZERO) && !isFatexFatePair(pair)) {
          claimFrom.push(pair.token0.address)
          claimTo.push(pair.token1.address)
        }
      }
    }

    return [claimFrom, claimTo]
  }, [pairs, balanceResultsMap])
}

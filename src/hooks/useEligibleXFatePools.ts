import { useMemo } from 'react'
import { CallState } from '../state/multicall/hooks'
import { JSBI, Pair } from '@fatex-dao/sdk'

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
  return useMemo<string[][]>(() => {
    const claimFrom: string[] = []
    const claimTo: string[] = []

    for (let index = 0; pairs && index < pairs.length; index++) {
      const pair = pairs[index]
      const result = balanceResultsMap[pair?.liquidityToken.address ?? '']
      if (result && !result.loading && result?.result !== undefined && pair) {
        let minimumAmountWei = '1000'
        if (
          (pair.token0.decimals === 8 && pair.token1.decimals === 18) ||
          (pair.token0.decimals === 18 && pair.token1.decimals === 8)
        ) {
          minimumAmountWei = '1000000000'
        }
        if (JSBI.GT(JSBI.BigInt(result?.result?.[0]), minimumAmountWei) && !isFatexFatePair(pair)) {
          claimFrom.push(pair.token0.address)
          claimTo.push(pair.token1.address)
        }
      }
    }

    return [claimFrom, claimTo]
  }, [pairs, balanceResultsMap])
}

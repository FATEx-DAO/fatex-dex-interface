import { useMemo } from 'react'
import { CallState } from '../state/multicall/hooks'
import { JSBI, Pair } from '@fatex-dao/sdk'

export default function useEligibleXFatePools(
  pairs: (Pair | null)[],
  balanceResults: CallState[],
  minimumAmountWei = '1000'
): string[][] {
  return useMemo<string[][]>(() => {
    const claimFrom: string[] = []
    const claimTo: string[] = []

    for (let index = 0; pairs && index < pairs.length; index++) {
      const pair = pairs[index]
      const result = balanceResults[index]
      if (result && !result.loading && result?.result !== undefined && pair) {
        if (JSBI.GT(JSBI.BigInt(result?.result?.[0]), minimumAmountWei)) {
          claimFrom.push(pair.token0.address)
          claimTo.push(pair.token1.address)
        }
      }
    }

    return [claimFrom, claimTo]
  }, [pairs, balanceResults])
}

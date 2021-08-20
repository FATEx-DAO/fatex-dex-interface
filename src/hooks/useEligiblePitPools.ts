import { useMemo } from 'react'
import { CallState } from '../state/multicall/hooks'
import { JSBI } from '@fatex-dao/sdk'

export default function useEligiblePitPools(
  stakingPools: any,
  balanceResults: CallState[],
  minimumAmountWei = '10000000000000000'
): string[][] {
  return useMemo<string[][]>(() => {
    const claimFrom: string[] = []
    const claimTo: string[] = []

    for (let index = 0; stakingPools && index < stakingPools.length; index++) {
      const stakingPool = stakingPools[index]
      const result = balanceResults[index]
      if (result && !result.loading && result?.result !== undefined) {
        if (JSBI.GT(JSBI.BigInt(result?.result?.[0]), minimumAmountWei)) {
          claimFrom.push(stakingPool.tokens[0].address)
          claimTo.push(stakingPool.tokens[1].address)
        }
      }
    }

    return [claimFrom, claimTo]
  }, [stakingPools, balanceResults])
}

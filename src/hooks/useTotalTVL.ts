import { useMemo } from 'react'
import { Fraction, JSBI } from '@fatex-dao/sdk'
import { StakingInfo } from '../state/stake/hooks'

export default function useTotalTVL(stakingInfos: StakingInfo[]): Fraction {
  return useMemo(() => {
    return stakingInfos.reduce<Fraction>((memo, stakingInfo) => {
      if (stakingInfo && stakingInfo.valueOfTotalStakedAmountInUsd) {
        if (stakingInfo.valueOfTotalStakedAmountInUsd) {
          memo = memo.add(stakingInfo.valueOfTotalStakedAmountInUsd)
        }
      }
      return memo
    }, new Fraction(JSBI.BigInt(0), JSBI.BigInt(1)))
  }, [stakingInfos])
}

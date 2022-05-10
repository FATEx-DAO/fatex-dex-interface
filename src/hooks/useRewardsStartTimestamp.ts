import { useFateRewardController } from './useContract'
import { useMemo } from 'react'
import { JSBI } from '@fatex-dao/sdk'
import { useSingleCallResult } from '../state/multicall/hooks'

export default function useRewardsStartTimestamp(): JSBI | undefined {
  // const fateRewardController = useFateRewardController()
  // const rewardsStartTimestampResult = useSingleCallResult(fateRewardController, 'startTimestamp')
  // return rewardsStartTimestampResult.result?.[0]
  return useMemo(() => {
    const buffer = 86400 * 7
    return JSBI.BigInt(Math.floor(new Date().getTime() / 1000) - buffer)
  }, [])
}

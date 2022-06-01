import { useFateRewardController } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import { BigNumber } from 'ethers'

export default function useRewardsStartTimestamp(): BigNumber | undefined {
  const fateRewardController = useFateRewardController()
  const rewardsStartTimestampResult = useSingleCallResult(fateRewardController, 'startTimestamp')
  return rewardsStartTimestampResult.result?.[0]
}

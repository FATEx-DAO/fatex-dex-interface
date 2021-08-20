import { ChainId } from '@fatex-dao/sdk'
import { useMemo } from 'react'
import { STAKING_REWARDS_INFO } from '../constants/staking'

export default function useCalculateStakingInfoMembers(
  chainId: ChainId | undefined
): Record<string, number | undefined> {
  return useMemo(() => {
    const activeStakingInfos = chainId
      ? STAKING_REWARDS_INFO[chainId as ChainId]?.filter(stakingRewardInfo => stakingRewardInfo.active)
      : []
    const inactiveStakingInfos = chainId
      ? STAKING_REWARDS_INFO[chainId as ChainId]?.filter(stakingRewardInfo => !stakingRewardInfo.active)
      : []

    return {
      active: activeStakingInfos?.length,
      inactive: inactiveStakingInfos?.length
    }
  }, [chainId])
}

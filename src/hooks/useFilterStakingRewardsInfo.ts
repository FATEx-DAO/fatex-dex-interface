import { useMemo } from 'react'
import { ChainId, Pair } from '@fatex-dao/sdk'
import { STAKING_REWARDS_INFO, StakingRewardsInfo } from '../constants/staking'

export default function useFilterStakingRewardsInfo(
  chainId: ChainId | undefined,
  active: boolean | undefined = undefined,
  pairToFilterBy?: Pair | null
): StakingRewardsInfo[] {
  return useMemo(() => {
    const pools = chainId
      ? STAKING_REWARDS_INFO[chainId]?.filter(stakingRewardInfo =>
          pairToFilterBy === undefined
            ? true
            : pairToFilterBy === null
            ? false
            : pairToFilterBy.involvesToken(stakingRewardInfo.tokens[0]) &&
              pairToFilterBy.involvesToken(stakingRewardInfo.tokens[1])
        ) ?? []
      : []

    if (active !== undefined) {
      return pools?.filter(stakingRewardInfo => stakingRewardInfo.active === active) ?? []
    }

    return pools
  }, [chainId, active, pairToFilterBy])
}

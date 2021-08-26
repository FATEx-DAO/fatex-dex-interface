import { useMemo } from 'react'
import { StakingInfo } from '../state/stake/hooks'
import useTotalTVL from './useTotalTVL'
import useXFateTVL from './useXFateTVL'

export default function useTotalCombinedTVL(stakingInfos: StakingInfo[]): Record<string, any> {
  const totalStakingPoolTVL = useTotalTVL(stakingInfos)
  const totalXFateTVL = useXFateTVL()

  return useMemo(() => {
    return {
      stakingPoolTVL: totalStakingPoolTVL ? totalStakingPoolTVL : undefined,
      totalXFateTVL: totalXFateTVL ? totalXFateTVL : undefined,
      totalCombinedTVL: totalStakingPoolTVL && totalXFateTVL ? totalStakingPoolTVL.add(totalXFateTVL) : undefined
    }
  }, [stakingInfos, totalStakingPoolTVL, totalXFateTVL])
}

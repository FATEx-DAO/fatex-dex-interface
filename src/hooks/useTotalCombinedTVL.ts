import { useMemo } from 'react'
import { StakingInfo } from '../state/stake/hooks'
import useTotalTVL from './useTotalTVL'
import useXFateTVL from './useXFateTVL'

export default function useTotalCombinedTVL(stakingInfos: StakingInfo[]): Record<string, any> {
  const totalStakingPoolTVL = useTotalTVL(stakingInfos)
  const totalPitTVL = useXFateTVL()

  return useMemo(() => {
    return {
      stakingPoolTVL: totalStakingPoolTVL ? totalStakingPoolTVL : undefined,
      totalPitTVL: totalPitTVL ? totalPitTVL : undefined,
      totalCombinedTVL: totalStakingPoolTVL && totalPitTVL ? totalStakingPoolTVL.add(totalPitTVL) : undefined
    }
  }, [stakingInfos, totalStakingPoolTVL, totalPitTVL])
}

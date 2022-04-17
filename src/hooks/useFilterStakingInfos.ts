import { useMemo } from 'react'
import { StakingInfo } from '../state/stake/hooks'

export default function useFilterStakingInfos(
  stakingInfos: StakingInfo[],
  isActive: boolean | undefined = undefined,
  onlyStaked: boolean | undefined = undefined
): StakingInfo[] {
  const filteredStakingInfos = useMemo(() => {
    if (isActive !== undefined) {
      return stakingInfos.filter(s => s.active === isActive)
    } else {
      return stakingInfos
    }
  }, [isActive, stakingInfos])

  return useMemo(() => {
    if (onlyStaked !== undefined) {
      return filteredStakingInfos
        .filter(s => s.earnedAmount.greaterThan('0'))
        .sort((a, b) => {
          if (a.earnedAmount === undefined || b.earnedAmount === undefined) {
            return a.pid > b.pid ? -1 : 1
          }
          return b.earnedAmount.greaterThan(a.earnedAmount) ? 1 : -1
        })
    }

    return filteredStakingInfos.sort((a, b) => {
      if (a.apr === undefined || b.apr === undefined || (a.apr.equalTo('0') && b.apr.equalTo('0'))) {
        return a.pid > b.pid ? 1 : -1
      }
      return b.apr.greaterThan(a.apr) ? 1 : -1
    })
  }, [filteredStakingInfos, onlyStaked])
}

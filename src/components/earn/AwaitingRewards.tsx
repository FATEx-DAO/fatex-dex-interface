import React, { useMemo } from 'react'
import { AutoColumn } from '../Column'
import { JSBI } from '@fatex-dao/sdk'
import { TYPE } from '../../theme'
import { BlueCard } from '../Card'
import useGovernanceToken from '../../hooks/useGovernanceToken'
import useCurrentBlockTimestamp from '../../hooks/useCurrentBlockTimestamp'
import moment from 'moment'
import useRewardsStartTimestamp from '../../hooks/useRewardsStartTimestamp'
import { MaxUint256 } from '@ethersproject/constants'

export default function AwaitingRewards() {
  const govToken = useGovernanceToken()

  const rewardsStartTimestamp = useRewardsStartTimestamp()
  const currentTimestamp = useCurrentBlockTimestamp()

  const rewardsStarted = useMemo<boolean>(() => {
    if (!rewardsStartTimestamp || !currentTimestamp) {
      return true
    }

    return JSBI.greaterThanOrEqual(JSBI.BigInt(currentTimestamp.toString()), rewardsStartTimestamp)
  }, [rewardsStartTimestamp, currentTimestamp])

  const rewardStartString =
    rewardsStartTimestamp && JSBI.notEqual(rewardsStartTimestamp, JSBI.BigInt(MaxUint256.toString()))
      ? moment(Number(rewardsStartTimestamp.toString()) * 1000).format('lll')
      : 'Unknown Timestamp'

  return (
    <>
      {rewardsStartTimestamp && !rewardsStarted && (
        <BlueCard width={'100%'}>
          <AutoColumn gap="10px">
            <TYPE.link fontWeight={400} color={'text1'}>
              <span role="img" aria-label="wizard-icon" style={{ marginRight: '8px' }}>
                💡
              </span>
              <b>NOTICE: </b>
              {govToken?.symbol} rewards haven&apos;t started yet - they will be activated on <b>{rewardStartString}</b>
              .
              <br />
              <br />
              <br />
              You can deposit your LP tokens now if you want to, and you&apos;ll start earning rewards at{' '}
              <b>{rewardStartString}</b> and thereafter.
            </TYPE.link>
          </AutoColumn>
        </BlueCard>
      )}
    </>
  )
}

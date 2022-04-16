import React, { useMemo } from 'react'
import { AutoColumn } from '../Column'
import { JSBI } from '@fatex-dao/sdk'
import { TYPE } from '../../theme'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { useFateRewardController } from '../../hooks/useContract'
import { BlueCard } from '../Card'
import useGovernanceToken from '../../hooks/useGovernanceToken'
import useCurrentBlockTimestamp from '../../hooks/useCurrentBlockTimestamp'
import moment from 'moment'

export default function AwaitingRewards() {
  const fateRewardController = useFateRewardController()
  const govToken = useGovernanceToken()

  const rewardsStartTimestamp = useSingleCallResult(fateRewardController, 'startTimestamp').result?.[0]
  const currentTimestamp = useCurrentBlockTimestamp()

  const rewardsStarted = useMemo<boolean>(() => {
    return rewardsStartTimestamp && currentTimestamp
      ? JSBI.greaterThanOrEqual(JSBI.BigInt(currentTimestamp), JSBI.BigInt(rewardsStartTimestamp)) &&
          JSBI.notEqual(JSBI.BigInt(rewardsStartTimestamp), JSBI.BigInt('0'))
      : false
  }, [rewardsStartTimestamp, currentTimestamp])

  const rewardStartString =
    rewardsStartTimestamp && JSBI.notEqual(JSBI.BigInt(rewardsStartTimestamp), JSBI.BigInt('0'))
      ? moment(new Date(JSBI.BigInt(rewardsStartTimestamp).toString())).format('lll')
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
              <b>{govToken?.symbol}</b> rewards haven&apos;t started yet - they will be activated at{' '}
              <b>{rewardStartString}</b>.
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

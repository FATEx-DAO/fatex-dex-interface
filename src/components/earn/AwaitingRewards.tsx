import React, { useMemo } from 'react'
import { AutoColumn } from '../../components/Column'
import { JSBI } from '@venomswap/sdk'
import { TYPE } from '../../theme'
import { useBlockNumber } from '../../state/application/hooks'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { useMasterBreederContract } from '../../hooks/useContract'
import useBlockchain from '../../hooks/useBlockchain'
import getBlockchainBlockTime from '../../utils/getBlockchainBlockTime'
import { BlueCard } from '../../components/Card'
import useGovernanceToken from '../../hooks/useGovernanceToken'

const MINUTE = 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

export default function AwaitingRewards() {
  const blockchain = useBlockchain()
  const blockTime = getBlockchainBlockTime(blockchain)
  const masterBreederContract = useMasterBreederContract()
  const govToken = useGovernanceToken()

  const rewardsStartBlock = useSingleCallResult(masterBreederContract, 'START_BLOCK').result?.[0]
  const currentBlock = useBlockNumber()

  const rewardsStarted = useMemo<boolean>(() => {
    return rewardsStartBlock && currentBlock
      ? JSBI.greaterThanOrEqual(JSBI.BigInt(currentBlock), JSBI.BigInt(rewardsStartBlock))
      : false
  }, [rewardsStartBlock, currentBlock])

  const blocksLeftUntilRewards = useMemo<number>(() => {
    return rewardsStartBlock && currentBlock ? rewardsStartBlock - currentBlock : 0
  }, [rewardsStartBlock, currentBlock])

  const secondsToRewards = !rewardsStarted ? blocksLeftUntilRewards * blockTime : 0
  let startingAt = secondsToRewards
  const days = (startingAt - (startingAt % DAY)) / DAY
  startingAt -= days * DAY
  const hours = (startingAt - (startingAt % HOUR)) / HOUR
  startingAt -= hours * HOUR
  const minutes = (startingAt - (startingAt % MINUTE)) / MINUTE
  startingAt -= minutes * MINUTE
  const seconds = startingAt

  return (
    <>
      {rewardsStartBlock && blocksLeftUntilRewards && !rewardsStarted && (
        <BlueCard>
          <AutoColumn gap="10px">
            <TYPE.link fontWeight={400} color={'text1'}>
              <span role="img" aria-label="wizard-icon" style={{ marginRight: '8px' }}>
                💡
              </span>
              <b>{govToken?.symbol}</b> rewards haven&apos;t started yet - they will be activated at block{' '}
              <b>{rewardsStartBlock?.toLocaleString()}</b>. There are <b>{blocksLeftUntilRewards}</b> blocks left until
              the rewards start.
              <br />
              <br />
              Expected start:{' '}
              <b>
                {days ? `${days} ${days === 1 ? 'day' : 'days'}, ` : ''}
                {hours ? `${hours} ${hours === 1 ? 'hour' : 'hours'}, ` : ''}
                {minutes ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ` : ''}
                {seconds
                  ? `${minutes && minutes > 0 ? 'and ' : ''}${seconds} ${seconds === 1 ? 'second' : 'seconds'}`
                  : ''}
              </b>{' '}
              from now.
              <br />
              <br />
              You can deposit your LP tokens now if you want to, and you&apos;ll start earning rewards at block{' '}
              <b>{rewardsStartBlock?.toLocaleString()}</b> and thereafter.
            </TYPE.link>
          </AutoColumn>
        </BlueCard>
      )}
    </>
  )
}

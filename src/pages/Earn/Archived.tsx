import React from 'react'
import { JSBI } from '@fatex-dao/sdk'
import { BLOCKCHAIN_SETTINGS } from '@fatex-dao/sdk-extra'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { STAKING_REWARDS_INFO } from '../../constants/staking'
import { useStakingInfo } from '../../state/stake/hooks'
import { TYPE } from '../../theme'
//import { ButtonPrimary } from '../../components/Button'
import PoolCard from '../../components/earn/PoolCard'
import AwaitingRewards from '../../components/earn/AwaitingRewards'
import { RowBetween } from '../../components/Row'
import { CardSection, ExtraDataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
//import { Countdown } from './Countdown'
import Loader from '../../components/Loader'
import { useActiveWeb3React } from '../../hooks'
import useGovernanceToken from '../../hooks/useGovernanceToken'
import useBaseStakingRewardsSchedule from '../../hooks/useBaseStakingRewardsSchedule'
import { OutlineCard } from '../../components/Card'
import useFilterStakingInfos from '../../hooks/useFilterStakingInfos'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const TopSection = styled(AutoColumn)`
  max-width: 720px;
  width: 100%;
`
/*
const ButtonWrapper = styled(AutoColumn)`
  max-width: 150px;
  width: 100%;
`
<ButtonWrapper>
  <StyledInternalLink to={`/claimAllRewards`} style={{ width: '100%' }}>
    <ButtonPrimary padding="8px" borderRadius="8px" >
      Claim all rewards
    </ButtonPrimary>
  </StyledInternalLink>
</ButtonWrapper>
*/

const PoolSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 15px;
  width: 100%;
  justify-self: center;
`

const DataRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
flex-direction: column;
`};
`

export default function EarnArchived() {
  const { chainId, account } = useActiveWeb3React()
  const govToken = useGovernanceToken()
  const blockchainSettings = chainId ? BLOCKCHAIN_SETTINGS[chainId] : undefined
  const allStakingInfos = useStakingInfo(true)
  const stakingInfos = useFilterStakingInfos(allStakingInfos, false)

  /**
   * only show staking cards with balance
   * @todo only account for this if rewards are inactive
   */
  //const stakingInfosWithBalance = stakingInfos?.filter(s => JSBI.greaterThan(s.stakedAmount.raw, BIG_INT_ZERO))

  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)

  const baseRewards = useBaseStakingRewardsSchedule()
  const blocksPerMinute = blockchainSettings?.blockTime ? 60 / blockchainSettings.blockTime : 0
  const rewardsPerMinute =
    baseRewards && blockchainSettings ? baseRewards.multiply(JSBI.BigInt(blocksPerMinute)) : undefined

  const inactiveStakingInfos = useFilterStakingInfos(stakingInfos, false)

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="md">
        <ExtraDataCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>{govToken?.symbol} liquidity mining</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  Deposit your Liquidity Provider tokens to receive {govToken?.symbol}, the {govToken?.name} Protocol
                  governance token.
                </TYPE.white>
              </RowBetween>{' '}
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </ExtraDataCard>
      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Pools</TYPE.mediumHeader>
        </DataRow>

        <AwaitingRewards />

        <PoolSection>
          {account && stakingRewardsExist && stakingInfos?.length === 0 ? (
            <Loader style={{ margin: 'auto' }} />
          ) : account && !stakingRewardsExist ? (
            <OutlineCard>No active pools</OutlineCard>
          ) : account && stakingInfos?.length !== 0 && !inactiveStakingInfos ? (
            <OutlineCard>No active pools</OutlineCard>
          ) : !account ? (
            <OutlineCard>Please connect your wallet to see available pools</OutlineCard>
          ) : (
            inactiveStakingInfos?.map(stakingInfo => {
              // need to sort by added liquidity here
              return <PoolCard key={stakingInfo.pid} stakingInfo={stakingInfo} isArchived={true} />
            })
          )}
        </PoolSection>

        {stakingRewardsExist && baseRewards && (
          <TYPE.main style={{ textAlign: 'center' }} fontSize={14}>
            <span role="img" aria-label="wizard-icon" style={{ marginRight: '8px' }}>
              ☁️
            </span>
            The base reward rate is currently <b>{baseRewards.toSignificant(4, { groupSeparator: ',' })}</b>{' '}
            {govToken?.symbol} per block.
            <br />
            <b>{rewardsPerMinute?.toSignificant(4, { groupSeparator: ',' })}</b> {govToken?.symbol}
            will be minted every minute given the current reward schedule.
            <br />
            <br />
            <TYPE.small style={{ textAlign: 'center' }} fontSize={10}>
              * = The APR is calculated using a very simplified formula, it might not fully represent the exact APR
              <br />
              when factoring in the dynamic reward schedule and the locked/unlocked rewards vesting system.
            </TYPE.small>
          </TYPE.main>
        )}
      </AutoColumn>
    </PageWrapper>
  )
}

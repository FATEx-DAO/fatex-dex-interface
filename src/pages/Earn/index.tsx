import React, { useState } from 'react'
import { JSBI } from '@fatex-dao/sdk'
import { BLOCKCHAIN_SETTINGS } from '@fatex-dao/sdk-extra'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { STAKING_REWARDS_INFO } from '../../constants/staking'
import { useStakingInfo } from '../../state/stake/hooks'
import { TYPE, StyledInternalLink } from '../../theme'
import PoolCard from '../../components/earn/PoolCard'
import { CustomButtonWhite } from '../../components/Button'
import AwaitingRewards from '../../components/earn/AwaitingRewards'
import { RowBetween } from '../../components/Row'
import { CardSection, CardNoise, CardBGImage } from '../../components/earn/styled'
import Loader from '../../components/Loader'
import ClaimAllRewardsModal from '../../components/earn/ClaimAllRewardsModal'
import { useActiveWeb3React } from '../../hooks'
import useGovernanceToken from '../../hooks/useGovernanceToken'
import useCalculateStakingInfoMembers from '../../hooks/useCalculateStakingInfoMembers'
import useTotalCombinedTVL from '../../hooks/useTotalCombinedTVL'
import useBaseStakingRewardsSchedule from '../../hooks/useBaseStakingRewardsSchedule'
import { OutlineCard } from '../../components/Card'
import useFilterStakingInfos from '../../hooks/useFilterStakingInfos'
import CombinedTVL from '../../components/CombinedTVL'
//import GovTokenBalanceContent from '../../components/Header/GovTokenBalanceContent'

const PageWrapper = styled(AutoColumn)`
  max-width: 1200px;
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

const TVLWrapper = styled.div`
  width: 100%;
  display: inline-block;
`

const LoaderWrapper = styled.div`
  width: 100%;
  text-align: center;
  transform: translateY(60px);
`

const StakingInfo = styled.div`
  background: ${({ theme }) => theme.bg3};
  border-radius: 8px;
  width: 30%;
  position: relative;
  overflow: hidden;
  display: inline-block;
  vertical-align: top;
  text-align: left;
`

const PoolSectionsWrapper = styled.div`
  width: 100%;
  text-align: center;
`

const PoolSection = styled.div`
  display: inline-block;
  vertical-align: top;
  margin: 0 10px;
  width: 30%;
  text-align: left;

  > div:nth-of-type(1) {
    margin-top: 0 !important;
  }
`

export default function Earn() {
  const { chainId, account } = useActiveWeb3React()
  const govToken = useGovernanceToken()
  const blockchainSettings = chainId ? BLOCKCHAIN_SETTINGS[chainId] : undefined
  const activePoolsOnly = true
  const stakingInfos = useStakingInfo(activePoolsOnly)

  const [showClaimRewardsModal, setShowClaimRewardsModal] = useState(false)

  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)

  const baseRewards = useBaseStakingRewardsSchedule()
  const blocksPerMinute = blockchainSettings?.blockTime ? 60 / blockchainSettings.blockTime : 0
  const rewardsPerMinute =
    baseRewards && blockchainSettings ? baseRewards.multiply(JSBI.BigInt(blocksPerMinute)) : undefined

  const activeStakingInfos = useFilterStakingInfos(stakingInfos, activePoolsOnly)
  const inactiveStakingInfos = useFilterStakingInfos(stakingInfos, false)
  const stakingInfoStats = useCalculateStakingInfoMembers(chainId)
  const hasArchivedStakingPools =
    (stakingInfoStats?.inactive && stakingInfoStats?.inactive > 0) || inactiveStakingInfos?.length > 0

  const stakingInfosWithRewards = useFilterStakingInfos(activeStakingInfos, true, true)

  const TVLs = useTotalCombinedTVL(activeStakingInfos)

  return (
    <PageWrapper gap="lg" justify="center">
      <ClaimAllRewardsModal
        isOpen={showClaimRewardsModal}
        onDismiss={() => setShowClaimRewardsModal(false)}
        stakingInfos={stakingInfosWithRewards}
      />

      <PoolSectionsWrapper>
        <AwaitingRewards />

        <StakingInfo>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>{govToken?.symbol} liquidity staking</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  Deposit your Liquidity Provider tokens to receive {govToken?.symbol}, the {govToken?.name} Protocol
                  governance token.
                </TYPE.white>
              </RowBetween>
              <RowBetween>
                {TVLs?.stakingPoolTVL?.greaterThan('0') && (
                  <TVLWrapper>
                    <CombinedTVL />
                  </TVLWrapper>
                )}
              </RowBetween>
              <RowBetween>{/*<GovTokenBalanceContent inline={true} />*/}</RowBetween>{' '}
              {stakingInfosWithRewards?.length > 0 && (
                <RowBetween>
                  <CustomButtonWhite
                    padding="8px"
                    borderRadius="8px"
                    width="7em"
                    onClick={() => setShowClaimRewardsModal(true)}
                  >
                    Claim all ({stakingInfosWithRewards.length})
                  </CustomButtonWhite>
                </RowBetween>
              )}
              {hasArchivedStakingPools && (
                <RowBetween>
                  <StyledInternalLink to={`/staking/archived`}>
                    <CustomButtonWhite padding="8px" borderRadius="8px">
                      Archived Pools
                    </CustomButtonWhite>
                  </StyledInternalLink>
                </RowBetween>
              )}
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </StakingInfo>
        <PoolSection>
          {account && stakingRewardsExist && stakingInfos?.length === 0 ? (
            <LoaderWrapper>
              <Loader style={{ margin: 'auto' }} />
            </LoaderWrapper>
          ) : account && !stakingRewardsExist ? (
            <OutlineCard>No active pools</OutlineCard>
          ) : account && stakingInfos?.length !== 0 && !activeStakingInfos ? (
            <OutlineCard>No active pools</OutlineCard>
          ) : !account ? (
            <OutlineCard>Please connect your wallet to see available pools</OutlineCard>
          ) : (
            activeStakingInfos?.map(stakingInfo => {
              // need to sort by added liquidity here
              return (
                stakingInfo?.baseToken?.symbol?.includes('FATE') && (
                  <PoolCard key={stakingInfo.pid} stakingInfo={stakingInfo} isArchived={false} />
                )
              )
            })
          )}
        </PoolSection>
        <PoolSection>
          {account && stakingRewardsExist && stakingInfos?.length === 0 ? (
            <LoaderWrapper>
              <Loader style={{ margin: 'auto' }} />
            </LoaderWrapper>
          ) : account && !stakingRewardsExist ? (
            <OutlineCard>No active pools</OutlineCard>
          ) : account && stakingInfos?.length !== 0 && !activeStakingInfos ? (
            <OutlineCard>No active pools</OutlineCard>
          ) : !account ? (
            <OutlineCard>Please connect your wallet to see available pools</OutlineCard>
          ) : (
            activeStakingInfos?.map(stakingInfo => {
              // need to sort by added liquidity here
              return (
                !stakingInfo?.baseToken?.symbol?.includes('FATE') && (
                  <PoolCard key={stakingInfo.pid} stakingInfo={stakingInfo} isArchived={false} />
                )
              )
            })
          )}
        </PoolSection>

        {stakingRewardsExist && baseRewards && (
          <TYPE.main style={{ textAlign: 'center' }} fontSize={14}>
            <span role="img" aria-label="wizard-icon" style={{ marginRight: '8px' }}>
              ☁️
            </span>
            The base rewards rate is currently <b>{baseRewards.toSignificant(4, { groupSeparator: ',' })}</b>{' '}
            {govToken?.symbol} per block.w
            <br />
            <b>{rewardsPerMinute?.toSignificant(4, { groupSeparator: ',' })}</b> {govToken?.symbol}
            will be minted every minute given the current rewards schedule.
            <br />
            <br />
            <TYPE.small style={{ textAlign: 'center' }} fontSize={10}>
              * = The APR is calculated using a very simplified formula, it might not fully represent the exact APR
              <br />
              when factoring in the dynamic rewards schedule and the locked/unlocked rewards vesting system.
            </TYPE.small>
          </TYPE.main>
        )}
      </PoolSectionsWrapper>
    </PageWrapper>
  )
}

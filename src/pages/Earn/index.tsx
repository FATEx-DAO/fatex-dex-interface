import React, { useState } from 'react'
import { JSBI } from '@fatex-dao/sdk'
import { BLOCKCHAIN_SETTINGS } from '@fatex-dao/sdk-extra'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { STAKING_REWARDS_INFO } from '../../constants/staking'
import { useStakingInfo } from '../../state/stake/hooks'
import { StyledInternalLink, TYPE } from '../../theme'
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
import useBaseStakingRewardsSchedule from '../../hooks/useBaseStakingRewardsSchedule'
import { OutlineCard } from '../../components/Card'
import useFilterStakingInfos from '../../hooks/useFilterStakingInfos'
//import GovTokenBalanceContent from '../../components/Header/GovTokenBalanceContent'
import Pool from '../Pool'

const PageWrapper = styled(AutoColumn)`
  max-width: 1800px;
  width: 100%;
  padding: 16px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0;
  `};
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

const LoaderWrapper = styled.div<{ second?: boolean }>`
  width: 100%;
  text-align: center;
  transform: translateY(60px);

  ${({ theme, second }) => theme.mediaWidth.upToMedium`
    ${second && 'display: none;'}
  `}
`

const StakingInfo = styled.div`
  background: ${({ theme }) => theme.bg3};
  border-radius: 8px;
  width: 100%;
  position: relative;
  overflow: hidden;
  display: inline-block;
  vertical-align: top;
  text-align: left;
  margin-bottom: 20px;
`

const PoolSectionsWrapper = styled.div`
  text-align: center;
  width: 100%;
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

  @media screen and (max-width: 1100px) {
    width: 100%;
    max-width: 800px;
    margin: 0;

    > div {
      margin-left: auto;
      margin-right: auto;
      width: 100%;
      max-width: none;

      > div:nth-of-type(1) {
        > div:nth-of-type(2) > div {
          font-size: 20px !important;
        }

        > div > div:nth-of-type(2) {
          font-size: 20px;
        }
      }
    }
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    > div:nth-of-type(1) {
      margin-bottom: 10px;
    }
  `};
`

const StakingSection = styled(PoolSection)`
  width: 50%;
  min-width: 320px;
  margin: 0;
`

const RightSideWrapper = styled.div`
  width: 60%;
  max-width: 800px;
  min-width: 600px;
  display: inline-block;
  vertical-align: top;
  margin-left: 1%;

  @media screen and (max-width: 1100px) {
    width: 100%;
    margin-top: 25px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-width: auto;
    margin-left: 0;
  `};
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

  return (
    <PageWrapper gap="lg" justify="center">
      <ClaimAllRewardsModal
        isOpen={showClaimRewardsModal}
        onDismiss={() => setShowClaimRewardsModal(false)}
        stakingInfos={stakingInfosWithRewards}
      />

      <PoolSectionsWrapper>
        <AwaitingRewards />
        <PoolSection>
          <Pool />
        </PoolSection>
        <RightSideWrapper>
          <StakingInfo>
            <CardBGImage />
            <CardNoise />
            <CardSection>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white fontWeight={600}>Stake Liquidity Pool Tokens</TYPE.white>
                </RowBetween>
                <RowBetween>
                  <TYPE.white fontSize={14}>
                    LP tokens you hold for any of the pairs shown below can be staked to receive rewards.
                  </TYPE.white>
                </RowBetween>
                <RowBetween>
                  <TYPE.white fontSize={14}>
                    Stake your LP tokens to receive FATE, the FATExDAO governance token.
                  </TYPE.white>
                </RowBetween>
                <RowBetween>{/*<GovTokenBalanceContent inline={true} />*/}</RowBetween>{' '}
                <RowBetween>
                  {stakingInfosWithRewards?.length > 0 && (
                    <CustomButtonWhite
                      padding="8px"
                      borderRadius="8px"
                      width="7em"
                      onClick={() => setShowClaimRewardsModal(true)}
                    >
                      Claim all ({stakingInfosWithRewards.length})
                    </CustomButtonWhite>
                  )}
                  {hasArchivedStakingPools && (
                    <StyledInternalLink to={`/depository/archived`}>
                      <CustomButtonWhite padding="8px" borderRadius="8px">
                        Archived Pools
                      </CustomButtonWhite>
                    </StyledInternalLink>
                  )}
                </RowBetween>
              </AutoColumn>
            </CardSection>
            <CardBGImage />
            <CardNoise />
          </StakingInfo>

          <StakingSection>
            {account && stakingRewardsExist && stakingInfos?.length === 0 ? (
              <LoaderWrapper>
                <Loader style={{ margin: 'auto' }} />
              </LoaderWrapper>
            ) : account && !stakingRewardsExist ? (
              <OutlineCard style={{ width: '200%' }}>No active pools</OutlineCard>
            ) : account && stakingInfos?.length !== 0 && !activeStakingInfos ? (
              <OutlineCard style={{ width: '200%' }}>No active pools</OutlineCard>
            ) : !account ? (
              <OutlineCard style={{ width: '200%', textAlign: 'center', maxWidth: '90vw' }}>
                Please connect your wallet to see available pools
              </OutlineCard>
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
          </StakingSection>
          <StakingSection>
            {account && stakingRewardsExist && stakingInfos?.length === 0 ? (
              <LoaderWrapper second={true}>
                <Loader style={{ margin: 'auto' }} />
              </LoaderWrapper>
            ) : account && !stakingRewardsExist ? (
              <></>
            ) : account && stakingInfos?.length !== 0 && !activeStakingInfos ? (
              <></>
            ) : !account ? (
              <></>
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
          </StakingSection>
        </RightSideWrapper>

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

import React, { useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { STAKING_REWARDS_INFO } from '../../constants/staking'
import { useStakingInfo } from '../../state/stake/hooks'
import { StyledInternalLink, TYPE } from '../../theme'
import PoolCard from '../../components/earn/PoolCard'
import { CustomButtonWhite } from '../../components/Button'
import AwaitingRewards from '../../components/earn/AwaitingRewards'
import { CardBGImage, CardNoise } from '../../components/earn/styled'
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
import Pool from '../Pool'

const PageWrapper = styled(AutoColumn)`
  max-width: 1800px;
  width: 100%;
  padding: 16px;
  margin-top: -50px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0;
    margin-top: 0;
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

const TVLWrapper = styled.div`
  width: 100%;
  display: inline-block;
  margin-bottom: -7px;
  text-align: right;
`

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
  margin-bottom: 50px;
`

const PoolSectionsWrapper = styled.div`
  text-align: center;
  width: 100%;
`

const PoolSection = styled.div`
  display: inline-block;
  vertical-align: top;
  margin: 0 10px;
  width: 36%;
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

  @media screen and (max-width: 1099px) {
    width: 100%;
  }
`

const RightSideWrapper = styled.div<{ tvlLoaded: boolean }>`
  width: 60%;
  max-width: 800px;
  min-width: 600px;
  display: inline-block;
  vertical-align: top;
  margin-left: 5%;
  ${({ tvlLoaded }) => tvlLoaded && 'margin-top: -20px;'} @media screen and(max-width: 2000 px) {
    margin-left: 4%;
  }

  @media screen and (max-width: 1800px) {
    margin-left: 3%;
  }

  @media screen and (max-width: 1500px) {
    margin-left: 2%;
  }

  @media screen and (max-width: 1100px) {
    width: 100%;
    margin-top: 25px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-width: auto;
    margin-left: 0;
    margin-top: 0;
  `};
`

const TitleCard = styled.div`
  padding: 1rem;
`

const InfoLeft = styled.div`
  width: calc(100% - 150px);
  min-width: 300px;
  display: inline-block;
  vertical-align: top;

  > div {
    margin-top: 10px;
  }

  > div:nth-of-type(1) {
    margin-top: 0;
  }
`

const InfoRight = styled.div`
  width: 150px;
  height: 100%;
  display: inline-block;
  vertical-align: top;
  text-align: right;

  > button {
    display: inline-block;
    margin-top: 8px;
  }

  @media screen and (max-width: 500px) {
    width: 100%;

    > button {
      margin-top: 10px;
      width: 100%;
    }
  }
`

const ArchivedWrapper = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
`

export default function Earn() {
  const { chainId, account } = useActiveWeb3React()
  const govToken = useGovernanceToken()
  const activePoolsOnly = true
  const stakingInfos = useStakingInfo(activePoolsOnly)

  const [showClaimRewardsModal, setShowClaimRewardsModal] = useState(false)

  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)

  const baseRewards = useBaseStakingRewardsSchedule()
  const rewardsPerMinute = baseRewards ? baseRewards.multiply('60') : undefined

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
        <PoolSection>
          <Pool />
        </PoolSection>
        <RightSideWrapper tvlLoaded={TVLs?.stakingPoolTVL?.greaterThan('0')}>
          {TVLs?.stakingPoolTVL?.greaterThan('0') && (
            <TVLWrapper>
              <CombinedTVL />
            </TVLWrapper>
          )}
          <StakingInfo>
            <CardBGImage />
            <CardNoise />
            <TitleCard>
              <div>
                <InfoLeft>
                  <TYPE.white fontWeight={600}>Stake Liquidity Pool Tokens</TYPE.white>
                  <TYPE.white fontSize={14}>
                    LP tokens you hold for any of the pairs shown below can be staked to receive rewards.
                  </TYPE.white>
                  <TYPE.white fontSize={14}>
                    Stake your LP tokens to receive FATE, the FATExFI governance token.
                  </TYPE.white>
                </InfoLeft>
                <InfoRight>
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
                </InfoRight>
              </div>
            </TitleCard>
            <CardBGImage />
            <CardNoise />
          </StakingInfo>

          <StakingInfo>
            <AwaitingRewards />
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

          {hasArchivedStakingPools && (
            <ArchivedWrapper>
              <StyledInternalLink width={'50%'} to={`/depository/archived`}>
                <CustomButtonWhite padding="8px" borderRadius="8px">
                  Archived Pools
                </CustomButtonWhite>
              </StyledInternalLink>
            </ArchivedWrapper>
          )}
        </RightSideWrapper>

        {stakingRewardsExist && baseRewards && (
          <TYPE.main style={{ textAlign: 'center' }} fontSize={14}>
            <span role="img" aria-label="wizard-icon" style={{ marginRight: '8px' }}>
              ☁️
            </span>
            The base rewards rate is currently <b>{baseRewards.toSignificant(4, { groupSeparator: ',' })}</b>{' '}
            {govToken?.symbol} per second.
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

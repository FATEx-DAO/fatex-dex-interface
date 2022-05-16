import React, { useCallback, useMemo, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { Link, RouteComponentProps } from 'react-router-dom'

import { Fraction, JSBI, TokenAmount } from '@fatex-dao/sdk'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { useCurrency } from '../../hooks/Tokens'
import { useWalletModalToggle } from '../../state/application/hooks'
import { ExternalLink, TYPE } from '../../theme'

import { RowBetween } from '../../components/Row'
import { CardBGImage, CardNoise, CardSection, DataCard } from '../../components/earn/styled'
import { ButtonEmpty, ButtonPrimary } from '../../components/Button'
import StakingModal from '../../components/earn/StakingModal'
import AwaitingRewards from '../../components/earn/AwaitingRewards'
import { useStakingInfo } from '../../state/stake/hooks'
import ModifiedUnstakingModal from '../../components/earn/ModifiedUnstakingModal'
import ClaimRewardModal from '../../components/earn/ClaimRewardModal'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useColor } from '../../hooks/useColor'
import { CountUp } from 'use-count-up'

import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { currencyId } from '../../utils/currencyId'
import { usePair } from '../../data/Reserves'
import usePrevious from '../../hooks/usePrevious'
import { BIG_INT_ZERO, FEES_URL } from '../../constants'
import useGovernanceToken from '../../hooks/useGovernanceToken'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { useFateRewardController } from '../../hooks/useContract'
import { getEpochFromWeekIndex } from '../../constants/epoch'
import useCurrentBlockTimestamp from '../../hooks/useCurrentBlockTimestamp'
import { LightQuestionHelper } from '../../components/QuestionHelper'
import moment from 'moment'
import Loader from '../../components/Loader'
import useRewardsStartTimestamp from '../../hooks/useRewardsStartTimestamp'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const PositionInfo = styled(AutoColumn)<{ dim: any }>`
  position: relative;
  max-width: 640px;
  width: 100%;
  opacity: ${({ dim }) => (dim ? 0.6 : 1)};
`

const BottomSection = styled(AutoColumn)`
  border-radius: 8px;
  width: 100%;
  position: relative;
`

const StyledDataCard = styled(DataCard)<{ bgColor?: any; showBackground?: any }>`
  /*background: radial-gradient(76.02% 75.41% at 1.84% 0%, #1e1a31 0%, #3d51a5 100%);*/
  z-index: 2;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    /*background: ${({ theme, bgColor, showBackground }) =>
      `radial-gradient(91.85% 100% at 1.84% 0%, ${bgColor} 0%,  ${showBackground ? theme.black : theme.bg5} 100%) `};*/
  background: ${({ theme }) => theme.bg3};
`

const StyledBottomCard = styled(DataCard)<{ dim: any }>`
  background: ${({ theme }) => theme.bg2};
  opacity: ${({ dim }) => (dim ? 0.4 : 1)};
  margin-top: -40px;
  padding: 32px 1.25rem 1rem;
  z-index: 1;
`

const PoolData = styled(DataCard)`
  background: none;
    /*border: 1px solid ${({ theme }) => theme.bg4};*/
  padding: 1rem 0.5rem;
  z-index: 1;

  > div > div {
    :nth-of-type(1) {
      font-size: 18px;
    }

    :nth-of-type(2) {
      font-size: 26px;
    }
  }
`

const VoteCard = styled(DataCard)`
  /*background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);*/
  background: ${({ theme }) => theme.bg3};
  overflow: hidden;

  > div > div > a {
    background-color: ${({ theme }) => theme.bg3};

    :hover {
      color: ${({ theme }) => theme.bg3};
    }
  }
`

const DataRow = styled(RowBetween)`
  justify-content: center;
  gap: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    gap: 12px;
  `};
`

export default function Manage({
  match: {
    params: { currencyIdA, currencyIdB }
  }
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
  const { account, chainId } = useActiveWeb3React()
  const govToken = useGovernanceToken()
  const controller = useFateRewardController()

  // get currencies and pair
  const [currencyA, currencyB] = [useCurrency(currencyIdA), useCurrency(currencyIdB)]

  const tokenA = wrappedCurrency(currencyA ?? undefined, chainId)
  const tokenB = wrappedCurrency(currencyB ?? undefined, chainId)

  const [, stakingTokenPair] = usePair(tokenA, tokenB)

  const currentTimestamp = useCurrentBlockTimestamp()
  const rewardsStartTimestamp = useRewardsStartTimestamp()

  const weekIndex = currentTimestamp
    ? JSBI.divide(
        JSBI.subtract(
          JSBI.BigInt(currentTimestamp),
          rewardsStartTimestamp ? JSBI.BigInt(rewardsStartTimestamp) : JSBI.BigInt(currentTimestamp)
        ),
        JSBI.BigInt(604800)
      )
    : JSBI.BigInt(0)
  const epoch = getEpochFromWeekIndex(weekIndex)

  let epochLengthWeeks: number
  let lockAmountPercent: string
  let unlockAmountPercent: string
  if (JSBI.equal(epoch, JSBI.BigInt('0'))) {
    epochLengthWeeks = 52
    lockAmountPercent = '92%'
    unlockAmountPercent = '8%'
  } else {
    epochLengthWeeks = 52
    lockAmountPercent = '92%'
    unlockAmountPercent = '8%'
  }

  const stakingInfo = useStakingInfo(undefined, stakingTokenPair)?.[0]
  const percentInputs = useMemo(() => [stakingInfo?.pid, account], [account, stakingInfo])
  const rewardFeePercentResult = useSingleCallResult(controller, 'getLockedRewardsFeePercent', percentInputs)
  const lpFeePercentResult = useSingleCallResult(controller, 'getLPWithdrawFeePercent', percentInputs)
  const membershipInfoResult = useSingleCallResult(controller, 'userMembershipInfo', percentInputs)

  const lastWithdrawalTimestampLoading = membershipInfoResult.loading
  const lastWithdrawalTimestamp =
    membershipInfoResult.result?.[1] && membershipInfoResult.result?.[1].toString() !== '0'
      ? new Date(Number(membershipInfoResult.result?.[1].toString()) * 1000)
      : undefined

  const depositDurationLoading = membershipInfoResult.loading
  const depositDuration = lastWithdrawalTimestamp
    ? moment.duration(moment().diff(moment(lastWithdrawalTimestamp)))
    : undefined

  const rewardFeePercentLoading = rewardFeePercentResult.loading
  const rewardFeePercent =
    rewardFeePercentResult.result?.[0] && lastWithdrawalTimestamp
      ? new Fraction(rewardFeePercentResult.result?.[0].toString(), '10000')
      : undefined

  const lpFeePercentLoading = lpFeePercentResult.loading
  const lpFeePercent =
    lpFeePercentResult.result?.[0] && lastWithdrawalTimestamp
      ? new Fraction(lpFeePercentResult.result?.[0].toString(), '10000')
      : undefined

  const rewardsStarted = useMemo<boolean>(() => {
    if (!rewardsStartTimestamp || !currentTimestamp) {
      return true
    }

    return JSBI.greaterThanOrEqual(JSBI.BigInt(currentTimestamp.toString()), rewardsStartTimestamp)
  }, [rewardsStartTimestamp, currentTimestamp])

  // detect existing unstaked LP position to show add button if none found
  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token)

  const showAddLiquidityButton = useMemo<boolean>(() => {
    return Boolean(stakingInfo?.stakedAmount?.equalTo('0') && userLiquidityUnstaked?.equalTo('0'))
  }, [stakingInfo, userLiquidityUnstaked])

  // toggle for staking modal and unstaking modal
  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  // fade cards if nothing staked or nothing earned yet
  const disableTop = !stakingInfo?.stakedAmount || stakingInfo.stakedAmount.equalTo(JSBI.BigInt(0))

  const backgroundColor = useColor(stakingInfo?.baseToken)

  // For testing purposes
  // if (stakingInfo) {
  //   stakingInfo.earnedAmount = new TokenAmount(govToken, '123000000000000000000')
  // }
  const countUpAmount =
    rewardFeePercent && rewardFeePercent.lessThan('1') && stakingInfo
      ? stakingInfo.earnedAmount.multiply(new Fraction('1').subtract(rewardFeePercent).invert()).toFixed(6)
      : '0'
  const countUpAmountPrevious = usePrevious(countUpAmount) ?? '0'

  const toggleWalletModal = useWalletModalToggle()

  const handleDepositClick = useCallback(() => {
    if (account) {
      setShowStakingModal(true)
    } else {
      toggleWalletModal()
    }
  }, [account, toggleWalletModal])

  const liquidityTokenSymbol = `${stakingTokenPair?.token0.symbol}-${stakingTokenPair?.token1.symbol}-LP`

  return (
    <PageWrapper gap="lg" justify="center">
      <RowBetween style={{ gap: '24px' }}>
        <TYPE.mediumHeader style={{ margin: 0 }}>
          {currencyA?.symbol}-{currencyB?.symbol} Liquidity Mining
        </TYPE.mediumHeader>
        <DoubleCurrencyLogo currency0={currencyA ?? undefined} currency1={currencyB ?? undefined} size={24} />
      </RowBetween>

      <DataRow style={{ gap: '0px' }}>
        <PoolData>
          <AutoColumn gap="sm">
            <TYPE.body style={{ margin: 0 }}>Total Deposits</TYPE.body>
            <TYPE.body fontSize={24} fontWeight={500}>
              {stakingInfo && stakingInfo.valueOfTotalStakedAmountInUsd?.greaterThan('0')
                ? `$${stakingInfo.valueOfTotalStakedAmountInUsd.toFixed(2, { groupSeparator: ',' })}`
                : '-'}
            </TYPE.body>
          </AutoColumn>
        </PoolData>
        <PoolData>
          <AutoColumn gap="sm">
            <TYPE.body style={{ margin: 0 }}>Reward Rate</TYPE.body>
            <TYPE.body fontSize={24} fontWeight={500}>
              {stakingInfo
                ? stakingInfo.active
                  ? `${stakingInfo.poolRewardsPerBlock.toSignificant(4, { groupSeparator: ',' })} 
                  ${govToken?.symbol} / second`
                  : `0 ${govToken?.symbol} / second`
                : '-'}
            </TYPE.body>
          </AutoColumn>
        </PoolData>
      </DataRow>
      <DataRow style={{ gap: '0px' }}>
        <PoolData>
          <AutoColumn gap="sm">
            <TYPE.body style={{ margin: 0 }}>Deposit Timestamp</TYPE.body>
            <TYPE.body fontSize={24} fontWeight={500}>
              {lastWithdrawalTimestampLoading ? (
                <Loader />
              ) : lastWithdrawalTimestamp ? (
                moment(lastWithdrawalTimestamp).format('lll')
              ) : (
                '-'
              )}
            </TYPE.body>
          </AutoColumn>
        </PoolData>
        <PoolData>
          <AutoColumn gap="sm">
            <TYPE.body style={{ margin: 0 }}>Deposit Duration</TYPE.body>
            <TYPE.body fontSize={24} fontWeight={500}>
              {depositDurationLoading ? (
                <Loader />
              ) : depositDuration ? (
                `${depositDuration.get('years') >= 2 ? `${depositDuration.get('years')} years ` : ''}` +
                `${
                  depositDuration.get('years') >= 1 && depositDuration.get('years') < 2
                    ? `${depositDuration.get('years')} year `
                    : ''
                }` +
                `${depositDuration.get('days') >= 2 ? `${depositDuration.get('days')} days ` : ''}` +
                `${
                  depositDuration.get('days') >= 1 && depositDuration.get('days') < 2
                    ? `${depositDuration.get('days')} day `
                    : ''
                }` +
                `${depositDuration.get('hours') >= 2 ? `${depositDuration.get('hours')} hours ` : ''}` +
                `${
                  depositDuration.get('hours') >= 1 && depositDuration.get('hours') < 2
                    ? `${depositDuration.get('hours')} hour `
                    : ''
                }` +
                `${
                  depositDuration.get('minutes') >= 2 || depositDuration.get('minutes') < 1
                    ? `${depositDuration.get('minutes')} minutes `
                    : ''
                }` +
                `${
                  depositDuration.get('minutes') >= 1 && depositDuration.get('minutes') < 2
                    ? `${depositDuration.get('minutes')} minute `
                    : ''
                }`
              ) : (
                '-'
              )}
            </TYPE.body>
          </AutoColumn>
        </PoolData>
      </DataRow>
      <DataRow style={{ gap: '0px' }}>
        <PoolData>
          <AutoColumn gap="sm">
            <TYPE.body style={{ margin: 0 }}>
              LP Withdrawal Fee %{' '}
              <ExternalLink href={'https://fatex.io'}>
                <LightQuestionHelper
                  text={
                    <div>
                      <span>
                        This is the percent that will be taken from your LP tokens upon initiating a withdrawal based on
                        the duration of your capital contribution.
                      </span>
                      <br />
                      <br />
                      <span>
                        FATEx is a DAO that wants the holders of FATE to be rewarded for long-term membership &
                        discourage short-term &quot;yield-farming.&quot; The fees taken are specifically structured to
                        accomplish this: they directly reward committed members, automatically enhance FATE value, and
                        decrease substantially overtime.
                      </span>
                      <br />
                      <br />
                      <span>Learn more by clicking on this question mark tooltip.</span>
                    </div>
                  }
                />
              </ExternalLink>
            </TYPE.body>
            <TYPE.body fontSize={24} fontWeight={500}>
              {lpFeePercentLoading ? <Loader /> : lpFeePercent ? `${lpFeePercent.multiply('100').toFixed(2)}%` : '-'}
            </TYPE.body>
            <TYPE.body>
              <ExternalLink href={FEES_URL}>View Fee Schedule ↗</ExternalLink>
            </TYPE.body>
          </AutoColumn>
        </PoolData>
        <PoolData>
          <AutoColumn gap="sm">
            <TYPE.body style={{ margin: 0 }}>
              {govToken.symbol} Reward Fee %{' '}
              <ExternalLink href={'https://fatex.io'}>
                <LightQuestionHelper
                  text={
                    <div>
                      <span>
                        This is the percent that will be taken from your FATE rewards upon initiating a withdrawal based
                        on the duration of your capital contribution.
                      </span>
                      <br />
                      <br />
                      <span>
                        FATEx is a DAO that wants the holders of FATE to be rewarded for long-term membership &
                        discourage short-term &quot;yield-farming.&quot; The fees taken are specifically structured to
                        accomplish this: they directly reward committed members, automatically enhance FATE value, and
                        decrease substantially overtime.
                      </span>
                      <br />
                      <br />
                      <span>Learn more by clicking on this question mark tooltip.</span>
                    </div>
                  }
                />
              </ExternalLink>
            </TYPE.body>
            <TYPE.body fontSize={24} fontWeight={500}>
              {rewardFeePercentLoading ? (
                <Loader />
              ) : rewardFeePercent ? (
                `${rewardFeePercent.multiply('100').toFixed(2)}%`
              ) : (
                '-'
              )}
            </TYPE.body>
            <TYPE.body>
              <ExternalLink href={FEES_URL}>View Fee Schedule ↗</ExternalLink>
            </TYPE.body>
          </AutoColumn>
        </PoolData>
      </DataRow>

      {showAddLiquidityButton && (
        <VoteCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>Step 1. Get FATExFi-LP Liquidity tokens</TYPE.white>
              </RowBetween>
              <RowBetween style={{ marginBottom: '1rem' }}>
                <TYPE.white fontSize={14}>
                  {`FATExFi-LP tokens are required. Once you've added liquidity to the ${currencyA?.symbol}-${currencyB?.symbol} pool you can stake your liquidity tokens on this page.`}
                </TYPE.white>
              </RowBetween>
              <ButtonPrimary
                padding="8px"
                borderRadius="8px"
                width={'fit-content'}
                as={Link}
                to={`/add/${currencyA && currencyId(currencyA)}/${currencyB && currencyId(currencyB)}`}
              >
                {`Add ${currencyA?.symbol}-${currencyB?.symbol} liquidity`}
              </ButtonPrimary>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </VoteCard>
      )}

      {stakingInfo && (
        <>
          <StakingModal
            isOpen={showStakingModal}
            onDismiss={() => setShowStakingModal(false)}
            stakingInfo={stakingInfo}
            userLiquidityUnstaked={userLiquidityUnstaked}
          />
          <ModifiedUnstakingModal
            isOpen={showUnstakingModal}
            onDismiss={() => setShowUnstakingModal(false)}
            stakingInfo={stakingInfo}
          />
          <ClaimRewardModal
            isOpen={showClaimRewardModal}
            onDismiss={() => setShowClaimRewardModal(false)}
            stakingInfo={stakingInfo}
          />
        </>
      )}
      <PositionInfo gap="lg" justify="center" dim={showAddLiquidityButton}>
        <BottomSection gap="lg" justify="center">
          <StyledDataCard disabled={disableTop} bgColor={backgroundColor} showBackground={!showAddLiquidityButton}>
            <CardSection>
              <CardBGImage desaturate />
              <CardNoise />
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white fontWeight={600}>Your liquidity deposits</TYPE.white>
                </RowBetween>
                <RowBetween style={{ alignItems: 'baseline' }}>
                  <TYPE.white fontSize={36} fontWeight={600}>
                    {stakingInfo?.stakedAmount?.toSignificant(6) ?? '-'}
                  </TYPE.white>
                  <TYPE.white>
                    FATExFi-LP {currencyA?.symbol}-{currencyB?.symbol}
                  </TYPE.white>
                </RowBetween>
              </AutoColumn>
            </CardSection>
          </StyledDataCard>
          <StyledBottomCard dim={stakingInfo?.stakedAmount?.equalTo(JSBI.BigInt(0))}>
            <CardBGImage desaturate />
            <CardNoise />
            <AutoColumn gap="sm">
              <RowBetween>
                <div>
                  <TYPE.black>Your unclaimed {govToken?.symbol}</TYPE.black>
                </div>
                {stakingInfo?.earnedAmount && JSBI.notEqual(BIG_INT_ZERO, stakingInfo?.earnedAmount?.raw) && (
                  <ButtonEmpty
                    padding="8px"
                    borderRadius="8px"
                    width="fit-content"
                    onClick={() => setShowClaimRewardModal(true)}
                  >
                    Claim
                  </ButtonEmpty>
                )}
              </RowBetween>
              <RowBetween style={{ alignItems: 'baseline' }}>
                <TYPE.largeHeader fontSize={36} fontWeight={600}>
                  <CountUp
                    key={countUpAmount}
                    isCounting
                    decimalPlaces={4}
                    start={parseFloat(countUpAmountPrevious)}
                    end={parseFloat(countUpAmount)}
                    thousandsSeparator={','}
                    duration={1}
                  />
                </TYPE.largeHeader>
                <TYPE.black fontSize={16} fontWeight={500} />
              </RowBetween>
            </AutoColumn>
          </StyledBottomCard>
        </BottomSection>
        <>
          {rewardsStarted && (
            <TYPE.main style={{ textAlign: 'center' }} fontSize={14}>
              <span role="img" aria-label="wizard-icon" style={{ marginRight: '8px' }}>
                ⭐️
              </span>
              When you deposit or withdraw the contract will automatically claim {govToken?.symbol} on your behalf.
              <br />
              <br />
              <span role="img" aria-label="wizard-icon" style={{ marginRight: '8px' }}>
                💡
              </span>
              The unclaimed {govToken?.symbol} amount above represents unlocked rewards for the current epoch.
              <br />
              <br />
              The locked rewards are distributed after the end of this epoch. Learn more{' '}
              <ExternalLink
                href={'https://fatexdao.gitbook.io/fatexdao/tokenomics/rewards-locking-1'}
                style={{ textDecoration: 'underline' }}
              >
                here
              </ExternalLink>{' '}
              and please note there <i>ARE</i> withdrawal fees.
            </TYPE.main>
          )}
        </>
        {!rewardsStarted && <AwaitingRewards />}
        {!showAddLiquidityButton && (
          <DataRow style={{ marginBottom: '1rem' }}>
            {stakingInfo && (
              <ButtonPrimary padding="8px" borderRadius="8px" width="160px" onClick={handleDepositClick}>
                {stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0))
                  ? 'Deposit'
                  : `Deposit ${stakingTokenPair.liquidityToken.symbol} Tokens`}
              </ButtonPrimary>
            )}

            {stakingInfo?.earnedAmount && JSBI.notEqual(BIG_INT_ZERO, stakingInfo?.earnedAmount?.raw) && (
              <ButtonPrimary
                padding="8px"
                borderRadius="8px"
                width="160px"
                onClick={() => setShowClaimRewardModal(true)}
              >
                Claim
              </ButtonPrimary>
            )}

            {stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) && (
              <>
                <ButtonPrimary
                  padding="8px"
                  borderRadius="8px"
                  width="160px"
                  onClick={() => setShowUnstakingModal(true)}
                >
                  Withdraw
                </ButtonPrimary>
              </>
            )}
          </DataRow>
        )}
        {!userLiquidityUnstaked ? null : userLiquidityUnstaked.equalTo('0') ? null : !stakingInfo?.active ? null : (
          <TYPE.main>
            You have {userLiquidityUnstaked.toSignificant(6)} FATExFi-LP tokens available to deposit
          </TYPE.main>
        )}
      </PositionInfo>
    </PageWrapper>
  )
}

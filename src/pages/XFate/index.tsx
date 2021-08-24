import React, { useCallback, useState } from 'react'
import { TokenAmount } from '@fatex-dao/sdk'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'

import { RouteComponentProps } from 'react-router-dom'
import { useWalletModalToggle } from '../../state/application/hooks'
import { TYPE } from '../../theme'

import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import { ButtonPrimary } from '../../components/Button'
import StakingModal from '../../components/XFate/StakingModal'
import ModifiedUnstakingModal from '../../components/XFate/ModifiedUnstakingModal'
import ClaimModal from '../../components/XFate/ClaimModal'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'
import { CountUp } from 'use-count-up'

import { BlueCard } from '../../components/Card'

import usePrevious from '../../hooks/usePrevious'

import { X_FATE, X_FATE_SETTINGS } from '../../constants'
import { FATE_TOKEN_INTERFACE } from '../../constants/abis/governanceToken'
import { X_FATE_INTERFACE } from '../../constants/abis/xfate-token'
import useGovernanceToken from 'hooks/useGovernanceToken'
import useTotalCombinedTVL from '../../hooks/useTotalCombinedTVL'
import useXFateRatio from '../../hooks/useXFateRatio'
import { useStakingInfo } from '../../state/stake/hooks'
import useFilterStakingInfos from '../../hooks/useFilterStakingInfos'
import CombinedTVL from '../../components/CombinedTVL'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const TopSection = styled(AutoColumn)`
  max-width: 720px;
  width: 100%;
`

/*const PositionInfo = styled(AutoColumn)<{ dim: any }>`
  position: relative;
  max-width: 640px;
  width: 100%;
  opacity: ${({ dim }) => (dim ? 0.6 : 1)};
`*/

const BottomSection = styled(AutoColumn)`
  border-radius: 8px;
  width: 100%;
  position: relative;
`

/*const StyledDataCard = styled(DataCard)<{ bgColor?: any; showBackground?: any }>`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #1e1a31 0%, #3d51a5 100%);
  z-index: 2;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: ${({ theme, bgColor, showBackground }) =>
    `radial-gradient(91.85% 100% at 1.84% 0%, ${bgColor} 0%,  ${showBackground ? theme.black : theme.bg5} 100%) `};
`*/

const StyledBottomCard = styled(DataCard)<{ dim: any }>`
  background: ${({ theme }) => theme.bg3};
  opacity: ${({ dim }) => (dim ? 0.4 : 1)};
  margin-top: -40px;
  padding: 0 1.25rem 1rem 1.25rem;
  padding-top: 32px;
  z-index: 1;
`

/*const PoolData = styled(DataCard)`
  background: none;
  border: 1px solid ${({ theme }) => theme.bg4};
  padding: 1rem;
  z-index: 1;
`*/

/*const VoteCard = styled(DataCard)`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
  overflow: hidden;
`*/

const CustomCard = styled(DataCard)`
  /*background: radial-gradient(
    76.02% 75.41% at 1.84% 0%,
    ${({ theme }) => theme.customCardGradientStart} 0%,
    ${({ theme }) => theme.customCardGradientEnd} 100%
  );*/
  background: ${({ theme }) => theme.bg2};
  overflow: hidden;
`

const DataRow = styled(RowBetween)`
  justify-content: center;
  gap: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    gap: 12px;
  `};
`

const NonCenteredDataRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
flex-direction: column;
`};
`

export default function Pit({
  match: {
    params: { currencyIdA, currencyIdB }
  }
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
  const { account, chainId } = useActiveWeb3React()

  const isActive = true
  const filteredStakingInfos = useFilterStakingInfos(useStakingInfo(isActive), isActive)
  const TVLs = useTotalCombinedTVL(filteredStakingInfos)

  const govToken = useGovernanceToken()
  const govTokenBalance: TokenAmount | undefined = useTokenBalance(
    account ?? undefined,
    govToken,
    'balanceOf',
    FATE_TOKEN_INTERFACE
  )

  const xFate = chainId ? X_FATE[chainId] : undefined
  const xFateSettings = chainId ? X_FATE_SETTINGS[chainId] : undefined
  const xFateBalance: TokenAmount | undefined = useTokenBalance(
    account ?? undefined,
    xFate,
    'balanceOf',
    X_FATE_INTERFACE
  )
  const govTokenStakedTokenRatio = useXFateRatio()
  const adjustedStakedBalance = govTokenStakedTokenRatio ? xFateBalance?.multiply(govTokenStakedTokenRatio) : undefined

  const userLiquidityStaked = xFateBalance
  const userLiquidityUnstaked = govTokenBalance

  // toggle for staking modal and unstaking modal
  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  const [showClaimModal, setShowClaimModal] = useState(false)

  const countUpAmount = xFateBalance?.toFixed(6) ?? '0'
  const countUpAmountPrevious = usePrevious(countUpAmount) ?? '0'

  const toggleWalletModal = useWalletModalToggle()

  const handleDepositClick = useCallback(() => {
    if (account) {
      setShowStakingModal(true)
    } else {
      toggleWalletModal()
    }
  }, [account, toggleWalletModal])

  return (
    <PageWrapper gap="lg" justify="center">
      {govToken && (
        <>
          <StakingModal
            isOpen={showStakingModal}
            onDismiss={() => setShowStakingModal(false)}
            stakingToken={govToken}
            userLiquidityUnstaked={userLiquidityUnstaked}
          />
          <ModifiedUnstakingModal
            isOpen={showUnstakingModal}
            onDismiss={() => setShowUnstakingModal(false)}
            userLiquidityStaked={userLiquidityStaked}
            stakingToken={govToken}
          />
          <ClaimModal isOpen={showClaimModal} onDismiss={() => setShowClaimModal(false)} />
        </>
      )}

      <TopSection gap="lg" justify="center">
        <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
          <NonCenteredDataRow style={{ alignItems: 'baseline' }}>
            <TYPE.mediumHeader />
            {TVLs?.stakingPoolTVL?.greaterThan('0') && (
              <TYPE.black>
                <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                  🏆
                </span>
                <CombinedTVL />
              </TYPE.black>
            )}
          </NonCenteredDataRow>
        </AutoColumn>

        <BottomSection gap="lg" justify="center">
          <CustomCard>
            <CardSection>
              <CardBGImage desaturate />
              <CardNoise />
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white fontWeight={600}>{xFateSettings?.name} - DEX fee sharing</TYPE.white>
                </RowBetween>
                <RowBetween style={{ alignItems: 'baseline' }}>
                  <TYPE.white fontSize={14}>
                    Stake your {govToken?.symbol} tokens and earn 0.05% of all generated trading volume.
                  </TYPE.white>
                </RowBetween>
                <br />
              </AutoColumn>
            </CardSection>
          </CustomCard>
          <StyledBottomCard dim={false}>
            <CardBGImage desaturate />
            <CardNoise />
            <AutoColumn gap="sm">
              <RowBetween>
                <div>
                  <TYPE.black>
                    Your x{govToken?.symbol} Balance
                    {govTokenStakedTokenRatio && (
                      <TYPE.italic display="inline" marginLeft="0.25em">
                        (1 x{govToken?.symbol} = {govTokenStakedTokenRatio.toSignificant(4)} {govToken?.symbol})
                      </TYPE.italic>
                    )}
                  </TYPE.black>
                </div>
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
              </RowBetween>
            </AutoColumn>
          </StyledBottomCard>
        </BottomSection>

        {account && adjustedStakedBalance && adjustedStakedBalance?.greaterThan('0') && (
          <TYPE.main>
            You have {adjustedStakedBalance?.toFixed(2, { groupSeparator: ',' })} {govToken?.symbol} tokens staked in
            the&nbsp;{xFateSettings?.name}.
          </TYPE.main>
        )}

        {account && (!adjustedStakedBalance || adjustedStakedBalance?.equalTo('0')) && (
          <TYPE.main>
            You have {govTokenBalance?.toFixed(2, { groupSeparator: ',' })} {govToken?.symbol} tokens available to
            deposit to the {xFateSettings?.name}.
          </TYPE.main>
        )}

        {account && (
          <DataRow style={{ marginBottom: '0rem' }}>
            <ButtonPrimary padding="8px" borderRadius="8px" width="160px" onClick={handleDepositClick}>
              Deposit
            </ButtonPrimary>

            <ButtonPrimary padding="8px" borderRadius="8px" width="160px" onClick={() => setShowClaimModal(true)}>
              Claim
            </ButtonPrimary>

            <ButtonPrimary padding="8px" borderRadius="8px" width="160px" onClick={() => setShowUnstakingModal(true)}>
              Withdraw
            </ButtonPrimary>
          </DataRow>
        )}

        <BlueCard>
          <AutoColumn gap="10px">
            <TYPE.main style={{ textAlign: 'center' }} fontSize={14}>
              <span role="img" aria-label="wizard-icon" style={{ marginRight: '8px' }}>
                💡
              </span>
              <b>Important:</b> Your {govToken?.symbol} rewards will only be visible
              <br />
              after you withdraw your x{govToken?.symbol} tokens from the pool.
              <br />
              <br />
              {xFateSettings?.name} does not have any withdrawal fees.
              <br />
              Tokens are also 100% unlocked when they are claimed.
            </TYPE.main>
          </AutoColumn>
        </BlueCard>
      </TopSection>
    </PageWrapper>
  )
}

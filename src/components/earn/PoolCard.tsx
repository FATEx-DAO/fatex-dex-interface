import React, { useState } from 'react'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import styled from 'styled-components'
import { TYPE, StyledInternalLink } from '../../theme'
import DoubleCurrencyLogo from '../DoubleLogo'
import { JSBI } from '@fatex-dao/sdk'
import { ButtonPrimary } from '../Button'
import { StakingInfo } from '../../state/stake/hooks'
import { useColor } from '../../hooks/useColor'
import { currencyId } from '../../utils/currencyId'
import { Break, CardNoise, CardBGImage } from './styled'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import useBUSDPrice from '../../hooks/useBUSDPrice'
import useGovernanceToken from '../../hooks/useGovernanceToken'
import { useCurrency } from '../../hooks/Tokens'
import { ZERO_ADDRESS } from '../../constants'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'
import { usePair } from '../../data/Reserves'

const StatContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
`

const StatContainerTop = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;
  margin: 1rem;
`

const Wrapper = styled(AutoColumn)<{ showBackground: boolean; bgColor: any; expanded: boolean; isStaking: boolean }>`
  border-radius: 8px;
  width: 97%;
  height: ${({ expanded, isStaking }) => (expanded ? (isStaking ? '241px' : '218px') : isStaking ? '74px' : '57px')};
  transition: height 0.2s ease-in-out;
  overflow: hidden;
  position: relative;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '1')};
    /*background: ${({ theme, bgColor, showBackground }) =>
      `radial-gradient(91.85% 100% at 1.84% 0%, ${bgColor} 0%, ${showBackground ? theme.black : theme.bg5} 100%) `};*/
  background: ${({ theme }) => theme.bg3};
  color: ${({ theme, showBackground }) => (showBackground ? theme.white : theme.text1)} !important;
  margin: 10px 5px;
  cursor: pointer;

  ${({ showBackground }) =>
    showBackground &&
    `  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);`}

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
    margin: 0 0 10px 0;
  `}
`

const TopSection = styled.div<{ smallText: boolean }>`
  /*display: grid;
  grid-template-columns: 48px 1fr 120px;
  grid-gap: 0;
  align-items: center;*/
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  z-index: 1;

  > div > div:nth-of-type(2) {
    font-size: 16px;
  }

  ${({ theme, smallText }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 48px 1fr 96px;
  `};

  > div:nth-of-type(1) {
    width: 60%;
  }

  > div:nth-of-type(2) {
    width: 40%;
  }

  div > div {
    display: inline-block;
    vertical-align: top;
  }

  > div > a > button {
    background-color: ${({ theme }) => theme.bg3};

    :hover {
      color: ${({ theme }) => theme.bg3};
    }
  }
`

const BottomSection = styled.div<{ showBackground: boolean }>`
  padding: 12px 16px;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '0.4')};
  border-radius: 0 0 12px 12px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  z-index: 1;
`

const UserDeposit = styled.div`
  width: 100%;
  margin: -20px 16px 20px;
  color: ${({ theme }) => theme.text2};
  font-weight: 200;

  > div {
    display: inline-block;
    width: calc(50% - 16px);

    :nth-of-type(2) {
      text-align: right;
    }
  }
`

const StakedAmount = styled.div<{ isZero?: boolean }>`
  color: ${({ theme, isZero }) => (isZero ? theme.red1 : theme.text2)};
`

export default function PoolCard({ stakingInfo, isArchived }: { stakingInfo: StakingInfo; isArchived: boolean }) {
  const { account } = useActiveWeb3React()
  const [expanded, setExpanded] = useState(false)

  const govToken = useGovernanceToken()
  const govTokenPrice = useBUSDPrice(govToken)

  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0') || stakingInfo.rewardDebt.greaterThan('0'))
  const poolSharePercentage = stakingInfo.poolShare.multiply(JSBI.BigInt(100))

  const [, tokenPair] = usePair(stakingInfo.tokens[0], stakingInfo.tokens[1])
  const userDefaultPoolBalance = useTokenBalance(account ?? undefined, tokenPair?.liquidityToken)
  const isPooling = userDefaultPoolBalance?.greaterThan('0') || false

  // get the color of the token
  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]
  const currency0 =
    useCurrency(unwrappedToken(token0) === token0 ? token0.address : unwrappedToken(token0).symbol) ?? undefined
  const currency1 =
    useCurrency(unwrappedToken(token1) === token1 ? token1.address : unwrappedToken(token1).symbol) ?? undefined
  const backgroundColor = useColor(stakingInfo?.baseToken)
  const currencyId0 = currency0 ? currencyId(currency0) : ZERO_ADDRESS
  const currencyId1 = currency1 ? currencyId(currency1) : ZERO_ADDRESS

  const userStakedAmountUSD = stakingInfo?.valueOfTotalStakedAmountInUsd
    ? stakingInfo.stakedRatio.multiply(stakingInfo.valueOfTotalStakedAmountInUsd)
    : undefined

  return (
    <Wrapper
      showBackground={isPooling || isStaking}
      bgColor={backgroundColor}
      expanded={expanded}
      isStaking={isPooling || isStaking}
      onClick={() => setExpanded(!expanded)}
    >
      <CardBGImage desaturate />
      <CardNoise />

      <TopSection smallText={`${currency0?.symbol}-${currency1?.symbol}`.length > 8}>
        <div>
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
          <TYPE.white
            fontWeight={600}
            fontSize={20}
            style={{ marginLeft: '8px', marginTop: '-3px', lineHeight: '32px' }}
          >
            {currency0?.symbol}-{currency1?.symbol}
          </TYPE.white>
        </div>
        <div style={{ marginTop: '-2px', textAlign: 'right' }}>
          <TYPE.white fontWeight={500} style={{ fontSize: '18px', lineHeight: '32px', fontWeight: 300 }}>
            {stakingInfo.apr && stakingInfo.apr.greaterThan('0')
              ? `${stakingInfo.apr.multiply('100').toSignificant(4, { groupSeparator: ',' })}%`
              : 'TBD'}
          </TYPE.white>
          <TYPE.white style={{ fontSize: '20px', lineHeight: '32px', marginLeft: '6px', fontWeight: 300 }}>
            {' '}
            APR
          </TYPE.white>
        </div>
      </TopSection>
      {(isPooling || isStaking) && (
        <UserDeposit>
          <div>Your staked amount</div>
          <StakedAmount
            isZero={
              /*(userStakedAmountUSD?.toFixed(2, { groupSeparator: ',' }) || '-') === '0.00'*/ isPooling && !isStaking
            }
          >
            ${userStakedAmountUSD?.toFixed(2, { groupSeparator: ',' }) || '-'}
          </StakedAmount>
        </UserDeposit>
      )}
      <StatContainer>
        <RowBetween>
          <TYPE.white> Total deposited </TYPE.white>
          <TYPE.white fontWeight={500}>
            <b>
              {stakingInfo && stakingInfo.valueOfTotalStakedAmountInUsd?.greaterThan('0')
                ? `$${stakingInfo.valueOfTotalStakedAmountInUsd.toFixed(0, { groupSeparator: ',' })}`
                : '-'}
            </b>
          </TYPE.white>
        </RowBetween>
        <RowBetween>
          <TYPE.white> Pool reward allocation </TYPE.white>
          <TYPE.white>{poolSharePercentage ? `${poolSharePercentage.toSignificant(4)}%` : '-'}</TYPE.white>
        </RowBetween>
        <RowBetween>
          <TYPE.white> Reward rate </TYPE.white>
          <TYPE.white>
            {stakingInfo
              ? stakingInfo.active
                ? `${stakingInfo.poolRewardsPerBlock.toSignificant(4, { groupSeparator: ',' })} 
                ${govToken?.symbol} / block`
                : `0 ${govToken?.symbol} / block`
              : '-'}
          </TYPE.white>
        </RowBetween>
        <StyledInternalLink
          to={`/depository/${currencyId0}/${currencyId1}`}
          style={{ width: '40%', marginLeft: '30%', marginTop: '5px' }}
        >
          <ButtonPrimary padding="8px" borderRadius="8px">
            {isStaking || isArchived ? 'Manage' : 'Deposit'}
          </ButtonPrimary>
        </StyledInternalLink>
      </StatContainer>

      {isStaking && (
        <>
          <Break />
          <StatContainerTop>
            <RowBetween>
              <TYPE.white>Unclaimed Rewards</TYPE.white>
              <TYPE.white>
                <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                  🔓
                </span>
                {stakingInfo
                  ? stakingInfo.active
                    ? `${stakingInfo.earnedAmount.toSignificant(4, { groupSeparator: ',' })} ${govToken?.symbol} / $${
                        govTokenPrice
                          ? stakingInfo.earnedAmount
                              .multiply(govTokenPrice?.raw)
                              .toSignificant(2, { groupSeparator: ',' })
                          : '0'
                      }`
                    : `0 ${govToken?.symbol}`
                  : '-'}
              </TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white>Locked Rewards</TYPE.white>
              <TYPE.white>
                <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                  🔒
                </span>
                {stakingInfo
                  ? stakingInfo.active
                    ? `${stakingInfo.rewardDebt?.toSignificant(6, { groupSeparator: ',' })} ${govToken?.symbol} / $${
                        govTokenPrice
                          ? stakingInfo.rewardDebt
                              .multiply(govTokenPrice?.raw)
                              .toSignificant(2, { groupSeparator: ',' })
                          : '0'
                      }`
                    : `0 ${govToken?.symbol}`
                  : '-'}
              </TYPE.white>
            </RowBetween>
          </StatContainerTop>
          <Break />
          <BottomSection showBackground={true}>
            <TYPE.black color={'white'} fontWeight={500}>
              <span>Total Unclaimed & Locked Rewards</span>
            </TYPE.black>
            <TYPE.black style={{ textAlign: 'right' }} color={'white'} fontWeight={500}>
              <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                ⚡
              </span>
              {stakingInfo
                ? stakingInfo.active
                  ? `${stakingInfo.allClaimedRewards.toSignificant(6, { groupSeparator: ',' })} ${
                      govToken?.symbol
                    } / $${
                      govTokenPrice
                        ? stakingInfo.allClaimedRewards
                            .multiply(govTokenPrice?.raw)
                            .toSignificant(2, { groupSeparator: ',' })
                        : '0'
                    }`
                  : `0 ${govToken?.symbol}`
                : '-'}
            </TYPE.black>
          </BottomSection>
        </>
      )}
    </Wrapper>
  )
}

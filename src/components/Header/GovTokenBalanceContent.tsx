import { TokenAmount, Blockchain } from '@fatex-dao/sdk'
import React from 'react'
//import React, { useMemo } from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'
import getTokenLogo from '../../utils/getTokenLogo'
import { useGovTokenSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
//import { useMerkleDistributorContract } from '../../hooks/useContract'
//import useCurrentBlockTimestamp from '../../hooks/useCurrentBlockTimestamp'
import { useTotalLockedGovTokensEarned, useTotalClaimedAndEarnedGovTokens } from '../../state/stake/hooks'
import { useAggregateGovTokenBalance, useTokenBalance } from '../../state/wallet/hooks'
import { StyledInternalLink, TYPE, UniTokenAnimated } from '../../theme'
//import { computeUniCirculation } from '../../utils/computeUniCirculation'
import useBUSDPrice from '../../hooks/useBUSDPrice'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { Break, CardBGImage, CardNoise, CardSection, DataCard } from '../earn/styled'
import useGovernanceToken from '../../hooks/useGovernanceToken'
import { FATE_TOKEN_INTERFACE } from '../../constants/abis/governanceToken'
import { MouseoverTooltip } from '../Tooltip'
import useBlockchain from '../../hooks/useBlockchain'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  /*background: radial-gradient(
    76.02% 75.41% at 1.84% 0%,
    ${({ theme }) => theme.tokenButtonGradientStart} 0%,
    #000 100%
  );*/
  background: ${({ theme }) => theme.bg3};
  padding: 0.5rem;
`

const StyledClose = styled(X)`
  position: absolute;
  right: 16px;
  top: 16px;

  :hover {
    cursor: pointer;
  }
`

/**
 * Content for balance stats modal
 */
export default function GovTokenBalanceContent({ setShowUniBalanceModal }: { setShowUniBalanceModal: any }) {
  const { account } = useActiveWeb3React()
  const govToken = useGovernanceToken()
  const blockchain = useBlockchain()
  const total = useAggregateGovTokenBalance()
  const govTokenBalance: TokenAmount | undefined = useTokenBalance(
    account ?? undefined,
    govToken,
    'balanceOf',
    FATE_TOKEN_INTERFACE
  )
  const govTokenLockedBalance: TokenAmount | undefined = useTokenBalance(
    account ?? undefined,
    govToken,
    'lockOf',
    FATE_TOKEN_INTERFACE
  )
  const govTokenTotalBalance: TokenAmount | undefined = useTokenBalance(
    account ?? undefined,
    govToken,
    'totalBalanceOf',
    FATE_TOKEN_INTERFACE
  )
  const lockedGovTokensToClaim: TokenAmount | undefined = useTotalLockedGovTokensEarned()
  const unlockedGovTokensToClaim: TokenAmount | undefined = useTotalClaimedAndEarnedGovTokens()
  const totalSupply: TokenAmount | undefined = useGovTokenSupply()
  const totalUnlockedSupply: TokenAmount | undefined = useGovTokenSupply('unlockedSupply')
  const govTokenPrice = useBUSDPrice(govToken)
  const circulatingMarketCap = govTokenPrice ? totalUnlockedSupply?.multiply(govTokenPrice.raw) : undefined
  const totalMarketCap = govTokenPrice ? totalSupply?.multiply(govTokenPrice.raw) : undefined
  const tooltips: Record<string, string> = {
    unlockedRewards:
      'Unlocked pending rewards - 5% of your claimable rewards will be directly accessible upon claiming.',
    lockedRewards:
      'Locked pending rewards - 95% of your claimable rewards will be locked until 00:00:00 December 25th, 2021 (UTC). They will thereafter gradually unlock until December 25th, 2022.',
    lockedBalance:
      'Locked balance - Your locked balance will remain locked until 00:00:00 December 25th, 2021 (UTC). Your locked tokens will thereafter gradually unlock until December 25th, 2022.'
  }

  return (
    <ContentWrapper gap="lg">
      <ModalUpper>
        <CardBGImage />
        <CardNoise />
        <CardSection gap="md">
          <RowBetween>
            <TYPE.white color="white">Your {govToken?.symbol} Breakdown</TYPE.white>
            <StyledClose stroke="white" onClick={() => setShowUniBalanceModal(false)} />
          </RowBetween>
        </CardSection>
        <Break />
        {account && (
          <>
            <CardSection gap="sm">
              <AutoColumn gap="md" justify="center">
                <UniTokenAnimated width="48px" src={getTokenLogo()} />{' '}
                <TYPE.white fontSize={48} fontWeight={600} color="white">
                  {total?.toFixed(2, { groupSeparator: ',' })}
                </TYPE.white>
              </AutoColumn>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white color="white">Balance:</TYPE.white>
                  <TYPE.white color="white">
                    <MouseoverTooltip
                      text={
                        govTokenPrice && govTokenBalance && govTokenBalance.greaterThan('0')
                          ? `USD: $${govTokenBalance
                              .multiply(govTokenPrice?.raw)
                              .toSignificant(6, { groupSeparator: ',' })}`
                          : ''
                      }
                    >
                      {govTokenBalance?.toFixed(2, { groupSeparator: ',' })}
                    </MouseoverTooltip>
                  </TYPE.white>
                </RowBetween>
                <RowBetween>
                  <TYPE.white color="white">
                    <MouseoverTooltip text={tooltips.unlockedRewards}>
                      <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                        🔓
                      </span>
                      Pending Rewards:
                    </MouseoverTooltip>
                  </TYPE.white>
                  <TYPE.white color="white">
                    {unlockedGovTokensToClaim?.toFixed(2, { groupSeparator: ',' })}{' '}
                    {unlockedGovTokensToClaim && unlockedGovTokensToClaim.greaterThan('0') && (
                      <StyledInternalLink onClick={() => setShowUniBalanceModal(false)} to="/staking">
                        (claim)
                      </StyledInternalLink>
                    )}
                  </TYPE.white>
                </RowBetween>
                <RowBetween>
                  <TYPE.white color="white">
                    <MouseoverTooltip text={tooltips.lockedRewards}>
                      <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                        🔒
                      </span>
                      Pending Rewards:
                    </MouseoverTooltip>
                  </TYPE.white>
                  <TYPE.white color="white">
                    {lockedGovTokensToClaim?.toFixed(2, { groupSeparator: ',' })}{' '}
                    {lockedGovTokensToClaim && lockedGovTokensToClaim.greaterThan('0') && (
                      <StyledInternalLink onClick={() => setShowUniBalanceModal(false)} to="/staking">
                        (claim)
                      </StyledInternalLink>
                    )}
                  </TYPE.white>
                </RowBetween>
              </AutoColumn>
            </CardSection>
            <Break />
            <CardSection gap="sm">
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white color="white">
                    <MouseoverTooltip text={tooltips.lockedBalance}>Locked Balance:</MouseoverTooltip>
                  </TYPE.white>
                  <TYPE.white color="white">
                    <MouseoverTooltip
                      text={
                        govTokenPrice && govTokenLockedBalance && govTokenLockedBalance.greaterThan('0')
                          ? `USD: $${govTokenLockedBalance
                              .multiply(govTokenPrice?.raw)
                              .toSignificant(6, { groupSeparator: ',' })}`
                          : ''
                      }
                    >
                      {govTokenLockedBalance?.toFixed(2, { groupSeparator: ',' })}
                    </MouseoverTooltip>
                  </TYPE.white>
                </RowBetween>
                <RowBetween>
                  <TYPE.white color="white">Total Balance:</TYPE.white>
                  <TYPE.white color="white">
                    <MouseoverTooltip
                      text={
                        govTokenPrice && govTokenTotalBalance && govTokenTotalBalance.greaterThan('0')
                          ? `USD: $${govTokenTotalBalance
                              .multiply(govTokenPrice?.raw)
                              .toSignificant(6, { groupSeparator: ',' })}`
                          : ''
                      }
                    >
                      {govTokenTotalBalance?.toFixed(2, { groupSeparator: ',' })}
                    </MouseoverTooltip>
                  </TYPE.white>
                </RowBetween>
              </AutoColumn>
            </CardSection>
            <Break />
          </>
        )}
        <CardSection gap="sm">
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.white color="white">{govToken?.symbol} in circulation:</TYPE.white>
              <TYPE.white color="white">{totalUnlockedSupply?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white color="white">{govToken?.symbol} total supply:</TYPE.white>
              <TYPE.white color="white">{totalSupply?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>
            </RowBetween>
          </AutoColumn>
        </CardSection>
        {blockchain === Blockchain.HARMONY && govTokenPrice && circulatingMarketCap && totalMarketCap && (
          <>
            <Break />
            <CardSection gap="sm">
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white color="white">{govToken?.symbol} price:</TYPE.white>
                  <TYPE.white color="white">${govTokenPrice?.toFixed(4) ?? '-'}</TYPE.white>
                </RowBetween>
                {circulatingMarketCap && (
                  <RowBetween>
                    <TYPE.white color="white">{govToken?.symbol} circ. market cap:</TYPE.white>
                    <TYPE.white color="white">${circulatingMarketCap?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>
                  </RowBetween>
                )}
                {totalMarketCap && (
                  <RowBetween>
                    <TYPE.white color="white">{govToken?.symbol} total market cap:</TYPE.white>
                    <TYPE.white color="white">${totalMarketCap?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>
                  </RowBetween>
                )}
              </AutoColumn>
            </CardSection>
          </>
        )}
      </ModalUpper>
    </ContentWrapper>
  )
}

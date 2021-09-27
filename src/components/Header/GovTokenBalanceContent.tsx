import { Blockchain, ChainId, Pair, Percent, TokenAmount } from '@fatex-dao/sdk'
import React, { useMemo } from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'
import getTokenLogo from '../../utils/getTokenLogo'
import { useGovTokenSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
import { useTotalGovTokensEarned, useTotalLockedGovTokens } from '../../state/stake/hooks'
import { useAddressesTokenBalance, useTokenBalance } from '../../state/wallet/hooks'
import { StyledInternalLink, TYPE, UniTokenAnimated } from '../../theme'
import useBUSDPrice from '../../hooks/useBUSDPrice'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { Break, CardBGImage, CardNoise, CardSection, DataCard } from '../earn/styled'
import useGovernanceToken from '../../hooks/useGovernanceToken'
import { MouseoverTooltip } from '../Tooltip'
import useBlockchain from '../../hooks/useBlockchain'
import { X_FATE } from '../../constants'
import { useTrackedTokenPairs } from '../../state/user/hooks'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ModalUpper = styled(DataCard)`
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
  const { account, chainId } = useActiveWeb3React()
  const govToken = useGovernanceToken()
  const blockchain = useBlockchain()
  const govTokenBalance = useTokenBalance(account ?? undefined, govToken)
  const unlockedGovTokensToClaim = useTotalGovTokensEarned()
  const govTokenLockedBalance = useTotalLockedGovTokens()
  const lockedGovTokensToClaim = govToken ? new TokenAmount(govToken, '0') : undefined
  const govTokenTotalBalance =
    govTokenLockedBalance && lockedGovTokensToClaim && unlockedGovTokensToClaim
      ? govTokenBalance
          ?.add(govTokenLockedBalance)
          .add(lockedGovTokensToClaim)
          .add(unlockedGovTokensToClaim)
      : undefined

  const totalSupply = useGovTokenSupply()
  const outOfCirculationBalances = [
    '0xef1a47106b5B1eb839a2995fb29Fa5a7Ff37Be27', // FateRewardController
    '0x3170e252D06f01a846e92CB0139Cdb16c69E867d', // FateRewardVault
    '0xcd9C194E47862CEDfC47bd6EDe9ba92EAb3d8B44', // FGCD Vault
    '0x5828930EF8e1Dc22360785c330aBe62BDa4B67E6', // Legal Vault
    '0xA402084A04c222e25ae5748CFB12C76445a2a709', // Growth Vault
    '0xe5bA0b2f098cB2f2efA986bF605Bd6DBc8acD7D6', // Presale Vault
    '0x5b351d270216848026DB6ac9fafBf4d422d5Ca43', // Founder Vault
    '0xFe2976Fc317667743d72D232DCEdd4E250170f1B', // Advisor Vault
    '0x45caFF15EEBe2D5Bd5569fa3878953d29376bb34', // Advisor Vault
    '0xFD266a3D4DA9d185A0491f71cE61C5a22014d874', // Team Vault
    '0x05eEE03F9A3Fa10aAC2921451421A9f4e37EaBbc' // founder address?
  ]
  const totalLockedSupplyMap = useAddressesTokenBalance(outOfCirculationBalances, govToken)
  const totalLockedSupply = govToken
    ? Object.values(totalLockedSupplyMap).reduce<TokenAmount>((memo, value) => {
        return memo.add(value ?? new TokenAmount(govToken, '0'))
      }, new TokenAmount(govToken, '0'))
    : undefined
  const totalUnlockedSupply = totalLockedSupply ? totalSupply?.subtract(totalLockedSupply) : undefined

  const xFateBalance = useTokenBalance(X_FATE[chainId ?? ChainId.HARMONY_MAINNET].address, govToken)
  const xFatePercentage =
    xFateBalance && totalUnlockedSupply ? new Percent(xFateBalance.quotient, totalUnlockedSupply.quotient) : undefined

  const allPairs = useTrackedTokenPairs()
  const pairAddresses = useMemo(() => {
    if (!govToken) {
      return undefined
    }
    return allPairs
      .filter(pair => pair[0].address === govToken.address || pair[1].address === govToken.address)
      .map(pair => Pair.getAddress(pair[0], pair[1]))
  }, [govToken])
  const lpBalanceMap = useAddressesTokenBalance(pairAddresses, govToken)
  const lpBalance = govToken
    ? Object.values(lpBalanceMap).reduce<TokenAmount>((memo, value) => {
        return memo.add(value ?? new TokenAmount(govToken, '0'))
      }, new TokenAmount(govToken, '0'))
    : undefined
  const lpPercentage =
    lpBalance && totalUnlockedSupply ? new Percent(lpBalance.quotient, totalUnlockedSupply.quotient) : undefined

  const govTokenPrice = useBUSDPrice(govToken)
  const fatePrice =
    govTokenPrice && govToken ? new TokenAmount(govToken, '1000000000000000000').multiply(govTokenPrice.raw) : undefined
  const circulatingMarketCap = govTokenPrice ? totalUnlockedSupply?.multiply(govTokenPrice.raw) : undefined
  const totalMarketCap = govTokenPrice ? totalSupply?.multiply(govTokenPrice.raw) : undefined
  const tooltips: Record<string, string> = {
    unlockedRewards:
      'Unlocked pending rewards - 20% of your claimable rewards will be directly accessible upon claiming.',
    lockedRewards:
      'Locked pending rewards - 80% of your claimable rewards will be locked until 19:43:45 November 25th, 2021 (UTC). They will thereafter gradually unlock after this date.',
    lockedBalance:
      'Locked balance - Your locked balance will remain locked until 19:43:45 November 25th, 2021 (UTC). Your locked tokens will thereafter gradually unlock after this date.',
    xFatePercentage: 'The percentage of FATE in circulation that is deposited in xFATE.',
    lpPercentage: 'The percentage of FATE in circulation that is deposited AMM pools.'
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
                  {govTokenTotalBalance?.toFixed(2, { groupSeparator: ',' })}
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
                      Unclaimed Locked Rewards:
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
        {blockchain === Blockchain.HARMONY && (
          <>
            <Break />
            <CardSection gap="sm">
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white color="white">{govToken?.symbol} price:</TYPE.white>
                  <TYPE.white color="white">
                    {fatePrice ? '$' : ''}
                    {fatePrice?.toFixed(4) ?? '-'}
                  </TYPE.white>
                </RowBetween>
                <RowBetween>
                  <TYPE.white color="white">% deposited in xFATE</TYPE.white>
                  <TYPE.white color="white">
                    <MouseoverTooltip text={tooltips['xFatePercentage']}>
                      {xFatePercentage?.toFixed(2) ?? '-'}
                      {xFatePercentage ? '%' : ''}
                    </MouseoverTooltip>
                  </TYPE.white>
                </RowBetween>
                <RowBetween>
                  <TYPE.white color="white">% deposited in Pools</TYPE.white>
                  <TYPE.white color="white">
                    <MouseoverTooltip text={tooltips['lpPercentage']}>
                      {lpPercentage?.toFixed(2) ?? '-'}
                      {lpPercentage ? '%' : ''}
                    </MouseoverTooltip>
                  </TYPE.white>
                </RowBetween>
                {circulatingMarketCap && (
                  <RowBetween>
                    <TYPE.white color="white">{govToken?.symbol} circ. market cap:</TYPE.white>
                    <TYPE.white color="white">
                      {circulatingMarketCap ? '$' : ''}
                      {circulatingMarketCap?.toFixed(0, { groupSeparator: ',' }) ?? '-'}
                    </TYPE.white>
                  </RowBetween>
                )}
                {totalMarketCap && (
                  <RowBetween>
                    <TYPE.white color="white">{govToken?.symbol} total market cap:</TYPE.white>
                    <TYPE.white color="white">
                      {totalMarketCap ? '$' : ''}
                      {totalMarketCap?.toFixed(0, { groupSeparator: ',' }) ?? '-'}
                    </TYPE.white>
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

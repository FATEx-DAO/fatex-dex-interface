import { Blockchain, ChainId, Pair, Percent, TokenAmount } from '@fatex-dao/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useGovTokenSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
import { useTotalGovTokensEarned, useTotalLockedGovTokens } from '../../state/stake/hooks'
import { useAddressesTokenBalance, useTokenBalance } from '../../state/wallet/hooks'
import useBUSDPrice from '../../hooks/useBUSDPrice'
import useGovernanceToken from '../../hooks/useGovernanceToken'
import useBlockchain from '../../hooks/useBlockchain'
import { X_FATE } from '../../constants'
import { useTrackedTokenPairs } from '../../state/user/hooks'
//import { useLocation } from 'react-router-dom'
import { CardBGImage, CardNoise } from '../earn/styled'
import { X } from 'react-feather'

const StatsWrapper = styled.div<{ inline: boolean | undefined }>`
  width: 100%;
  height: auto;
  overflow: hidden;
  position: relative;
  padding: 20px 30px 25px;
  border-radius: 8px;
  margin: 0 auto;
  display: absolute;
  background-color: ${({ theme }) => theme.bg3};
  /*position: ${({ inline }) => (inline ? 'inline-block' : 'fixed')};
  bottom: 0;
  left: 0;
  padding: ${({ inline }) => (inline ? '0' : '20px')};*/

  /*${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};*/
`

const StyledClose = styled(X)`
  position: absolute;
  right: 16px;
  top: 16px;

  :hover {
    cursor: pointer;
  }
`

const InfoRow = styled.div`
  width: 100%;
  font-size: 14px;
  line-height: 22px;
  font-weight: 200;
  color: ${({ theme }) => theme.text1};
`

const TitleRow = styled.div`
  width: 100%;
  height: fit-content;
  text-align: center;
  font-weight: 600;
  margin-top: 8px;
  margin-bottom: 5px;
`

const Label = styled.div`
  width: 65%;
  display: inline-block;
`

const Value = styled.div`
  width: 35%;
  display: inline-block;
  text-align: right;
`

/**
 * Content for balance stats modal
 */
export default function GovTokenBalanceContent({
  setShowUniBalanceModal,
  inline
}: {
  setShowUniBalanceModal: any
  inline?: boolean | undefined
}) {
  const { account, chainId } = useActiveWeb3React()
  const govToken = useGovernanceToken()
  const blockchain = useBlockchain()
  const govTokenBalance = useTokenBalance(account ?? undefined, govToken)
  const xFateUserBalance = useTokenBalance(account ?? undefined, X_FATE[chainId ?? ChainId.HARMONY_MAINNET])
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

  //const location = useLocation()
  const isStaking = false //location.pathname === '/staking'

  const totalSupply = useGovTokenSupply()
  const outOfCirculationBalances = [
    '0xef1a47106b5B1eb839a2995fb29Fa5a7Ff37Be27', // FateRewardController
    '0x3170e252D06f01a846e92CB0139Cdb16c69E867d', // FateRewardVault
    '0xcd9C194E47862CEDfC47bd6EDe9ba92EAb3d8B44', // FGCD Vault
    '0xc7d76DA3F4Da35Bd85de3042CDD8c59dC8dc6226', // Legal Vault
    '0xA402084A04c222e25ae5748CFB12C76445a2a709', // Growth Vault
    '0xe5bA0b2f098cB2f2efA986bF605Bd6DBc8acD7D6', // Presale Vault
    '0x5b351d270216848026DB6ac9fafBf4d422d5Ca43', // Founder Vault
    '0xFe2976Fc317667743d72D232DCEdd4E250170f1B', // Advisor Vault
    '0x45caFF15EEBe2D5Bd5569fa3878953d29376bb34', // Advisor Vault
    '0xFD266a3D4DA9d185A0491f71cE61C5a22014d874', // Team Vault
    '0x05eEE03F9A3Fa10aAC2921451421A9f4e37EaBbc' // founder address EOA? // has some FATE in xFATE which messes up count
    // '0xE3AC7a0780344E41A90FE8b750bFAC521B0c1fFb' // team address EOA? // has some FATE in xFATE which messes up count
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
  /*const tooltips: Record<string, string> = {
    unlockedRewards:
      'Unlocked pending rewards - 20% of your claimable rewards will be directly accessible upon claiming.',
    lockedRewards:
      'Locked pending rewards - 80% of your claimable rewards will be locked until 19:43:45 November 25th, 2021 (UTC). They will thereafter gradually unlock after this date.',
    lockedBalance:
      'Locked balance - Your locked balance will remain locked until 19:43:45 November 25th, 2021 (UTC). Your locked tokens will thereafter gradually unlock after this date.',
    xFatePercentage: 'The percentage of FATE in circulation that is deposited in xFATE.',
    lpPercentage: 'The percentage of FATE in circulation that is deposited AMM pools.'
  }*/

  return isStaking && !inline ? (
    <></>
  ) : (
    <StatsWrapper inline={inline}>
      <CardBGImage desaturate />
      <CardNoise />
      {account && (
        <>
          <StyledClose stroke="white" onClick={() => setShowUniBalanceModal(false)} />
          <TitleRow>Your FATE Breakdown:</TitleRow>
          <InfoRow>
            <Label>FATE Balance:</Label>
            <Value>{govTokenBalance?.toFixed(2, { groupSeparator: ',' }) || '0.00'}</Value>
          </InfoRow>
          <InfoRow>
            <Label>xFATE Balance:</Label>
            <Value>{xFateUserBalance?.toFixed(2, { groupSeparator: ',' }) || '0.00'}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Total Balance:</Label>
            <Value>{govTokenTotalBalance?.toFixed(2, { groupSeparator: ',' }) || '0.00'}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Claimable Staking Rewards:</Label>
            <Value>{lockedGovTokensToClaim?.toFixed(2, { groupSeparator: ',' }) || '0.00'}</Value>
          </InfoRow>
          <br />
          <TitleRow>Global FATE Stats:</TitleRow>
          <InfoRow>
            <Label>FATE in circulation:</Label>
            <Value>{totalUnlockedSupply?.toFixed(0, { groupSeparator: ',' }) || '-'}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Amount in xFATE:</Label>
            <Value>{xFateBalance?.toFixed(2, { groupSeparator: ',' }) || '0.00'}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Total FATE supply:</Label>
            <Value>{totalSupply?.toFixed(0, { groupSeparator: ',' }) || '-'}</Value>
          </InfoRow>
          {blockchain === Blockchain.HARMONY && (
            <>
              <InfoRow>
                <Label>FATE price:</Label>
                <Value>
                  {fatePrice ? '$' : ''}
                  {fatePrice?.toFixed(4) ?? '-'}
                </Value>
              </InfoRow>
              <InfoRow>
                <Label>% deposited in xFATE:</Label>
                <Value>
                  {xFatePercentage?.toFixed(2) ?? '-'}
                  {xFatePercentage ? '%' : ''}
                </Value>
              </InfoRow>
              <InfoRow>
                <Label>% deposited in pools:</Label>
                <Value>
                  {lpPercentage?.toFixed(2) ?? '-'}
                  {lpPercentage ? '%' : ''}
                </Value>
              </InfoRow>
              {circulatingMarketCap && (
                <InfoRow>
                  <Label>circ. market cap:</Label>
                  <Value>
                    {circulatingMarketCap ? '$' : ''}
                    {circulatingMarketCap?.toFixed(0, { groupSeparator: ',' }) ?? '-'}
                  </Value>
                </InfoRow>
              )}
              {totalMarketCap && (
                <InfoRow>
                  <Label>FATE total market cap:</Label>
                  <Value>
                    {totalMarketCap ? '$' : ''}
                    {totalMarketCap?.toFixed(0, { groupSeparator: ',' }) ?? '-'}
                  </Value>
                </InfoRow>
              )}
            </>
          )}
        </>
      )}
    </StatsWrapper>
  )
}

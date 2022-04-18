import { Blockchain, ChainId, TokenAmount } from '@fatex-dao/sdk'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import Popover from '@material-ui/core/Popover'

import styled from 'styled-components'

import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'

import { Moon, Sun } from 'react-feather'
import Menu from '../Menu'

import Row, { RowFixed } from '../Row'
import Web3Status from '../Web3Status'
import ClaimModal from '../claim/ClaimModal'
import Modal from '../Modal'
import GovTokenBalanceContent from './GovTokenBalanceContent'
import Card from '../Card'
import { ExternalLink } from '../../theme'
import useGovernanceToken from '../../hooks/useGovernanceToken'
import useBUSDPrice from '../../hooks/useBUSDPrice'
import { X_FATE } from '../../constants'
import { useAddressesTokenBalance, useTokenBalance } from '../../state/wallet/hooks'
import { useTotalGovTokensEarned, useTotalLockedGovTokens } from '../../state/stake/hooks'
import { useGovTokenSupply } from '../../data/TotalSupply'
import useXFateRatio from '../../hooks/useXFateRatio'
import { ButtonPrimary } from '../Button'
import useBlockchain from '../../hooks/useBlockchain'
import { useToggleModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/actions'
import { isMobile } from 'react-device-detect'

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  padding: 1rem;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: calc(100%);
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.bg1};
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 0;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const ModeHeaderElementWrap = styled(HeaderElementWrap)`
  position: fixed;
  bottom: 20px;
  left: 10px;
  display: block;

  ${({ theme }) => theme.mediaWidth.upToMedium`
     position: static;
     display: flex;
  `};
`

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
`};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg1)};
  border-radius: 8px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`

// const UNIAmount = styled(AccountElement)`
//   color: white;
//   padding: 4px 8px;
//   height: 36px;
//   font-weight: 500;
//   background-color: ${({ theme }) => theme.bg1};
//   // background: radial-gradient(
//   //   76.02% 75.41% at 1.84% 0%,
//   //   ${({ theme }) => theme.tokenButtonGradientStart} 0%,
//   //   ${({ theme }) => theme.tokenButtonGradientEnd} 100%
//   // );
// `

// const UNIWrapper = styled.span`
//   width: fit-content;
//   position: relative;
//   cursor: pointer;
//
//   :hover {
//     opacity: 0.8;
//   }
//
//   :active {
//     opacity: 0.9;
//   }
// `

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const NetworkCard = styled(Card)`
  text-align: center;
  color: ${({ theme }) => theme.text1};
  background: ${({ theme }) => theme.bg3};
  padding: 7px 18px 7px 18px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 14px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  font-size: 40px;
  font-weight: 500;
  color: ${({ theme }) => theme.text1};
  text-decoration: none;
  margin-top: -10px;
  line-height: 40px;
  margin-left: 0;
  cursor: pointer;

  > span {
    font-size: 24px;
    font-weight: 300;
    line-height: 40px;
    margin-top: 12px;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
    font-size: 32px;
    > span {
      font-size: 16px;
    }
  `};

  @media screen and (max-width: 960px) {
    margin-top: 4px;
  }

  @media screen and (max-width: 600px) {
    margin-top: -20px;
  }
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 8px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const StyledExternalLink = styled(ExternalLink).attrs({
  activeClassName
})<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text6};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 8px;
    font-weight: 600;
    color: ${({ theme }) => theme.text4};
  }

  :hover,
  :focus {
    color: ${({ theme }) => theme.text4};
    text-decoration: none;
  }

  a {
    text-decoration: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      display: none;
`}
`

const DesktopHeader = styled.div`
  display: contents;
  @media screen and (max-width: 600px) {
    display: none;
  }
`

const MobileHeader = styled.div`
  display: none;
  @media screen and (max-width: 600px) {
    display: contents;
  }
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
  align-items: flex-end;
`

export const StyledMenuButton = styled.button`
  position: relative;
  width: 110px;
  margin: 0;
  height: 42px;
  margin-left: 0px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  border: 3px solid ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.text1};
  margin-right: 8px;

  :hover {
    color: ${({ theme }) => theme.text6}
    background-color: ${({ theme }) => theme.bg6};

    svg {
      filter: invert(1);
    }
  }

  svg {
    margin-top: 2px;
  }

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
  
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: fit-content;
    margin-left: 8px;
    margin-right: 0;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: fit-content;
    font-size: 10px;
  `}
`

const InfoRow = styled.div`
  width: 100%;
  font-size: 14px;
  line-height: 22px;
  font-weight: 200;
  color: ${({ theme }) => theme.text1};
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

const BridgeButton = styled.div`
  cursor: pointer;
  margin: 0 12px;
  color: ${({ theme }) => theme.text2};

  :hover {
    color: ${({ theme }) => theme.text1};
  }
`

const BridgePopoverInner = styled.div`
  padding: 10px;
  overflow: hidden;
  background: ${({ theme }) => theme.text1};
`

const BridgeWrapper = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <>
      <BridgeButton aria-describedby={id} onClick={handleClick}>
        Bridge
      </BridgeButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <BridgePopoverInner>
          <StyledExternalLink href={'https://bridge.harmony.one'}>Ethereum</StyledExternalLink>
          <StyledExternalLink href={'https://bridge.harmony.one'}>BSC</StyledExternalLink>
          <StyledExternalLink href={'https://anyswap.exchange/#/bridge'}>AnySwap</StyledExternalLink>
          <StyledExternalLink href={'https://synapseprotocol.com'}>Synapse</StyledExternalLink>
        </BridgePopoverInner>
      </Popover>
    </>
  )
}

const InfoPopoverInner = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  padding: 20px;
  width: 360px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: calc(100vw - 32px);
  `}
`

const StatsInfoWrapper = ({ title, content }: { title: string; content: any }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <>
      <StyledMenuButton aria-describedby={id} onClick={handleClick}>
        {title}
      </StyledMenuButton>
      <Popover
        id={'stats-popover'}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <InfoPopoverInner>{content}</InfoPopoverInner>
      </Popover>
    </>
  )
}

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.HARMONY_TESTNET]: 'Harmony Testnet'
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  const blockchain = useBlockchain()
  const { t } = useTranslation()

  const govToken = useGovernanceToken()

  const [darkMode, toggleDarkMode] = useDarkModeManager()

  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)
  const openClaimModal = useToggleModal(ApplicationModal.ADDRESS_CLAIM)

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

  const totalSupply = useGovTokenSupply()
  const outOfCirculationBalances = [
    '0x7a8B2780189fa8758bf212321DabDbd3856D1155', // FateRewardController
    '0x7aB7B87B4a90042f655CAe53cA984305EBb17a18', // FateRewardVault
    '0xa608dE0761eb27878423d74cD78a2A731695cac4', // Community Vault
    '0x0619f9A8961b1B57b602B5BA6214c2dF5695582d', // FGCD Vault
    '0x4BC7080cd426ca067B5658d2a8d261Cf7D5b5622', // Growth Vault
    '0x04Ca98cf10e94863741B42f53E384Bcd36dDb579', // Legal Vault
    '0x78a3A4e7722c61e391a02b8e1393219F6b5bFBF8', // Presale Vault
    '0x279A93B959cb4a76c882a2685377A2fACcf14d49', // Advisor Vault
    '0xE07DEACbB15C45a09E7026888cA1e703Aa8217F6' // Advisor Vault
    // '', // Team Vault
    // '' // founder address EOA? // has some FATE in xFATE which messes up count
    // '0xE3AC7a0780344E41A90FE8b750bFAC521B0c1fFb' // team address EOA? // has some FATE in xFATE which messes up count
  ]
  const totalLockedSupplyMap = useAddressesTokenBalance(outOfCirculationBalances, govToken)
  const totalLockedSupply = govToken
    ? Object.values(totalLockedSupplyMap).reduce<TokenAmount>((memo, value) => {
        return memo.add(value ?? new TokenAmount(govToken, '0'))
      }, new TokenAmount(govToken, '0'))
    : undefined
  const totalUnlockedSupply = totalLockedSupply ? totalSupply?.subtract(totalLockedSupply) : undefined

  const govTokenPrice = useBUSDPrice(govToken)
  const fatePrice =
    govTokenPrice && govToken ? new TokenAmount(govToken, '1000000000000000000').multiply(govTokenPrice.raw) : undefined

  const xFateRatio = useXFateRatio()
  const xFATEPrice = fatePrice && xFateRatio ? fatePrice.multiply(xFateRatio) : undefined

  const unlockedTokensPrice =
    govTokenPrice && unlockedGovTokensToClaim ? unlockedGovTokensToClaim.multiply(govTokenPrice.raw) : undefined

  const lockedTokensPrice =
    govTokenPrice && govTokenLockedBalance ? govTokenLockedBalance.multiply(govTokenPrice.raw) : undefined

  const totalTokensPrice =
    govTokenPrice && govTokenTotalBalance ? govTokenTotalBalance.multiply(govTokenPrice.raw) : undefined

  const circulatingMarketCap = govTokenPrice ? totalUnlockedSupply?.multiply(govTokenPrice.raw) : undefined
  const totalMarketCap = govTokenPrice ? totalSupply?.multiply(govTokenPrice.raw) : undefined

  return (
    <HeaderFrame>
      <ClaimModal />
      <Modal isOpen={showUniBalanceModal} onDismiss={() => setShowUniBalanceModal(false)}>
        <GovTokenBalanceContent setShowUniBalanceModal={setShowUniBalanceModal} />
      </Modal>
      <HeaderRow>
        <Title href=".">
          FATEx<span>FI</span>
        </Title>
        <MobileHeader>
          <HeaderLinks>
            <Column>
              <StyledNavLink
                id={`stake-nav-link`}
                to={'/depository'}
                isActive={(match, { pathname }) =>
                  Boolean(match) ||
                  pathname.startsWith('/add') ||
                  pathname.startsWith('/remove') ||
                  pathname.startsWith('/create') ||
                  pathname.startsWith('/find')
                }
              >
                Depository
              </StyledNavLink>
              <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
                {t('swap')}
              </StyledNavLink>
            </Column>
            <Column>
              <StyledNavLink id={`xfate-nav-link`} to={`/xFATE`}>
                xFATE
              </StyledNavLink>
              {/*<StyledNavLink id={`vote-nav-link`} to={`${'/vote'}`}>*/}
              {/*  Vote*/}
              {/*</StyledNavLink>*/}
              {/*<StyledNavLink id={`migrate-nav-link`} to={`/migrate`}>*/}
              {/*  Migrate*/}
              {/*</StyledNavLink>*/}
              <BridgeWrapper />
            </Column>
          </HeaderLinks>
        </MobileHeader>
        <DesktopHeader>
          <HeaderLinks>
            <StyledNavLink
              id={`stake-nav-link`}
              to={'/depository'}
              isActive={(match, { pathname }) =>
                Boolean(match) ||
                pathname.startsWith('/add') ||
                pathname.startsWith('/remove') ||
                pathname.startsWith('/create') ||
                pathname.startsWith('/find')
              }
            >
              Depository
            </StyledNavLink>
            <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
              {t('swap')}
            </StyledNavLink>
            <StyledNavLink id={`xfate-nav-link`} to={`/xFATE`}>
              xFATE
            </StyledNavLink>
            {/*<StyledNavLink id={`vote-nav-link`} to={`${'/vote'}`}>*/}
            {/*  Vote*/}
            {/*</StyledNavLink>*/}
            {/*<StyledNavLink id={`migrate-nav-link`} to={`/migrate`}>*/}
            {/*  Migrate*/}
            {/*</StyledNavLink>*/}
            <BridgeWrapper />
            {/*<ExternalLink id={'link'} href={`https://fatexdao.gitbook.io/fatexdao/`}>
              Learn
            </ExternalLink>*/}
          </HeaderLinks>
        </DesktopHeader>
      </HeaderRow>
      <HeaderControls>
        <HeaderElement>
          <HideSmall>
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
            )}
          </HideSmall>
          <HeaderElementWrap>
            <StatsInfoWrapper
              title={`${govToken?.symbol} STATS`}
              content={
                <>
                  <InfoRow>
                    <Label>FATE price:</Label>
                    <Value>
                      {fatePrice ? '$' : ''}
                      {fatePrice?.toSignificant(8) ?? '-'}
                    </Value>
                  </InfoRow>
                  <InfoRow>
                    <Label>xFATE price:</Label>
                    <Value>
                      {xFATEPrice ? '$' : ''}
                      {xFATEPrice?.toSignificant(8) ?? '-'}
                    </Value>
                  </InfoRow>
                  <InfoRow>
                    <Label>FATE in circulation:</Label>
                    <Value>{totalUnlockedSupply?.toFixed(0, { groupSeparator: ',' }) || '-'}</Value>
                  </InfoRow>
                  <InfoRow>
                    <Label>Total FATE supply:</Label>
                    <Value>{totalSupply?.toFixed(0, { groupSeparator: ',' }) || '-'}</Value>
                  </InfoRow>
                  {circulatingMarketCap && (
                    <InfoRow>
                      <Label>Circ. market cap:</Label>
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
              }
            />
          </HeaderElementWrap>
          {account && (
            <HeaderElementWrap>
              <StatsInfoWrapper
                title={`USER STATS`}
                content={
                  <>
                    <InfoRow>
                      <Label>FATE Wallet Balance:</Label>
                      <Value>{govTokenBalance?.toFixed(2, { groupSeparator: ',' }) || '0.00'}</Value>
                    </InfoRow>
                    <InfoRow>
                      <Label>xFATE Wallet Balance:</Label>
                      <Value>{xFateUserBalance?.toFixed(2, { groupSeparator: ',' }) || '0.00'}</Value>
                    </InfoRow>
                    <InfoRow>
                      <Label>Total Balance:</Label>
                      <Value>{govTokenTotalBalance?.toFixed(2, { groupSeparator: ',' }) || '0.00'}</Value>
                    </InfoRow>
                    <InfoRow>
                      <Label>Unlocked $ Amount:</Label>
                      <Value>{unlockedTokensPrice?.toFixed(2, { groupSeparator: ',' }) || '0.00'}</Value>
                    </InfoRow>
                    <InfoRow>
                      <Label>Locked $ Amount:</Label>
                      <Value>{lockedTokensPrice?.toFixed(2, { groupSeparator: ',' }) || '0.00'}</Value>
                    </InfoRow>
                    <InfoRow>
                      <Label>Total $ Amount:</Label>
                      <Value>{totalTokensPrice?.toFixed(2, { groupSeparator: ',' }) || '0.00'}</Value>
                    </InfoRow>
                  </>
                }
              />
            </HeaderElementWrap>
          )}
          {account && !isMobile && blockchain === Blockchain.POLYGON && (
            // <ButtonPrimary onClick={openClaimModal} padding="8px 16px" width="100%" borderRadius="12px" mt="0.5rem">
            //   Claim {govToken?.symbol}
            // </ButtonPrimary>
            <div>
              <StyledMenuButton onClick={openClaimModal}>CLAIM {govToken?.symbol}</StyledMenuButton>
            </div>
          )}
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <ModeHeaderElementWrap>
          <StyledMenuButton onClick={() => toggleDarkMode()} style={{ width: 'fit-content', marginLeft: '8px' }}>
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
          </StyledMenuButton>
          <Menu />
        </ModeHeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}

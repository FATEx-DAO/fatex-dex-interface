import { ChainId } from '@fatex-dao/sdk'
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
    margin-left: 8px;
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
  font-size: 60px;
  font-weight: 700;
  color: ${({ theme }) => theme.text1};
  text-decoration: none;
  margin-top: -18px;
  line-height: 32px;
  margin-left: 8px;
  cursor: pointer;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
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
  width: fit-content;
  margin: 0;
  height: 42px;
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  border: 3px solid ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.text1};

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
`

const BridgeButton = styled.div`
  cursor: pointer;
  margin: 0 12px;
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
        </BridgePopoverInner>
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
  const { t } = useTranslation()

  const govToken = useGovernanceToken()

  // const [isDark] = useDarkModeManager()
  const [darkMode, toggleDarkMode] = useDarkModeManager()

  //const toggleClaimModal = useToggleSelfClaimModal()

  // const availableClaim: boolean = useUserHasAvailableClaim(account)

  //const { claimTxn } = useUserHasSubmittedClaim(account ?? undefined)

  //const aggregateBalance: TokenAmount | undefined = useAggregateGovTokenBalance()

  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)
  //const showClaimPopup = useShowClaimPopup()

  //const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  //const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  return (
    <HeaderFrame>
      <ClaimModal />
      <Modal isOpen={showUniBalanceModal} onDismiss={() => setShowUniBalanceModal(false)}>
        <GovTokenBalanceContent setShowUniBalanceModal={setShowUniBalanceModal} />
      </Modal>
      <HeaderRow>
        <Title href=".">x</Title>
        <MobileHeader>
          <HeaderLinks>
            <Column>
              <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
                {t('swap')}
              </StyledNavLink>
              <StyledNavLink
                id={`pool-nav-link`}
                to={'/pool'}
                isActive={(match, { pathname }) =>
                  Boolean(match) ||
                  pathname.startsWith('/add') ||
                  pathname.startsWith('/remove') ||
                  pathname.startsWith('/create') ||
                  pathname.startsWith('/find')
                }
              >
                {t('pool')}
              </StyledNavLink>
              <StyledNavLink id={`stake-nav-link`} to={'/staking'}>
                Staking
              </StyledNavLink>
            </Column>
            <Column>
              <StyledNavLink id={`xfate-nav-link`} to={`${'/xFATE'}`}>
                xFATE
              </StyledNavLink>
              {/*<StyledNavLink id={`vote-nav-link`} to={`${'/vote'}`}>*/}
              {/*  Vote*/}
              {/*</StyledNavLink>*/}
              <StyledNavLink id={`migrate-nav-link`} to={`/migrate`}>
                Migrate
              </StyledNavLink>
              <BridgeWrapper />
            </Column>
          </HeaderLinks>
        </MobileHeader>
        <DesktopHeader>
          <HeaderLinks>
            <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
              {t('swap')}
            </StyledNavLink>
            <StyledNavLink
              id={`pool-nav-link`}
              to={'/pool'}
              isActive={(match, { pathname }) =>
                Boolean(match) ||
                pathname.startsWith('/add') ||
                pathname.startsWith('/remove') ||
                pathname.startsWith('/create') ||
                pathname.startsWith('/find')
              }
            >
              {t('pool')}
            </StyledNavLink>
            <StyledNavLink id={`stake-nav-link`} to={'/staking'}>
              Staking
            </StyledNavLink>
            <StyledNavLink id={`xfate-nav-link`} to={`${'/xFATE'}`}>
              xFATE
            </StyledNavLink>
            {/*<StyledNavLink id={`vote-nav-link`} to={`${'/vote'}`}>*/}
            {/*  Vote*/}
            {/*</StyledNavLink>*/}
            <StyledNavLink id={`migrate-nav-link`} to={`/migrate`}>
              Migrate
            </StyledNavLink>
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
            <StyledMenuButton onClick={() => setShowUniBalanceModal(true)} style={{ width: '100px' }}>
              {govToken?.symbol} INFO
            </StyledMenuButton>
          </HeaderElementWrap>
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <StyledMenuButton onClick={() => toggleDarkMode()}>
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
          </StyledMenuButton>
          <Menu />
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}

import React, { useRef } from 'react'
import { Book, Code, PieChart } from 'react-feather'
import styled from 'styled-components'
import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { useActiveWeb3React } from '../../hooks'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { useLocation } from 'react-router-dom'

import { ExternalLink } from '../../theme'
import { ButtonPrimary } from '../Button'

import useGovernanceToken from '../../hooks/useGovernanceToken'
import useBlockchain from '../../hooks/useBlockchain'
import { Blockchain } from '@fatex-dao/sdk'
import TelegramLogo from '../../assets/images/telegram-logo.svg'
import TwitterLogo from '../../assets/images/twitter-logo.svg'
import DiscordLogo from '../../assets/images/discord-logo.svg'
import YouTubeLogo from '../../assets/images/youtube-logo.svg'
import RedditLogo from '../../assets/images/reddit-logo.svg'
import MediumLogo from '../../assets/images/medium-logo.svg'
import DiscourseLogo from '../../assets/images/discourse-logo.svg'
import LinkedinLogo from '../../assets/images/linkedin-logo.svg'
import Checkmark from '../../assets/images/checkmark-icon.svg'

const StyledMenuIcon = styled(MenuIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  height: 41px;
  cursor: pointer;
  padding: 0.15rem 0.5rem;
  border-radius: 8px;
  border: 3px solid ${({ theme }) => theme.text1};
  background-color: inherit;/*${({ theme }) => theme.bg1};*/
  color: ${({ theme }) => theme.text1};

  :hover {
    color: ${({ theme }) => theme.text6}
    background-color: ${({ theme }) => theme.bg6};
    
    svg {
      filter: invert(1)
    }
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMenuMobile = styled.div<{ isStaking: boolean }>`
  margin-left: 0.5rem;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
  display: none;

  ${({ theme, isStaking }) =>
    isStaking
      ? `
    @media screen and (max-width: 1250px) {
      display: flex;
    }
  `
      : theme.mediaWidth.upToMedium`
    display: flex;
  `};
`

const MenuFlyout = styled.span`
  min-width: 13rem;
  background-color: ${({ theme }) => theme.bg2};
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.01), 0 4px 8px rgba(0, 0, 0, 0.04), 0 16px 24px rgba(0, 0, 0, 0.04),
    0 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 4rem;
  right: 0rem;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: -17.25rem;
  `};
`

const StyledMenuDesktop = styled.div<{ isStaking: boolean }>`
  margin-left: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: right;
  align-items: flex-end;
  border: none;
  text-align: right;
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: fit-content;

  a {
    text-align: right;
    text-decoration: none;
  }

  ${({ theme, isStaking }) =>
    isStaking
      ? `
    @media screen and (max-width: 1250px) {
      display: none;
    }
  `
      : theme.mediaWidth.upToMedium`
    display: none;
  `};
`

const MenuItem = styled(ExternalLink)`
  flex: 1;
  width: fit-content;
  justify-content: right;
  align-items: flex-end;
  text-align: right;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
  > svg {
    margin-right: 8px;
  }
  img {
    filter: invert(1);
    opacity: 0.6;
    margin-right: 8px;
    width: 14px;
  }
`

const SocialLinks = styled.div`
  margin-top: 10px;

  a {
    display: inline-block;
    margin: 5px;

    img,
    svg {
      filter: invert(1);
      width: 20px;
      opacity: 0.6;

      :hover {
        opacity: 1;
      }
    }
  }
`

export default function Menu() {
  const { account } = useActiveWeb3React()
  const blockchain = useBlockchain()
  const govToken = useGovernanceToken()

  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  useOnClickOutside(node, open ? toggle : undefined)
  const openClaimModal = useToggleModal(ApplicationModal.ADDRESS_CLAIM)

  const location = useLocation()
  const isStaking = location.pathname === '/staking'

  return (
    <>
      {/* https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451*/}
      <StyledMenuDesktop ref={node as any} isStaking={isStaking}>
        {/*<MenuItem id="link" href={'https://fatex.io'}>
          FATEx.io
        </MenuItem>*/}
        <MenuItem id="link" href={'https://github.com/FATEx-DAO'}>
          <Code size={14} />
          Code
        </MenuItem>
        <MenuItem id="link" href={'https://gov.daodiscourse.fatex.io/categories'}>
          <img src={DiscourseLogo} />
          DAO Forum
        </MenuItem>
        <MenuItem id="link" href={'https://gov.harmony.one/#/fatexdao'}>
          <img src={Checkmark} />
          DAO Voting
        </MenuItem>
        <MenuItem id="link" href={'https://fatexdao.gitbook.io/fatexdao'}>
          <Book size={14} />
          Green Paper
        </MenuItem>
        {blockchain === Blockchain.HARMONY && (
          <MenuItem id="link" href="https://info.fatex.io">
            <PieChart size={14} />
            DEX Analytics
          </MenuItem>
        )}
        <SocialLinks>
          <a href={'https://www.twitter.com/FATExDAO'} target={'_blank'} rel="noreferrer">
            <img src={TwitterLogo} alt={'twitter logo'} />
          </a>
          <a href={'https://www.reddit.com/r/FATEx'} target={'_blank'} rel="noreferrer">
            <img src={RedditLogo} alt={'reddit logo'} />
          </a>
          <a href={'https://fatexdao.medium.com'} target={'_blank'} rel="noreferrer">
            <img src={MediumLogo} alt={'medium logo'} />
          </a>
          <a href={'https://t.me/FATExDAO'} target={'_blank'} rel="noreferrer">
            <img src={TelegramLogo} alt={'telegram logo'} />
          </a>
          <a href={'https://discord.gg/uA6xrmsRfu'} target={'_blank'} rel="noreferrer">
            <img src={DiscordLogo} alt={'discord logo'} />
          </a>
          <a href={'https://youtube.com/channel/UCvD3ItDf063xc_I4412wXCg'} target={'_blank'} rel="noreferrer">
            <img src={YouTubeLogo} alt={'youtube logo'} />
          </a>
          <a href={'https://www.linkedin.com/company/fatexdao'} target={'_blank'} rel="noreferrer">
            <img src={LinkedinLogo} alt={'linkedin logo'} />
          </a>
        </SocialLinks>
        {account && blockchain === Blockchain.ETHEREUM && (
          <ButtonPrimary onClick={openClaimModal} padding="8px 16px" width="100%" borderRadius="12px" mt="0.5rem">
            Claim {govToken?.symbol}
          </ButtonPrimary>
        )}
      </StyledMenuDesktop>
      <StyledMenuMobile ref={node as any} isStaking={isStaking}>
        <StyledMenuButton onClick={toggle}>
          <StyledMenuIcon />
        </StyledMenuButton>

        {open && (
          <MenuFlyout>
            {/*<MenuItem id="link" href={'https://fatex.io'}>
              FATEx.io
            </MenuItem>*/}
            <MenuItem id="link" href={'https://github.com/FATEx-DAO'}>
              <Code size={14} />
              Code
            </MenuItem>
            <MenuItem id="link" href={'https://gov.daodiscourse.fatex.io/categories'}>
              <img src={DiscourseLogo} />
              DAO Forum
            </MenuItem>
            <MenuItem id="link" href={'https://gov.harmony.one/#/fatexdao'}>
              <img src={Checkmark} />
              DAO Voting
            </MenuItem>
            <MenuItem id="link" href={'https://fatexdao.gitbook.io/fatexdao'}>
              <Book size={14} />
              Green Paper
            </MenuItem>
            {blockchain === Blockchain.HARMONY && (
              <MenuItem id="link" href="https://info.fatex.io">
                <PieChart size={14} />
                DEX Analytics
              </MenuItem>
            )}
            <SocialLinks>
              <a href={'https://www.twitter.com/FATExDAO'} target={'_blank'} rel="noreferrer">
                <img src={TwitterLogo} alt={'twitter logo'} />
              </a>
              <a href={'https://www.reddit.com/r/FATEx'} target={'_blank'} rel="noreferrer">
                <img src={RedditLogo} alt={'reddit logo'} />
              </a>
              <a href={'https://fatexdao.medium.com'} target={'_blank'} rel="noreferrer">
                <img src={MediumLogo} alt={'medium logo'} />
              </a>
              <a href={'https://t.me/FATExDAO'} target={'_blank'} rel="noreferrer">
                <img src={TelegramLogo} alt={'telegram logo'} />
              </a>
              <a href={'https://discord.gg/uA6xrmsRfu'} target={'_blank'} rel="noreferrer">
                <img src={DiscordLogo} alt={'discord logo'} />
              </a>
              <a href={'https://youtube.com/channel/UCvD3ItDf063xc_I4412wXCg'} target={'_blank'} rel="noreferrer">
                <img src={YouTubeLogo} alt={'youtube logo'} />
              </a>
              <a href={'https://www.linkedin.com/company/fatexdao'} target={'_blank'} rel="noreferrer">
                <img src={LinkedinLogo} alt={'linkedin logo'} />
              </a>
            </SocialLinks>
            {account && blockchain === Blockchain.ETHEREUM && (
              <ButtonPrimary onClick={openClaimModal} padding="8px 16px" width="100%" borderRadius="12px" mt="0.5rem">
                Claim {govToken?.symbol}
              </ButtonPrimary>
            )}
          </MenuFlyout>
        )}
      </StyledMenuMobile>
    </>
  )
}

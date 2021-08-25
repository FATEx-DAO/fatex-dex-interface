import React, { useRef } from 'react'
import { Send, Code, MessageSquare, PieChart, Book } from 'react-feather'
import styled from 'styled-components'
import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { useActiveWeb3React } from '../../hooks'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'

import { ExternalLink } from '../../theme'
import { ButtonPrimary } from '../Button'

import useGovernanceToken from '../../hooks/useGovernanceToken'
import useBlockchain from '../../hooks/useBlockchain'
import { Blockchain, ChainId } from '@fatex-dao/sdk'

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

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 10rem;
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

const MenuItem = styled(ExternalLink)`
  flex: 1;
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
`

export default function Menu() {
  const { account, chainId } = useActiveWeb3React()
  const blockchain = useBlockchain()
  const govToken = useGovernanceToken()

  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  useOnClickOutside(node, open ? toggle : undefined)
  const openClaimModal = useToggleModal(ApplicationModal.ADDRESS_CLAIM)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        <StyledMenuIcon />
      </StyledMenuButton>

      {open && (
        <MenuFlyout>
          {chainId == ChainId.HARMONY_MAINNET && (
            <MenuItem id="link" href="https://info.fatex.io">
              <PieChart size={14} />
              Analytics
            </MenuItem>
          )}
          <MenuItem id="link" href="https://discord.com/invite/22CXCEPB3E">
            <MessageSquare size={14} />
            Discord
          </MenuItem>
          <MenuItem id="link" href="https://t.me/FATExDAO">
            <Send size={14} />
            Telegram
          </MenuItem>
          <MenuItem id="link" href={'https://fatexdao.gitbook.io/fatexdao/'}>
            <Book size={14} />
            FAQ
          </MenuItem>
          <MenuItem id="link" href={'https://github.com/FATEx-DAO'}>
            <Code size={14} />
            Code
          </MenuItem>
          {account && blockchain === Blockchain.ETHEREUM && (
            <ButtonPrimary onClick={openClaimModal} padding="8px 16px" width="100%" borderRadius="12px" mt="0.5rem">
              Claim {govToken?.symbol}
            </ButtonPrimary>
          )}
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}

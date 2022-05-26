import React from 'react'
import styled from 'styled-components'

import { AlertTriangle, X } from 'react-feather'

const PhishAlert = styled.div<{ isActive: any }>`
  width: 100%;
  padding: 6px 6px;
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
  font-size: 11px;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
`

export const StyledClose = styled(X)`
  :hover {
    cursor: pointer;
  }
`

export default function URLWarning() {
  // const { chainId } = useActiveWeb3React()
  // const webInterfaces = chainId && WEB_INTERFACES[chainId]
  // const defaultHostname = webInterfaces?.[0]
  // const currentHostname = window.location.hostname
  // const showURLWarning = currentHostname === 'old.app.fatex.io' || currentHostname === 'fatex-dao-old.web.app'
  const showURLWarning = true

  return (
    <PhishAlert isActive={showURLWarning}>
      <div style={{ display: 'flex' }}>
        <AlertTriangle style={{ marginRight: 6 }} size={12} />
        NOTICE: This DAPP is &quot;LIVE&quot; BUT FATE REWARDS HAVE NOT STARTED & THERE IS NO CIRCULATING SUPPLY. Users
        may create LPs to prepare for when FATE supply is deployed & the DAO’s treasury provides sufficient liquidity to
        swap FATE, MATIC and USDC. CLICK ON: DAO LINKS TO KEEP UP-TO-DATE on the FATExFi Launch.
      </div>
    </PhishAlert>
  )
}

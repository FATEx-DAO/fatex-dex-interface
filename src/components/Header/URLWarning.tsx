import React, { useMemo } from 'react'
import styled from 'styled-components'

import { X } from 'react-feather'
import useCurrentBlockTimestamp from '../../hooks/useCurrentBlockTimestamp'

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
  const blockTimestamp = useCurrentBlockTimestamp()?.toNumber() ?? Math.floor(new Date().getTime() / 1000)
  const showURLWarning = useMemo(() => blockTimestamp < 1654142400, [blockTimestamp])

  return (
    <PhishAlert isActive={showURLWarning}>
      <div style={{ display: 'flex' }}>
        This DAPP is &quot;LIVE.&quot; THERE IS NO CIRCULATING FATE. DAO Treasury will provide liquidity for FATE:USDC
        LP +/-24 hours before FATE rewards start-time: June 1, 2022 8PM (UTC-4 EDT) for users to create LPs/buy FATE.
        CLICK ON: DAO LINKS FOR UP-TO-DATE FATExFi launch FAQ.
      </div>
    </PhishAlert>
  )
}

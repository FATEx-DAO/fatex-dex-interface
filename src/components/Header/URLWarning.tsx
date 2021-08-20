import React from 'react'
import styled from 'styled-components'

import { AlertTriangle, X } from 'react-feather'
import { useURLWarningToggle, useURLWarningVisible } from '../../state/user/hooks'
import { isMobile } from 'react-device-detect'
import { useActiveWeb3React } from '../../hooks'
import { WEB_INTERFACES } from '../../constants'

const PhishAlert = styled.div<{ isActive: any }>`
  width: 100%;
  padding: 6px 6px;
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
  font-size: 11px;
  justify-content: space-between;
  align-items: center;
  display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
`

export const StyledClose = styled(X)`
  :hover {
    cursor: pointer;
  }
`

export default function URLWarning() {
  const toggleURLWarning = useURLWarningToggle()
  const showURLWarning = useURLWarningVisible()
  const { chainId } = useActiveWeb3React()
  const webInterfaces = chainId && WEB_INTERFACES[chainId]
  const defaultHostname = webInterfaces?.[0]
  const currentHostname = window.location.hostname

  return isMobile ? (
    <PhishAlert isActive={showURLWarning}>
      <div style={{ display: 'flex' }}>
        <AlertTriangle style={{ marginRight: 6 }} size={12} /> Make sure the URL is
        <code style={{ padding: '0 4px', display: 'inline', fontWeight: 'bold' }}>{defaultHostname}</code>
      </div>
      <StyledClose size={12} onClick={toggleURLWarning} />
    </PhishAlert>
  ) : webInterfaces?.includes(currentHostname) ? (
    <PhishAlert isActive={showURLWarning}>
      <div style={{ display: 'flex' }}>
        <AlertTriangle style={{ marginRight: 6 }} size={12} /> Always make sure the URL is
        <code style={{ padding: '0 4px', display: 'inline', fontWeight: 'bold' }}>{defaultHostname}</code> - bookmark it
        to be safe.
      </div>
      <StyledClose size={12} onClick={toggleURLWarning} />
    </PhishAlert>
  ) : null
}

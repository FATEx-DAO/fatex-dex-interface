import React from 'react'
import styled from 'styled-components'

import { AlertTriangle, X } from 'react-feather'
import { ExternalLink } from '../../theme'

const PhishAlert = styled.div<{ isActive: any }>`
  width: 100%;
  padding: 6px 6px;
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
  font-size: 11px;
  justify-content: space-between;
  align-items: center;
  height: 84px;
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
        <ExternalLink
          href={
            'https://fatexdao.gitbook.io/fatexdao/fatexdao-dapps-and-tokens/harmony-greater-than-matic-reissue/fateh-holder-options'
          }
          style={{ fontWeight: 'bold' }}
        >
          FATExDAO is moving to MATIC & deploying FATExFi. Any member who owns FATE(h) rewarded here (on HARMONY ONE)
          has had 2 options: an automatic airdrop, and/or to apply for a limited, &quot;fair,&quot; FATExFi pre-launch
          swap. The DAO created these to ensure value for FATE(h) holders increases.
        </ExternalLink>
      </div>
    </PhishAlert>
  )
}

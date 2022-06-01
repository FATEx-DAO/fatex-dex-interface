import React from 'react'
import styled from 'styled-components'
import Settings from '../Settings'
import { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import { LightQuestionHelper } from '../QuestionHelper'

const StyledSwapHeader = styled.div`
  padding: 12px 1rem 0px 1.5rem;
  margin-bottom: -4px;
  width: 100%;
  max-width: 420px;
  color: ${({ theme }) => theme.text2};
`

export default function SwapHeader() {
  return (
    <StyledSwapHeader>
      <RowBetween>
        <TYPE.black fontWeight={500} fontSize={20}>
          Swap
          <LightQuestionHelper
            text={
              <span>
                NOTE: FATExFi is not a traditional &quot;dex&quot;. It is a liquidity pooling protocol for members to
                contribute capital and join via acquiring the DAO governance token &quot;FATE,&quot; which allows a
                member to participate in the development of web 3.0 FinTch applications i.e. FxD. Please read the V2 FAQ
                for details.
              </span>
            }
            lightBulb={true}
          />
        </TYPE.black>
        <Settings />
      </RowBetween>
    </StyledSwapHeader>
  )
}

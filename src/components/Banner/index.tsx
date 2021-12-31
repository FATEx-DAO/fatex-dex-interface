import React, { useState } from 'react'
import { Box } from 'rebass/styled-components'

import styled from 'styled-components'
import { ReactComponent as Close } from '../../assets/images/x.svg'

const StyledBox = styled(Box)<{ display?: string; color?: string; backgroundColor?: string }>`
  display: ${({ display }) => display};
  color: ${({ color, theme }) => color ?? theme.text1};
  background-color: ${({ backgroundColor, theme }) => backgroundColor ?? theme.green1};
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
`

const CloseIcon = styled.div`
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

export default function Banner({
  text,
  color,
  backgroundColor
}: {
  text: string
  color?: string
  backgroundColor?: string
}) {
  const [displayed, setDisplayed] = useState<boolean>(true)

  return (
    <StyledBox display={displayed ? 'flex' : 'none'} color={color} backgroundColor={backgroundColor}>
      {text}
      <CloseIcon onClick={() => setDisplayed(!displayed)}>
        <CloseColor />
      </CloseIcon>
    </StyledBox>
  )
}

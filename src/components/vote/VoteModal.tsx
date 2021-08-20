import React, { useState, useContext } from 'react'
import { useActiveWeb3React } from '../../hooks'

import Modal from '../Modal'
import { AutoColumn, ColumnCenter } from '../Column'
import styled, { ThemeContext } from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CustomLightSpinner, CloseIcon } from '../../theme'
import { X, ArrowUpCircle } from 'react-feather'
import { ButtonPrimary } from '../Button'
import Circle from '../../assets/images/blue-loader.svg'
import { useVoteCallback, useUserVotes } from '../../state/governance/hooks'
import { getEtherscanLink } from '../../utils'
import { ExternalLink } from '../../theme/components'
import { TokenAmount } from '@fatex-dao/sdk'

import useBlockchain from '../../hooks/useBlockchain'
import getExplorerName from '../../utils/getExplorerName'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 24px;
`

const StyledClosed = styled(X)`
  :hover {
    cursor: pointer;
  }
`

const ConfirmOrLoadingWrapper = styled.div`
  width: 100%;
  padding: 24px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

interface VoteModalProps {
  isOpen: boolean
  onDismiss: () => void
  support: boolean // if user is for or against proposal
  proposalId: string | undefined // id for the proposal to vote on
}

export default function VoteModal({ isOpen, onDismiss, proposalId, support }: VoteModalProps) {
  const { chainId } = useActiveWeb3React()
  const {
    voteCallback
  }: {
    voteCallback: (proposalId: string | undefined, support: boolean) => Promise<string> | undefined
  } = useVoteCallback()
  const availableVotes: TokenAmount | undefined = useUserVotes()

  const blockchain = useBlockchain()
  const explorerName = getExplorerName(blockchain)

  // monitor call to help UI loading state
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState<boolean>(false)
  const [failed, setFailed] = useState<boolean>(false)

  // get theme for colors
  const theme = useContext(ThemeContext)

  // wrapper to reset state on modal close
  function wrappedOnDismiss() {
    setHash(undefined)
    setAttempting(false)
    setFailed(false)
    onDismiss()
  }

  async function onVote() {
    setAttempting(true)

    // if callback not returned properly ignore
    if (!voteCallback) return

    // try delegation and store hash
    const hash = await voteCallback(proposalId, support)?.catch(error => {
      setAttempting(false)
      if (error?.code === -32603) {
        setFailed(true)
      }
      console.log(error)
    })

    if (hash) {
      setHash(hash)
    }
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      {!attempting && !hash && !failed && (
        <ContentWrapper gap="lg">
          <AutoColumn gap="lg" justify="center">
            <RowBetween>
              <TYPE.mediumHeader fontWeight={500}>{`Vote ${
                support ? 'for ' : 'against'
              } proposal ${proposalId}`}</TYPE.mediumHeader>
              <StyledClosed stroke="black" onClick={wrappedOnDismiss} />
            </RowBetween>
            <TYPE.largeHeader>{availableVotes?.toSignificant(4)} Votes</TYPE.largeHeader>
            <ButtonPrimary onClick={onVote}>
              <TYPE.mediumHeader color="white">{`Vote ${
                support ? 'for ' : 'against'
              } proposal  ${proposalId}`}</TYPE.mediumHeader>
            </ButtonPrimary>
          </AutoColumn>
        </ContentWrapper>
      )}
      {attempting && !hash && !failed && (
        <ConfirmOrLoadingWrapper>
          <RowBetween>
            <div />
            <StyledClosed onClick={wrappedOnDismiss} />
          </RowBetween>
          <ConfirmedIcon>
            <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
          </ConfirmedIcon>
          <AutoColumn gap="100px" justify={'center'}>
            <AutoColumn gap="12px" justify={'center'}>
              <TYPE.largeHeader>Submitting Vote</TYPE.largeHeader>
            </AutoColumn>
            <TYPE.subHeader>Confirm this transaction in your wallet</TYPE.subHeader>
          </AutoColumn>
        </ConfirmOrLoadingWrapper>
      )}
      {hash && !failed && (
        <ConfirmOrLoadingWrapper>
          <RowBetween>
            <div />
            <StyledClosed onClick={wrappedOnDismiss} />
          </RowBetween>
          <ConfirmedIcon>
            <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary1} />
          </ConfirmedIcon>
          <AutoColumn gap="100px" justify={'center'}>
            <AutoColumn gap="12px" justify={'center'}>
              <TYPE.largeHeader>Transaction Submitted</TYPE.largeHeader>
            </AutoColumn>
            {chainId && (
              <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')} style={{ marginLeft: '4px' }}>
                <TYPE.subHeader>View transaction on {explorerName}</TYPE.subHeader>
              </ExternalLink>
            )}
          </AutoColumn>
        </ConfirmOrLoadingWrapper>
      )}
      {!attempting && !hash && failed && (
        <ContentWrapper gap="sm">
          <RowBetween>
            <TYPE.mediumHeader>
              <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                ⚠️
              </span>
              Error!
            </TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOnDismiss} />
          </RowBetween>
          <TYPE.subHeader style={{ textAlign: 'center' }}>
            Your transaction couldn&apos;t be submitted.
            <br />
            You may have to increase your Gas Price (GWEI) settings!
          </TYPE.subHeader>
        </ContentWrapper>
      )}
    </Modal>
  )
}

import React, { useState, useMemo } from 'react'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonError } from '../Button'
import { useFeeTokenConverterToFateContract } from '../../hooks/useContract'
import { SubmittedView, LoadingView } from '../ModalViews'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useActiveWeb3React } from '../../hooks'
import { calculateGasMargin } from '../../utils'
import { useMultipleContractSingleData } from '../../state/multicall/hooks'
import { useTrackedTokenPairs } from '../../state/user/hooks'
import { X_FATE_SETTINGS } from '../../constants'
import useGovernanceToken from '../../hooks/useGovernanceToken'
import useEligibleXFatePools from '../../hooks/useEligibleXFatePools'
import { usePairs } from '../../data/Reserves'
import ERC20_INTERFACE from '../../constants/abis/erc20'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;

  button {
    background: ${({ theme }) => theme.bg2};

    :hover {
      color: ${({ theme }) => theme.bg2};
    }
  }
`
interface ClaimModalProps {
  isOpen: boolean
  onDismiss: () => void
}

export default function ClaimModal({ isOpen, onDismiss }: ClaimModalProps) {
  const { account, chainId } = useActiveWeb3React()

  const govToken = useGovernanceToken()
  const xFateSettings = chainId ? X_FATE_SETTINGS[chainId] : undefined

  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState(false)
  const [failed, setFailed] = useState<boolean>(false)

  function wrappedOnDismiss() {
    setHash(undefined)
    setAttempting(false)
    setFailed(false)
    onDismiss()
  }

  const feeTokenConverterToFate = useFeeTokenConverterToFateContract()
  const trackedPairs = useTrackedTokenPairs()
  const pairsWithState = usePairs(trackedPairs)
  const pairs = useMemo(() => {
    return pairsWithState.map(([, pair]) => pair).filter(pair => !!pair)
  }, [pairsWithState])

  const liquidityTokenAddresses = useMemo(() => {
    return pairs.map(pair => pair?.liquidityToken.address).filter(address => !!address)
  }, [pairs])

  const balanceResults = useMultipleContractSingleData(liquidityTokenAddresses, ERC20_INTERFACE, 'balanceOf', [
    feeTokenConverterToFate?.address
  ])

  const [token0s, token1s] = useEligibleXFatePools(pairs, balanceResults)

  const rewardsAreClaimable = token0s.length > 0 && token1s.length > 0

  async function onClaimRewards() {
    if (feeTokenConverterToFate) {
      setAttempting(true)

      try {
        const estimatedGas = await feeTokenConverterToFate.estimateGas.convertMultiple(token0s, token1s)

        await feeTokenConverterToFate
          .convertMultiple(token0s, token1s, {
            gasLimit: calculateGasMargin(estimatedGas)
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: `Convert ${xFateSettings?.name} rewards`
            })
            setHash(response.hash)
          })
          .catch((error: any) => {
            setAttempting(false)
            if (error?.code === -32603) {
              setFailed(true)
            }
            console.log(error)
          })
      } catch (error) {
        setAttempting(false)
        setFailed(true)
        console.log(error)
      }
    }
  }

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      {!attempting && !hash && !failed && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <TYPE.mediumHeader> Claim</TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOnDismiss} />
          </RowBetween>
          <TYPE.body fontSize={32} style={{ textAlign: 'center' }}>
            <span role="img" aria-label="wizard-icon" style={{ marginRight: '8px' }}>
              💎
            </span>
          </TYPE.body>
          {rewardsAreClaimable && (
            <>
              <TYPE.body fontSize={14} style={{ textAlign: 'center' }}>
                When you claim rewards, collected LP fees will be used to market buy {govToken?.symbol}.
                <br />
                <br />
                The purchased {govToken?.symbol} tokens will then be distributed to the {xFateSettings?.name} stakers as
                a reward.
              </TYPE.body>
              <ButtonError disabled={!!error} error={!!error} onClick={onClaimRewards}>
                {error ?? 'Claim'}
              </ButtonError>
            </>
          )}
          {!rewardsAreClaimable && (
            <TYPE.body fontSize={14} style={{ textAlign: 'center' }}>
              There are no trading fee rewards available
              <br />
              to claim right now.
              <br />
              <br />
              Please wait a little bit and then check back here again.
            </TYPE.body>
          )}
        </ContentWrapper>
      )}
      {attempting && !hash && !failed && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.body fontSize={20}>Claiming {xFateSettings?.name} rewards</TYPE.body>
          </AutoColumn>
        </LoadingView>
      )}
      {hash && !failed && (
        <SubmittedView onDismiss={wrappedOnDismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>Transaction Submitted</TYPE.largeHeader>
            <TYPE.body fontSize={20}>Claimed {govToken?.symbol}!</TYPE.body>
          </AutoColumn>
        </SubmittedView>
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

import React, { useMemo, useState } from 'react'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonError } from '../Button'
import { StakingInfo } from '../../state/stake/hooks'
import { useFateRewardController } from '../../hooks/useContract'
import { SubmittedView, LoadingView } from '../ModalViews'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useActiveWeb3React } from '../../hooks'
import { calculateGasMargin } from '../../utils'
import useGovernanceToken from '../../hooks/useGovernanceToken'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { Fraction } from '@fatex-dao/sdk'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: StakingInfo
}

export default function ClaimRewardModal({ isOpen, onDismiss, stakingInfo }: StakingModalProps) {
  const { account } = useActiveWeb3React()

  const govToken = useGovernanceToken()
  const fateRewardController = useFateRewardController()

  const percentInputs = useMemo(() => [stakingInfo?.pid, account], [account, stakingInfo])
  const rewardFeePercentResult = useSingleCallResult(fateRewardController, 'getLockedRewardsFeePercent', percentInputs)

  const rewardFeePercent = rewardFeePercentResult.result?.[0]
    ? new Fraction(rewardFeePercentResult.result?.[0].toString(), '10000')
    : undefined
  const totalRewardAmount =
    rewardFeePercent && rewardFeePercent.lessThan('1') && stakingInfo.earnedAmount
      ? stakingInfo.earnedAmount.multiply(new Fraction('1').subtract(rewardFeePercent).invert())
      : undefined

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

  async function onClaimReward() {
    if (fateRewardController && stakingInfo?.stakedAmount) {
      setAttempting(true)

      const estimatedGas = await fateRewardController.estimateGas.claimReward(stakingInfo.pid)

      await fateRewardController
        .claimReward(stakingInfo.pid, {
          gasLimit: calculateGasMargin(estimatedGas)
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Claim accumulated ${govToken?.symbol} rewards`
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
    }
  }

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }
  if (!stakingInfo?.stakedAmount) {
    error = error ?? 'Enter an amount'
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      {!attempting && !hash && !failed && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <TYPE.mediumHeader>Claim</TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOnDismiss} />
          </RowBetween>
          {stakingInfo?.earnedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.link fontWeight={400} color={'text1'}>
                Your reward fees are currently:
                <br />
                {totalRewardAmount?.multiply(rewardFeePercent).toSignificant(8) ?? '-'} {govToken.symbol} (
                {(rewardFeePercent ?? new Fraction('1')).multiply('100').toFixed(2)}%)
              </TYPE.link>
              <TYPE.body fontWeight={600} fontSize={36}>
                {stakingInfo?.earnedAmount?.toSignificant(6)}
              </TYPE.body>
              <TYPE.body>Unclaimed {govToken?.symbol} you will receive</TYPE.body>
            </AutoColumn>
          )}
          <ButtonError disabled={!!error} error={!!error && !!stakingInfo?.stakedAmount} onClick={onClaimReward}>
            {error ?? 'Claim'}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !hash && !failed && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.body fontSize={20}>
              Claiming {stakingInfo?.earnedAmount?.toSignificant(6)} {govToken?.symbol}
            </TYPE.body>
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

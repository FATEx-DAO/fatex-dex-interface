import React, { useState, useCallback, useMemo } from 'react'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon, ExternalLink } from '../../theme'
import { ButtonError } from '../Button'
import CurrencyInputPanel from '../CurrencyInputPanel'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { TokenAmount, Pair, Fraction } from '@fatex-dao/sdk'
import { StakingInfo, useDerivedUnstakeInfo } from '../../state/stake/hooks'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { LoadingView, SubmittedView } from '../ModalViews'
import { BlueCard } from '../Card'
import { ColumnCenter } from '../Column'
import { calculateGasMargin } from '../../utils'
import { useFateRewardController } from '../../hooks/useContract'
import { FEES_URL } from '../../constants'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { useActiveWeb3React } from '../../hooks'
import Loader from '../Loader'
import useGovernanceToken from '../../hooks/useGovernanceToken'
import useBUSDPrice from '../../hooks/useBUSDPrice'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

// const Separator = styled.div`
//   width: 100%;
//   height: 1px;
//   background-color: ${({ theme }) => theme.bg2};
//   margin: 10px 0;
// `
//
// const WithdrawalFee = styled.div`
//   margin: 10px 0 0 0;
//   text-align: center;
//   font-size: 40px;
// `

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: StakingInfo
}

export default function ModifiedStakingModal({ isOpen, onDismiss, stakingInfo }: StakingModalProps) {
  // track and parse user input
  const { account } = useActiveWeb3React()
  const fateRewardController = useFateRewardController()
  const govToken = useGovernanceToken()
  const [typedValue, setTypedValue] = useState('')
  const { parsedAmount, error } = useDerivedUnstakeInfo(typedValue, stakingInfo.stakedAmount)

  const methodInputs = useMemo(() => [stakingInfo?.pid, account], [account, stakingInfo])
  const rewardFeePercentResult = useSingleCallResult(fateRewardController, 'getLockedRewardsFeePercent', methodInputs)
  const lpFeePercentResult = useSingleCallResult(fateRewardController, 'getLPWithdrawFeePercent', methodInputs)

  const rewardFeePercentLoading = rewardFeePercentResult.loading
  const rewardFeePercent: Fraction | undefined = rewardFeePercentResult.result?.[0]
    ? new Fraction(rewardFeePercentResult.result?.[0].toString(), '10000')
    : undefined
  const totalRewardAmount =
    rewardFeePercent && rewardFeePercent.lessThan('1') && stakingInfo.earnedAmount
      ? stakingInfo.earnedAmount.multiply(new Fraction('1').subtract(rewardFeePercent).invert())
      : undefined
  const govTokenPrice = useBUSDPrice(govToken)
  // const govTokenPrice = new Fraction('10', '100') // $0.10

  const lpFeePercentLoading = lpFeePercentResult.loading
  const lpFeePercent: Fraction | undefined = lpFeePercentResult.result?.[0]
    ? new Fraction(lpFeePercentResult.result?.[0].toString(), '10000')
    : undefined
  const lpFeeAmount = parsedAmount && lpFeePercent ? parsedAmount.multiply(lpFeePercent) : undefined

  // state for pending and submitted txn views
  const addTransaction = useTransactionAdder()
  const [attempting, setAttempting] = useState<boolean>(false)
  const [hash, setHash] = useState<string | undefined>()
  const [failed, setFailed] = useState<boolean>(false)
  const wrappedOnDismiss = useCallback(() => {
    setHash(undefined)
    setAttempting(false)
    setFailed(false)
    onDismiss()
  }, [onDismiss])

  // pair contract for this token to be staked
  const dummyPair = new Pair(new TokenAmount(stakingInfo.tokens[0], '0'), new TokenAmount(stakingInfo.tokens[1], '0'))

  async function onWithdraw() {
    if (fateRewardController && stakingInfo?.stakedAmount) {
      setAttempting(true)

      const formattedAmount = `0x${parsedAmount?.raw.toString(16)}`
      const estimatedGas = await fateRewardController.estimateGas.withdraw(stakingInfo.pid, formattedAmount)

      await fateRewardController
        .withdraw(stakingInfo.pid, formattedAmount, {
          gasLimit: calculateGasMargin(estimatedGas)
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Withdraw deposited liquidity`
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

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback((typedValue: string) => {
    setTypedValue(typedValue)
  }, [])

  // used for max input button
  const maxAmountInput = maxAmountSpend(stakingInfo.stakedAmount)
  const atMaxAmount = Boolean(maxAmountInput && parsedAmount?.equalTo(maxAmountInput))

  const handleMax = useCallback(() => {
    maxAmountInput && onUserInput(maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      {!attempting && !hash && !failed && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <TYPE.mediumHeader>Withdraw</TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOnDismiss} />
          </RowBetween>

          <RowBetween>
            <ColumnCenter>
              <BlueCard>
                <AutoColumn gap="10px">
                  <TYPE.link fontWeight={400} color={'text1'}>
                    💡 Fees are charged to discourage short-term yield farming & reward long-term member participation.
                    Learn more{' '}
                    <ExternalLink href={FEES_URL} style={{ textDecoration: 'underline' }}>
                      here
                    </ExternalLink>
                    .
                  </TYPE.link>
                  <TYPE.link fontWeight={400} color={'text1'}>
                    The fees you will be charged if any amount is withdrawn from the staking contract are currently:
                  </TYPE.link>
                  <TYPE.link fontWeight={400} color={'text1'}>
                    1. LP withdrawal fee (paid to xFATE pool):
                    <br />
                    &nbsp;&nbsp;&nbsp;
                    {lpFeePercentLoading ? (
                      <Loader />
                    ) : !lpFeeAmount ? (
                      '-'
                    ) : (
                      lpFeeAmount.toSignificant(8) +
                      ` ${stakingInfo.totalLpTokenSupply.token.symbol} (${lpFeePercent.multiply('100').toFixed(2)}%)`
                    )}
                    <br />
                    <br />
                    2. {govToken.symbol} rewards fee:
                    <br />
                    &nbsp;&nbsp;&nbsp;
                    {rewardFeePercentLoading ? (
                      <Loader />
                    ) : !totalRewardAmount ? (
                      '-'
                    ) : (
                      totalRewardAmount.multiply(rewardFeePercent).toSignificant(8) +
                      ` ${govToken.symbol} (${rewardFeePercent.multiply('100').toFixed(2)}%)`
                    )}
                  </TYPE.link>
                  <TYPE.link fontWeight={400} color={'text1'}>
                    The {stakingInfo.tokens[0].symbol}:{stakingInfo.tokens[1].symbol}-LP you will receive:
                    <br />
                    {!parsedAmount
                      ? '-'
                      : `${parsedAmount.multiply(new Fraction('1').subtract(lpFeePercent)).toSignificant(8)} ${
                          stakingInfo.totalStakedAmount?.token.symbol
                        } ($${stakingInfo.valueOfTotalStakedAmountInUsd
                          .multiply(parsedAmount)
                          .divide(stakingInfo.stakedAmount)
                          .multiply(new Fraction('1').subtract(lpFeePercent))
                          .toFixed(2, { groupSeparator: ',' })})`}
                  </TYPE.link>
                  <TYPE.link fontWeight={400} color={'text1'}>
                    The {govToken.symbol} rewards you will receive:
                    <br />
                    {`${stakingInfo.earnedAmount.toSignificant(8)} ${
                      govToken.symbol
                    } ($${stakingInfo.earnedAmount
                      .multiply(govTokenPrice ?? new Fraction('0'))
                      .toFixed(2, { groupSeparator: ',' })})`}
                  </TYPE.link>
                </AutoColumn>
              </BlueCard>
            </ColumnCenter>
          </RowBetween>

          <CurrencyInputPanel
            value={typedValue}
            onUserInput={onUserInput}
            onMax={handleMax}
            showMaxButton={!atMaxAmount}
            currency={stakingInfo.stakedAmount.token}
            pair={dummyPair}
            label={''}
            disableCurrencySelect={true}
            overrideSelectedCurrencyBalance={stakingInfo.stakedAmount}
            customBalanceText={'Available to withdraw: '}
            id="stake-liquidity-token"
          />

          <RowBetween>
            <ButtonError disabled={!!error} error={!!error && !!parsedAmount} onClick={onWithdraw}>
              {error ?? 'Withdraw'}
            </ButtonError>
          </RowBetween>
        </ContentWrapper>
      )}
      {attempting && !hash && !failed && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>Withdrawing Liquidity</TYPE.largeHeader>
            <TYPE.body fontSize={20}>{parsedAmount?.toSignificant(4)} FATExFI-LP</TYPE.body>
          </AutoColumn>
        </LoadingView>
      )}
      {attempting && hash && !failed && (
        <SubmittedView onDismiss={wrappedOnDismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>Transaction Submitted</TYPE.largeHeader>
            <TYPE.body fontSize={20}>Withdraw {parsedAmount?.toSignificant(4)} FATExFI-LP</TYPE.body>
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

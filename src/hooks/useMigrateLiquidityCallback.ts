import { TransactionResponse } from '@ethersproject/providers'
import { CurrencyAmount, Pair, PairType } from '@fatex-dao/sdk'
import { useCallback } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, calculateSlippageAmount } from '../utils'
import { Contract } from '@ethersproject/contracts'
import useTransactionDeadline from './useTransactionDeadline'
import { useUserSlippageTolerance } from '../state/user/hooks'
import { useDerivedBurnInfo } from '../state/burn/hooks'
import { Field } from '../state/burn/actions'
import { BigNumber } from '@ethersproject/bignumber'

export enum MigrationCallbackState {
  INVALID,
  LOADING,
  VALID
}

function pairTypeToString(pairType: PairType) {
  if (pairType === PairType.FATE) {
    return 'FATEx'
  } else if (pairType === PairType.SUSHI) {
    return 'Sushi'
  } else if (pairType === PairType.VIPER) {
    return 'Viper'
  } else {
    throw new Error('Invalid pairType, found ' + pairType)
  }
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useMigrateLiquidityCallback(
  pair?: Pair,
  pairType?: PairType,
  amount?: CurrencyAmount,
  contract?: Contract
): () => Promise<void> {
  const addTransaction = useTransactionAdder()

  const deadline = useTransactionDeadline()

  const [allowedSlippage] = useUserSlippageTolerance()

  const { parsedAmounts, error: burnInfoError } = useDerivedBurnInfo(pair?.token0, pair?.token1, pairType)

  return useCallback(async (): Promise<void> => {
    if (burnInfoError) {
      console.error('Found error ', burnInfoError)
    }

    if (!pair) {
      console.error('no pair')
      return
    }

    if (!pairType) {
      console.error('no pairType')
      return
    }

    if (!amount) {
      console.error('no token')
      return
    }

    if (!contract) {
      console.error('contract is null')
      return
    }

    const { [Field.CURRENCY_A]: currencyAmount0, [Field.CURRENCY_B]: currencyAmount1 } = parsedAmounts
    if (!currencyAmount0 || !currencyAmount1) {
      console.error('Current amounts are null')
      return
    }

    const currencyAmount0Min = calculateSlippageAmount(currencyAmount0, allowedSlippage)[0]
    const currencyAmount1Min = calculateSlippageAmount(currencyAmount1, allowedSlippage)[0]

    const args = [
      pair.token0.address,
      pair.token1.address,
      amount.raw.toString(),
      currencyAmount0Min.toString(),
      currencyAmount1Min.toString(),
      deadline?.toString() ?? '0'
    ]

    const { estimatedGas, error }: { estimatedGas: BigNumber; error: Error | undefined } = await contract.estimateGas
      .migrate(...args)
      .then(estimatedGas => ({ estimatedGas, error: undefined }))
      .catch(gasError => {
        console.debug('Gas estimate failed, trying eth_call to extract error: ', gasError)
        return contract.callStatic['migrate'](...args).then(result => {
          console.debug('Unexpected successful call after failed estimate gas', result)
          return {
            error: new Error('Unexpected issue with estimating the gas. Please try again.'),
            estimatedGas: BigNumber.from('0')
          }
        })
      })

    if (error) {
      throw error
    }

    return contract['migrate'](...args, { gasLimit: calculateGasMargin(estimatedGas) })
      .then((response: TransactionResponse) => {
        const token0Symbol = pair.token0.symbol
        const token1Symbol = pair.token1.symbol
        addTransaction(response, {
          summary: 'Migrate ' + token0Symbol + '-' + token1Symbol + ' liquidity from ' + pairTypeToString(pairType)
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to migrate LP token', error)
        throw error
      })
  }, [pair, pairType, amount, contract, addTransaction])
}

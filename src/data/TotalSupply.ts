import { BigNumber } from '@ethersproject/bignumber'
import { Token, TokenAmount } from '@fatex-dao/sdk'
import { useTokenContract, useGovTokenContract } from '../hooks/useContract'
import { useMultipleContractSingleData, useSingleCallResult } from '../state/multicall/hooks'
import useGovernanceToken from '../hooks/useGovernanceToken'
import { useMemo } from 'react'
import ERC20_INTERFACE from '../constants/abis/erc20'

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Token): TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false)

  const totalSupply: BigNumber = useSingleCallResult(contract, 'totalSupply')?.result?.[0]

  return token && totalSupply ? new TokenAmount(token, totalSupply.toString()) : undefined
}

export function useTotalSupplies(tokens: (Token | undefined)[]): (TokenAmount | undefined)[] {
  const tokenAddresses = useMemo(() => tokens.map(token => token?.address), [tokens])
  const callStates = useMultipleContractSingleData(tokenAddresses, ERC20_INTERFACE, 'totalSupply', [])

  return useMemo(() => {
    return callStates.map((state, index) => {
      const totalSupply = state.result?.[0]
      const token = tokens[index]
      if (totalSupply && token) {
        return new TokenAmount(token, totalSupply.toString())
      } else {
        return undefined
      }
    })
  }, [callStates, tokens])
}

export function useGovTokenSupply(method = 'totalSupply'): TokenAmount | undefined {
  const contract = useGovTokenContract()
  const value: BigNumber = useSingleCallResult(contract, method)?.result?.[0]
  const token = useGovernanceToken()
  return token && value ? new TokenAmount(token, value.toString()) : undefined
}

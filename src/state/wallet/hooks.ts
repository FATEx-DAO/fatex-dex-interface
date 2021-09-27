import { Currency, CurrencyAmount, JSBI, Token, TokenAmount, DEFAULT_CURRENCIES } from '@fatex-dao/sdk'
import { useMemo } from 'react'
import ERC20_INTERFACE from '../../constants/abis/erc20'
import { useAllTokens } from '../../hooks/Tokens'
import { useActiveWeb3React } from '../../hooks'
import { useMulticallContract, useTokenContract } from '../../hooks/useContract'
import { isAddress } from '../../utils'
import { useSingleContractMultipleData, useMultipleContractSingleData } from '../multicall/hooks'
import { useUserUnclaimedAmount } from '../claim/hooks'
import { useTotalClaimedAndEarnedGovTokens } from '../stake/hooks'
import useGovernanceToken from '../../hooks/useGovernanceToken'

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHBalances(
  uncheckedAddresses?: (string | undefined)[]
): { [address: string]: CurrencyAmount | undefined } {
  const multicallContract = useMulticallContract()

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  )

  const results = useSingleContractMultipleData(
    multicallContract,
    'getEthBalance',
    addresses.map(address => [address])
  )

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0]
        if (value) memo[address] = CurrencyAmount.ether(JSBI.BigInt(value.toString()))
        return memo
      }, {}),
    [addresses, results]
  )
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[],
  method = 'balanceOf',
  tokenInterface = ERC20_INTERFACE
): [{ [tokenAddress: string]: TokenAmount | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens]
  )

  const validatedTokenAddresses = useMemo(() => validatedTokens.map(vt => vt.address), [validatedTokens])

  const balances = useMultipleContractSingleData(validatedTokenAddresses, tokenInterface, method, [address])

  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{ [tokenAddress: string]: TokenAmount | undefined }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0]
              const amount = value ? JSBI.BigInt(value.toString()) : undefined
              if (amount) {
                memo[token.address] = new TokenAmount(token, amount)
              }
              return memo
            }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    anyLoading
  ]
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[],
  method = 'balanceOf',
  tokenInterface = ERC20_INTERFACE
): { [tokenAddress: string]: TokenAmount | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens, method, tokenInterface)[0]
}

export function useAddressesTokenBalanceWithLoadingIndicator(
  addresses?: string[],
  token?: Token,
  method = 'balanceOf'
): [{ [userAddress: string]: TokenAmount | undefined }, boolean] {
  const contract = useTokenContract(token?.address)
  const balances = useSingleContractMultipleData(
    contract,
    method,
    useMemo(() => addresses?.map(address => [address]) ?? [], [addresses])
  )

  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])

  return [
    useMemo(
      () =>
        token && addresses
          ? addresses.reduce<{ [userAddress: string]: TokenAmount | undefined }>((memo, userAddress, i) => {
              const value = balances?.[i]?.result?.[0]
              const amount = value ? JSBI.BigInt(value.toString()) : undefined
              if (amount) {
                memo[userAddress] = new TokenAmount(token, amount)
              }
              return memo
            }, {})
          : {},
      [addresses, token, balances]
    ),
    anyLoading
  ]
}

export function useAddressesTokenBalance(
  addresses?: string[],
  token?: Token,
  method = 'balanceOf'
): { [userAddress: string]: TokenAmount | undefined } {
  return useAddressesTokenBalanceWithLoadingIndicator(addresses, token, method)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(
  account?: string,
  token?: Token,
  method = 'balanceOf',
  tokenInterface = ERC20_INTERFACE
): TokenAmount | undefined {
  const tokenBalances = useTokenBalances(account, [token], method, tokenInterface)
  if (!token) return undefined
  return tokenBalances[token.address]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount | undefined)[] {
  const tokens = useMemo(() => currencies?.filter((currency): currency is Token => currency instanceof Token) ?? [], [
    currencies
  ])

  const tokenBalances = useTokenBalances(account, tokens)
  const containsETH: boolean = useMemo(
    () => currencies?.some(currency => currency && DEFAULT_CURRENCIES.includes(currency)) ?? false,
    [currencies]
  )
  const ethBalance = useETHBalances(containsETH ? [account] : [])

  return useMemo(
    () =>
      currencies?.map(currency => {
        if (!account || !currency) return undefined
        if (currency instanceof Token) return tokenBalances[currency.address]
        if (currency && DEFAULT_CURRENCIES.includes(currency)) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  )
}

export function useCurrencyBalance(account?: string, currency?: Currency): CurrencyAmount | undefined {
  return useCurrencyBalances(account, [currency])[0]
}

// mimics useAllBalances
export function useAllTokenBalances(): { [tokenAddress: string]: TokenAmount | undefined } {
  const { account } = useActiveWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  const balances = useTokenBalances(account ?? undefined, allTokensArray)
  return balances ?? {}
}

// get the total owned, unclaimed, and unharvested UNI for account
export function useAggregateGovTokenBalance(): TokenAmount | undefined {
  const { account } = useActiveWeb3React()

  const govToken = useGovernanceToken()

  const govTokenBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, govToken)
  const govTokenUnclaimed: TokenAmount | undefined = useUserUnclaimedAmount(account)
  const govTokenUnHarvested: TokenAmount | undefined = useTotalClaimedAndEarnedGovTokens()

  if (!govToken) return undefined

  return new TokenAmount(
    govToken,
    JSBI.add(
      JSBI.add(govTokenBalance?.raw ?? JSBI.BigInt(0), govTokenUnclaimed?.raw ?? JSBI.BigInt(0)),
      govTokenUnHarvested?.raw ?? JSBI.BigInt(0)
    )
  )
}

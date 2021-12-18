import { Token, TokenAmount, Fraction, ChainId, JSBI, Pair } from '@fatex-dao/sdk'
import { wrappedCurrency } from './wrappedCurrency'
import calculateTotalStakedAmount from './calculateTotalStakedAmount'
import getPair from './getPair'
import { Result } from 'state/multicall/hooks'

function pairCurrencyAmountInWeth(
  baseToken: Token | undefined,
  tokens: Record<string, any>,
  valueOfTotalStakedAmountInPairCurrency: TokenAmount
): TokenAmount | Fraction | undefined {
  if (!baseToken) return valueOfTotalStakedAmountInPairCurrency

  switch (baseToken.symbol?.toUpperCase()) {
    case tokens.WETH?.token?.symbol?.toUpperCase():
      return valueOfTotalStakedAmountInPairCurrency
    case tokens.govToken?.token?.symbol?.toUpperCase():
      return tokens.govToken?.price
        ? valueOfTotalStakedAmountInPairCurrency.multiply(tokens?.govToken?.price)
        : valueOfTotalStakedAmountInPairCurrency
    case tokens.BUSD?.token?.symbol?.toUpperCase():
      return tokens.BUSD?.price
        ? valueOfTotalStakedAmountInPairCurrency.multiply(tokens?.BUSD?.price)
        : valueOfTotalStakedAmountInPairCurrency
    case tokens.USDC?.token?.symbol?.toUpperCase():
      return tokens.USDC?.price
        ? valueOfTotalStakedAmountInPairCurrency.multiply(tokens?.USDC?.price)
        : valueOfTotalStakedAmountInPairCurrency
    case tokens.bscBUSD?.token?.symbol?.toUpperCase():
      return tokens.bscBUSD?.price
        ? valueOfTotalStakedAmountInPairCurrency.multiply(tokens?.bscBUSD?.price)
        : valueOfTotalStakedAmountInPairCurrency
    case tokens.bridgedETH?.token?.symbol?.toUpperCase():
      return tokens.bridgedETH?.price
        ? valueOfTotalStakedAmountInPairCurrency.multiply(tokens?.bridgedETH?.price)
        : valueOfTotalStakedAmountInPairCurrency
    case tokens.DAI?.token?.symbol?.toUpperCase():
      return tokens.DAI?.price
        ? valueOfTotalStakedAmountInPairCurrency.multiply(tokens?.DAI?.price)
        : valueOfTotalStakedAmountInPairCurrency
    case tokens.WBTC?.token?.symbol?.toUpperCase():
      return tokens.WBTC?.price
        ? valueOfTotalStakedAmountInPairCurrency.multiply(tokens?.WBTC?.price)
        : valueOfTotalStakedAmountInPairCurrency
    case tokens.UST?.token?.symbol?.toUpperCase():
      return tokens.UST?.price
        ? valueOfTotalStakedAmountInPairCurrency.multiply(tokens?.UST?.price)
        : valueOfTotalStakedAmountInPairCurrency
    case tokens.PAXG?.token?.symbol?.toUpperCase():
      return tokens.PAXG?.price
        ? valueOfTotalStakedAmountInPairCurrency.multiply(tokens?.PAXG?.price)
        : valueOfTotalStakedAmountInPairCurrency
    case tokens.xFATE?.token?.symbol?.toUpperCase():
      return tokens.xFATE?.price
        ? valueOfTotalStakedAmountInPairCurrency.multiply(tokens?.xFATE?.price)
        : valueOfTotalStakedAmountInPairCurrency
    default:
      const price = tokens[baseToken.symbol ?? '']?.price
      return price ? valueOfTotalStakedAmountInPairCurrency.multiply(price) : valueOfTotalStakedAmountInPairCurrency
  }
}

export default function calculateWethAdjustedTotalStakedAmount(
  chainId: ChainId,
  baseToken: Token | undefined,
  tokenData: Record<string, any>,
  tokens: [Token, Token],
  totalLpTokenSupply: TokenAmount,
  totalStakedAmount: TokenAmount,
  lpTokenReserves: Result | Pair | undefined
): TokenAmount | Fraction | undefined {
  if (!baseToken || !lpTokenReserves || !totalLpTokenSupply) {
    return undefined
  }

  const reserve0 = lpTokenReserves?.reserve0
  const reserve1 = lpTokenReserves?.reserve1

  const stakingTokenPair =
    lpTokenReserves instanceof Pair
      ? lpTokenReserves
      : getPair(wrappedCurrency(tokens[0], chainId), wrappedCurrency(tokens[1], chainId), reserve0, reserve1)
  if (!stakingTokenPair) {
    return undefined
  }

  const valueOfTotalStakedAmountInPairCurrency = calculateTotalStakedAmount(
    baseToken,
    stakingTokenPair,
    totalStakedAmount,
    totalLpTokenSupply
  )
  if (!valueOfTotalStakedAmountInPairCurrency) {
    return undefined
  }

  return pairCurrencyAmountInWeth(baseToken, tokenData, valueOfTotalStakedAmountInPairCurrency)?.divide(
    baseToken.decimals !== 18 ? JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18 - baseToken.decimals)) : '1'
  )
}

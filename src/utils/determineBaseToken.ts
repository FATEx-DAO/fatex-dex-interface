import { Token, DEFAULT_CURRENCIES } from '@fatex-dao/sdk'
import { unwrappedToken } from './wrappedCurrency'

export default function determineBaseToken(tokenData: Record<string, any>, tokens: [Token, Token]): Token | undefined {
  const currency0 = unwrappedToken(tokens[0])
  const currency1 = unwrappedToken(tokens[1])

  let baseToken: Token | undefined = undefined

  if (DEFAULT_CURRENCIES.includes(currency0) || DEFAULT_CURRENCIES.includes(currency1)) {
    baseToken = tokenData?.WETH?.token
  } else if (
    tokens[0]?.symbol?.toUpperCase() === tokenData?.WETH?.token?.symbol?.toUpperCase() ||
    tokens[1]?.symbol?.toUpperCase() === tokenData?.WETH?.token?.symbol?.toUpperCase()
  ) {
    baseToken = tokenData?.WETH?.token
  } else if (
    tokens[0]?.symbol?.toUpperCase() === tokenData?.USDC?.token?.symbol?.toUpperCase() ||
    tokens[1]?.symbol?.toUpperCase() === tokenData?.USDC?.token?.symbol?.toUpperCase()
  ) {
    baseToken = tokenData?.USDC?.token
  } else if (
    tokens[0]?.symbol?.toUpperCase() === tokenData?.govToken?.token?.symbol?.toUpperCase() ||
    tokens[1]?.symbol?.toUpperCase() === tokenData?.govToken?.token?.symbol?.toUpperCase()
  ) {
    baseToken = tokenData?.govToken?.token
  } else if (
    tokens[0]?.symbol?.toUpperCase() === tokenData?.BUSD?.token?.symbol?.toUpperCase() ||
    tokens[1]?.symbol?.toUpperCase() === tokenData?.BUSD?.token?.symbol?.toUpperCase()
  ) {
    baseToken = tokenData?.BUSD?.token
  } else if (
    tokens[0]?.symbol?.toUpperCase() === tokenData?.UST?.token?.symbol?.toUpperCase() ||
    tokens[1]?.symbol?.toUpperCase() === tokenData?.UST?.token?.symbol?.toUpperCase()
  ) {
    baseToken = tokenData?.UST?.token
  } else if (
    tokens[0]?.symbol?.toUpperCase() === tokenData?.bscBUSD?.token?.symbol?.toUpperCase() ||
    tokens[1]?.symbol?.toUpperCase() === tokenData?.bscBUSD?.token?.symbol?.toUpperCase()
  ) {
    baseToken = tokenData?.bscBUSD?.token
  } else if (
    tokens[0]?.symbol?.toUpperCase() === tokenData?.bridgedETH?.token?.symbol?.toUpperCase() ||
    tokens[1]?.symbol?.toUpperCase() === tokenData?.bridgedETH?.token?.symbol?.toUpperCase()
  ) {
    baseToken = tokenData?.bridgedETH?.token
  } else if (
    tokens[0]?.symbol?.toUpperCase() === tokenData?.DAI?.token?.symbol?.toUpperCase() ||
    tokens[1]?.symbol?.toUpperCase() === tokenData?.DAI?.token?.symbol?.toUpperCase()
  ) {
    baseToken = tokenData?.DAI?.token
  } else if (
    tokens[0]?.symbol?.toUpperCase() === tokenData?.PAXG?.token?.symbol?.toUpperCase() ||
    tokens[1]?.symbol?.toUpperCase() === tokenData?.PAXG?.token?.symbol?.toUpperCase()
  ) {
    baseToken = tokenData?.PAXG?.token
  } else if (
    tokens[0]?.symbol?.toUpperCase() === tokenData?.WBTC?.token?.symbol?.toUpperCase() ||
    tokens[1]?.symbol?.toUpperCase() === tokenData?.WBTC?.token?.symbol?.toUpperCase()
  ) {
    baseToken = tokenData?.WBTC?.token
  } else if (
    tokens[0]?.symbol?.toUpperCase() === tokenData?.FATE?.token?.symbol?.toUpperCase() ||
    tokens[1]?.symbol?.toUpperCase() === tokenData?.FATE?.token?.symbol?.toUpperCase()
  ) {
    baseToken = tokenData?.FATE?.token
  } else if (
    tokens[0]?.symbol?.toUpperCase() === tokenData?.xFATE?.token?.symbol?.toUpperCase() ||
    tokens[1]?.symbol?.toUpperCase() === tokenData?.xFATE?.token?.symbol?.toUpperCase()
  ) {
    baseToken = tokenData?.xFATE?.token
  } else {
    const token0Symbol = tokens[0]?.symbol?.toUpperCase()
    const token1Symbol = tokens[1]?.symbol?.toUpperCase()
    if (token0Symbol && token0Symbol === tokenData[token0Symbol]?.token?.symbol?.toUpperCase()) {
      baseToken = tokenData[token0Symbol]?.token
    } else if (token1Symbol && token1Symbol === tokenData[token1Symbol]?.token?.symbol?.toUpperCase()) {
      baseToken = tokenData[token1Symbol]?.token
    }
  }

  return baseToken
}

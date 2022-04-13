import { Currency, currencyEquals, JSBI, Token, Price, WETH, ChainId } from '@fatex-dao/sdk'
import { useMemo } from 'react'
import { PairState, usePairs } from '../data/Reserves'
import { useActiveWeb3React } from '.'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import getToken from '../utils/getToken'

/**
 * Returns the price in BUSD of the input currency
 * @param currency currency to compute the BUSD price of
 */
export default function useBUSDPrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React()
  const wrapped = wrappedCurrency(currency, chainId)
  // const busdTicker = chainId !== ChainId.HARMONY_TESTNET ? 'BUSD' : '1BUSD'
  const busdTicker =
    chainId === ChainId.HARMONY_TESTNET ? '1BUSD' : chainId === ChainId.HARMONY_MAINNET ? '1USDC' : 'BUSD'
  const busd: Token | undefined = getToken(chainId, busdTicker)
  const divisor = useMemo(() => {
    return busdTicker.includes('BUSD') ? JSBI.BigInt('1') : JSBI.BigInt('1000000000000')
  }, [busdTicker])

  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [
        chainId && wrapped && currencyEquals(WETH[chainId], wrapped) ? undefined : currency,
        chainId ? WETH[chainId] : undefined
      ],
      [busd && wrapped?.equals(busd) ? undefined : wrapped, busd],
      [chainId ? WETH[chainId] : undefined, busd]
    ],
    [chainId, currency, wrapped, busd]
  )

  const [[ethPairState, ethPair], [busdPairState, busdPair], [busdEthPairState, busdEthPair]] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }
    // handle weth/eth
    if (wrapped.equals(WETH[chainId])) {
      if (busdPair) {
        const price = busdPair.priceOf(WETH[chainId])
        return busd ? new Price(currency, busd, price.denominator, JSBI.multiply(price.numerator, divisor)) : undefined
      } else {
        return undefined
      }
    }

    // handle busd
    if (busd && wrapped.equals(busd)) {
      return busd ? new Price(busd, busd, '1', '1') : undefined
    }

    const ethPairETHAmount = ethPair?.reserveOf(WETH[chainId])
    const busdWethPrice = busdEthPair?.priceOf(WETH[chainId])
    const ethPairETHBUSDValue: JSBI =
      ethPairETHAmount &&
      busdWethPrice &&
      JSBI.notEqual(busdWethPrice.denominator, JSBI.BigInt('0')) &&
      ethPairETHAmount.greaterThan('0')
        ? busdWethPrice.quote(ethPairETHAmount).raw
        : JSBI.BigInt(0)

    // all other tokens
    // first try the usdc pair
    if (
      busd &&
      busdPairState === PairState.EXISTS &&
      busdPair &&
      busdPair.reserveOf(busd).greaterThan(ethPairETHBUSDValue)
    ) {
      const price = busdPair.priceOf(wrapped)
      return busd ? new Price(currency, busd, price.denominator, JSBI.multiply(price.numerator, divisor)) : undefined
    }
    if (ethPairState === PairState.EXISTS && ethPair && busdEthPairState === PairState.EXISTS && busdEthPair) {
      if (busd && busdEthPair.reserveOf(busd).greaterThan('0') && ethPair.reserveOf(WETH[chainId]).greaterThan('0')) {
        const ethUsdcPrice = busdEthPair.priceOf(busd)
        const currencyEthPrice = ethPair.priceOf(WETH[chainId])
        const usdcPrice = ethUsdcPrice.multiply(currencyEthPrice).invert()
        return new Price(currency, busd, usdcPrice.denominator, JSBI.multiply(usdcPrice.numerator, divisor))
      }
    }
    return undefined
  }, [
    currency,
    wrapped,
    chainId,
    busd,
    ethPair,
    busdEthPair,
    busdPairState,
    busdPair,
    ethPairState,
    busdEthPairState,
    divisor
  ])
}

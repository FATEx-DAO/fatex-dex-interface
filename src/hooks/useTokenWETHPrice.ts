import { useMemo } from 'react'
import { JSBI, Price, Token, WETH } from '@fatex-dao/sdk'
import { useActiveWeb3React } from './index'
import { usePair } from '../data/Reserves'
import useBUSDPrice from './useBUSDPrice'

export default function useTokenWETHPrice(token: Token | undefined): Price | undefined {
  const { chainId } = useActiveWeb3React()
  const [, tokenWETHPair] = usePair(chainId && WETH[chainId], token)
  const tokenUsdPrice = useBUSDPrice(token)
  const weth = useMemo(() => WETH[chainId], [chainId])
  const wethUsdPrice = useBUSDPrice(weth)

  return useMemo(() => {
    if (token && chainId && tokenWETHPair && token.symbol !== 'FATE') {
      return tokenWETHPair.priceOf(token)
    } else if (tokenUsdPrice && wethUsdPrice) {
      return new Price(
        token,
        weth,
        JSBI.multiply(wethUsdPrice.numerator, tokenUsdPrice.denominator),
        JSBI.multiply(tokenUsdPrice.numerator, wethUsdPrice.denominator)
      )
    } else {
      return undefined
    }
  }, [chainId, token, tokenUsdPrice, tokenWETHPair, weth, wethUsdPrice])
}

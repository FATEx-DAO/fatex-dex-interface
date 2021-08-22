import { ChainId, WETH, Token, Blockchain } from '@fatex-dao/sdk'
import { useMemo } from 'react'
import useGovernanceToken from './useGovernanceToken'
import useTokenWETHPrice from './useTokenWETHPrice'
import useBlockchain from './useBlockchain'
import getToken from '../utils/getToken'
import { useActiveWeb3React } from './index'

export default function useTokensWithWETHPrices(): Record<string, any> {
  const { chainId } = useActiveWeb3React()
  const blockchain = useBlockchain()

  const weth = chainId && WETH[chainId]

  const govToken = useGovernanceToken()
  const govTokenWETHPrice = useTokenWETHPrice(govToken)

  const BUSDTicker = chainId !== ChainId.HARMONY_TESTNET ? 'BUSD' : '1BUSD'
  const BUSD: Token | undefined = getToken(chainId, BUSDTicker)
  const BUSDWETHPrice = useTokenWETHPrice(BUSD)

  const USDCTicker = blockchain === Blockchain.HARMONY ? '1USDC' : 'USDC'
  const USDC: Token | undefined = getToken(chainId, USDCTicker)
  const USDCWETHPrice = useTokenWETHPrice(USDC)

  // Harmony specific tokens
  const bscBUSD: Token | undefined = blockchain === Blockchain.HARMONY ? getToken(chainId, 'bscBUSD') : undefined
  const bscBUSDWETHPrice = useTokenWETHPrice(bscBUSD)

  const bridgedETH: Token | undefined = Blockchain.HARMONY ? getToken(chainId, '1ETH') : undefined
  const bridgedETHWETHPrice = useTokenWETHPrice(bridgedETH)

  return useMemo(() => {
    return {
      WETH: { token: weth, price: undefined },
      govToken: { token: govToken, price: govTokenWETHPrice },
      BUSD: { token: BUSD, price: BUSDWETHPrice },
      USDC: { token: USDC, price: USDCWETHPrice },
      bscBUSD: { token: bscBUSD, price: bscBUSDWETHPrice },
      bridgedETH: { token: bridgedETH, price: bridgedETHWETHPrice }
    }
  }, [
    chainId,
    blockchain,
    weth,
    govToken,
    govTokenWETHPrice,
    BUSD,
    BUSDWETHPrice,
    USDC,
    USDCWETHPrice,
    bscBUSD,
    bscBUSDWETHPrice,
    bridgedETH,
    bridgedETHWETHPrice
  ])
}

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

  const weth = useMemo(() => WETH[chainId], [chainId])

  const govToken = useGovernanceToken()
  const govTokenWETHPrice = useTokenWETHPrice(govToken)

  const PAXGTicker = blockchain === Blockchain.HARMONY ? '1PAXG' : 'PAXG'
  const PAXG = useMemo(() => getToken(chainId, PAXGTicker), [chainId, PAXGTicker])
  const PAXGWETHPrice = useTokenWETHPrice(PAXG)

  const BUSDTicker = chainId !== ChainId.HARMONY_TESTNET ? 'BUSD' : '1BUSD'
  const BUSD: Token | undefined = useMemo(() => getToken(chainId, BUSDTicker), [chainId, BUSDTicker])
  const BUSDWETHPrice = useTokenWETHPrice(BUSD)

  const USDCTicker = blockchain === Blockchain.HARMONY ? '1USDC' : 'USDC'
  const USDC: Token | undefined = useMemo(() => getToken(chainId, USDCTicker), [chainId, USDCTicker])
  const USDCWETHPrice = useTokenWETHPrice(USDC)

  // Harmony specific tokens
  const bscBUSD: Token | undefined = useMemo(
    () => (blockchain === Blockchain.HARMONY ? getToken(chainId, 'bscBUSD') : undefined),
    [blockchain, chainId]
  )
  const bscBUSDWETHPrice = useTokenWETHPrice(bscBUSD)

  const bridgedETH: Token | undefined = useMemo(
    () => (blockchain === Blockchain.HARMONY ? getToken(chainId, '1ETH') : undefined),
    [blockchain, chainId]
  )
  const bridgedETHWETHPrice = useTokenWETHPrice(bridgedETH)

  const DAITicker = blockchain === Blockchain.HARMONY ? '1DAI' : 'DAI'
  const DAI: Token | undefined = useMemo(
    () => (blockchain === Blockchain.HARMONY ? getToken(chainId, DAITicker) : undefined),
    [DAITicker, blockchain, chainId]
  )
  const DAIWETHPrice = useTokenWETHPrice(DAI)

  const WBTCTicker = blockchain === Blockchain.HARMONY ? '1WBTC' : 'WBTC'
  const WBTC: Token | undefined = useMemo(
    () => (blockchain === Blockchain.HARMONY ? getToken(chainId, WBTCTicker) : undefined),
    [WBTCTicker, blockchain, chainId]
  )
  const WBTCWETHPrice = useTokenWETHPrice(WBTC)

  const USTTicker = 'UST'
  const UST: Token | undefined = useMemo(
    () => (blockchain === Blockchain.HARMONY ? getToken(chainId, USTTicker) : undefined),
    [blockchain, chainId]
  )
  const USTWETHPrice = useTokenWETHPrice(UST)

  const FATETicker = 'FATE'
  const FATE: Token | undefined = useMemo(
    () => (blockchain === Blockchain.HARMONY ? getToken(chainId, FATETicker) : undefined),
    [blockchain, chainId]
  )
  const FATEWETHPrice = useTokenWETHPrice(FATE)

  const xFATETicker = 'xFATE'
  const xFATE: Token | undefined = useMemo(
    () => (blockchain === Blockchain.HARMONY ? getToken(chainId, xFATETicker) : undefined),
    [blockchain, chainId]
  )
  const xFATEWETHPrice = useTokenWETHPrice(xFATE)

  const bscLINKTicker = 'bscLINK'
  const bscLINK: Token | undefined = useMemo(
    () => (blockchain === Blockchain.HARMONY ? getToken(chainId, bscLINKTicker) : undefined),
    [blockchain, chainId]
  )
  const bscLINKWETHPrice = useTokenWETHPrice(bscLINK)

  const WMATICTicker = 'WMATIC'
  const WMATIC: Token | undefined = useMemo(
    () => (blockchain === Blockchain.HARMONY ? getToken(chainId, WMATICTicker) : undefined),
    [blockchain, chainId]
  )
  const WMATICWETHPrice = useTokenWETHPrice(WMATIC)

  const _1SUSHITicker = '1SUSHI'
  const _1SUSHI: Token | undefined = useMemo(
    () => (blockchain === Blockchain.HARMONY ? getToken(chainId, _1SUSHITicker) : undefined),
    [blockchain, chainId]
  )
  const _1SUSHIWETHPrice = useTokenWETHPrice(_1SUSHI)

  const LINKTicker = 'LINK'
  const LINK: Token | undefined = useMemo(
    () => (blockchain === Blockchain.HARMONY ? getToken(chainId, LINKTicker) : undefined),
    [blockchain, chainId]
  )
  const LINKWETHPrice = useTokenWETHPrice(LINK)

  const FTMTicker = 'FTM'
  const FTM: Token | undefined = useMemo(
    () => (blockchain === Blockchain.HARMONY ? getToken(chainId, FTMTicker) : undefined),
    [blockchain, chainId]
  )
  const FTMWETHPrice = useTokenWETHPrice(FTM)

  return useMemo(() => {
    return {
      WETH: { token: weth, price: undefined },
      govToken: { token: govToken, price: govTokenWETHPrice },
      BUSD: { token: BUSD, price: BUSDWETHPrice },
      USDC: { token: USDC, price: USDCWETHPrice },
      bscBUSD: { token: bscBUSD, price: bscBUSDWETHPrice },
      bridgedETH: { token: bridgedETH, price: bridgedETHWETHPrice },
      DAI: { token: DAI, price: DAIWETHPrice },
      PAXG: { token: PAXG, price: PAXGWETHPrice },
      WBTC: { token: WBTC, price: WBTCWETHPrice },
      UST: { token: UST, price: USTWETHPrice },
      FATE: { token: FATE, price: FATEWETHPrice },
      xFATE: { token: xFATE, price: xFATEWETHPrice },
      bscLINK: { token: bscLINK, price: bscLINKWETHPrice },
      WMATIC: { token: WMATIC, price: WMATICWETHPrice },
      '1SUSHI': { token: _1SUSHI, price: _1SUSHIWETHPrice },
      LINK: { token: LINK, price: LINKWETHPrice },
      FTM: { token: FTM, price: FTMWETHPrice }
    }
  }, [
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
    bridgedETHWETHPrice,
    DAI,
    DAIWETHPrice,
    PAXG,
    PAXGWETHPrice,
    WBTC,
    WBTCWETHPrice,
    UST,
    USTWETHPrice,
    FATE,
    FATEWETHPrice,
    xFATE,
    xFATEWETHPrice,
    bscLINK,
    bscLINKWETHPrice,
    WMATIC,
    WMATICWETHPrice,
    _1SUSHI,
    _1SUSHIWETHPrice,
    LINK,
    LINKWETHPrice,
    FTM,
    FTMWETHPrice
  ])
}

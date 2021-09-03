import { ChainId, JSBI, Percent, Token, WETH } from '@fatex-dao/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { fortmatic, injected, portis, walletconnect, walletlink } from '../connectors'
import { GOVERNANCE_TOKEN as INTERNAL_GOVERNANCE_TOKEN } from './governance-token'

import getTokenWithDefault from '../utils/getTokenWithDefault'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const ZERO_ONE_ADDRESS = '0x0000000000000000000000000000000000000001'

export const GOVERNANCE_TOKEN = INTERNAL_GOVERNANCE_TOKEN

export const ROUTER_ADDRESSES: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.ROPSTEN]: ZERO_ONE_ADDRESS,
  [ChainId.RINKEBY]: ZERO_ONE_ADDRESS,
  [ChainId.GÖRLI]: ZERO_ONE_ADDRESS,
  [ChainId.KOVAN]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_TESTNET]: ZERO_ONE_ADDRESS,
  [ChainId.HARMONY_MAINNET]: '0x82145037096870BA3a5f7beE4C3602BD36e27Bff',
  [ChainId.HARMONY_TESTNET]: '0x82145037096870BA3a5f7beE4C3602BD36e27Bff'
}

export const GOVERNANCE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.ROPSTEN]: ZERO_ONE_ADDRESS,
  [ChainId.RINKEBY]: ZERO_ONE_ADDRESS,
  [ChainId.GÖRLI]: ZERO_ONE_ADDRESS,
  [ChainId.KOVAN]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_TESTNET]: ZERO_ONE_ADDRESS,
  [ChainId.HARMONY_MAINNET]: '0x5C445091402923739f6681FCe86212e63cDA9553',
  [ChainId.HARMONY_TESTNET]: '0x7a8B2780189fa8758bf212321DabDbd3856D1155'
}

export const GOVERNANCE_START_BLOCK: { [chainId in ChainId]: number } = {
  [ChainId.MAINNET]: 0,
  [ChainId.ROPSTEN]: 0,
  [ChainId.RINKEBY]: 0,
  [ChainId.GÖRLI]: 0,
  [ChainId.KOVAN]: 0,
  [ChainId.BSC_MAINNET]: 0,
  [ChainId.BSC_TESTNET]: 0,
  [ChainId.HARMONY_MAINNET]: 0,
  [ChainId.HARMONY_TESTNET]: 14455793
}

export const TIMELOCK_ADDRESS = {
  [ChainId.MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.ROPSTEN]: ZERO_ONE_ADDRESS,
  [ChainId.RINKEBY]: ZERO_ONE_ADDRESS,
  [ChainId.GÖRLI]: ZERO_ONE_ADDRESS,
  [ChainId.KOVAN]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_TESTNET]: ZERO_ONE_ADDRESS,
  [ChainId.HARMONY_MAINNET]: '0x6B7A6163714d3D3244A74be798E0194df6650D6A',
  [ChainId.HARMONY_TESTNET]: '0x73499F9B609fBb61291C90230454D73CC849e8cC'
}

export const FATE_REWARD_CONTROLLER: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.RINKEBY]: ZERO_ONE_ADDRESS,
  [ChainId.ROPSTEN]: ZERO_ONE_ADDRESS,
  [ChainId.GÖRLI]: ZERO_ONE_ADDRESS,
  [ChainId.KOVAN]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_TESTNET]: ZERO_ONE_ADDRESS,
  [ChainId.HARMONY_MAINNET]: '0xef1a47106b5B1eb839a2995fb29Fa5a7Ff37Be27',
  [ChainId.HARMONY_TESTNET]: '0xef1a47106b5B1eb839a2995fb29Fa5a7Ff37Be27'
}

export const FEE_TOKEN_CONVERTER: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.RINKEBY]: ZERO_ONE_ADDRESS,
  [ChainId.ROPSTEN]: ZERO_ONE_ADDRESS,
  [ChainId.GÖRLI]: ZERO_ONE_ADDRESS,
  [ChainId.KOVAN]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_TESTNET]: ZERO_ONE_ADDRESS,
  [ChainId.HARMONY_MAINNET]: '0x1C2A867593Ed6c6782f1cDf47237fF3EE66bDbE1',
  [ChainId.HARMONY_TESTNET]: '0x1C2A867593Ed6c6782f1cDf47237fF3EE66bDbE1'
}

export const SUSHI_MIGRATOR: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.RINKEBY]: ZERO_ONE_ADDRESS,
  [ChainId.ROPSTEN]: ZERO_ONE_ADDRESS,
  [ChainId.GÖRLI]: ZERO_ONE_ADDRESS,
  [ChainId.KOVAN]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_TESTNET]: ZERO_ONE_ADDRESS,
  [ChainId.HARMONY_MAINNET]: '0x4FA5f948785510035B8316Dab2FA67e31ce278F7',
  [ChainId.HARMONY_TESTNET]: '0x4FA5f948785510035B8316Dab2FA67e31ce278F7'
}

export const VIPER_MIGRATOR: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.RINKEBY]: ZERO_ONE_ADDRESS,
  [ChainId.ROPSTEN]: ZERO_ONE_ADDRESS,
  [ChainId.GÖRLI]: ZERO_ONE_ADDRESS,
  [ChainId.KOVAN]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_TESTNET]: ZERO_ONE_ADDRESS,
  [ChainId.HARMONY_MAINNET]: '0xd50D8901aB7F455494cE50eb7665DFB263B0a962',
  [ChainId.HARMONY_TESTNET]: '0xd50D8901aB7F455494cE50eb7665DFB263B0a962'
}

export const X_FATE: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, ZERO_ONE_ADDRESS, 18, 'xFATE', 'Fate'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ONE_ADDRESS, 18, 'xFATE', 'Fate'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, ZERO_ONE_ADDRESS, 18, 'xFATE', 'Fate'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ONE_ADDRESS, 18, 'xFATE', 'Fate'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ONE_ADDRESS, 18, 'xFATE', 'Fate'),
  [ChainId.BSC_MAINNET]: new Token(ChainId.BSC_MAINNET, ZERO_ONE_ADDRESS, 18, 'xFATE', 'CobraDen'),
  [ChainId.BSC_TESTNET]: new Token(ChainId.BSC_TESTNET, ZERO_ONE_ADDRESS, 18, 'xFATE', 'xFATE Token'),
  [ChainId.HARMONY_MAINNET]: new Token(
    ChainId.HARMONY_MAINNET,
    '0x6f4078cb47438157c914409d10358a0Cf4b06AB7',
    18,
    'xFATE',
    'xFATE Token'
  ),
  [ChainId.HARMONY_TESTNET]: new Token(
    ChainId.HARMONY_TESTNET,
    '0x6f4078cb47438157c914409d10358a0Cf4b06AB7',
    18,
    'xFATE',
    'xFATE Token'
  )
}

export const X_FATE_SETTINGS: { [chainId in ChainId]: Record<string, string> } = {
  [ChainId.MAINNET]: { name: '', path: '' },
  [ChainId.RINKEBY]: { name: '', path: '' },
  [ChainId.ROPSTEN]: { name: '', path: '' },
  [ChainId.GÖRLI]: { name: '', path: '' },
  [ChainId.KOVAN]: { name: '', path: '' },
  [ChainId.BSC_MAINNET]: { name: '', path: '' },
  [ChainId.BSC_TESTNET]: { name: '', path: '' },
  [ChainId.HARMONY_MAINNET]: { name: 'xFate Pool', path: '/xfate' },
  [ChainId.HARMONY_TESTNET]: { name: 'xFate Pool', path: '/xfate' }
}

export const WEB_INTERFACES: { [chainId in ChainId]: string[] } = {
  [ChainId.MAINNET]: [''],
  [ChainId.RINKEBY]: [''],
  [ChainId.ROPSTEN]: [''],
  [ChainId.GÖRLI]: [''],
  [ChainId.KOVAN]: [''],
  [ChainId.BSC_MAINNET]: [''],
  [ChainId.BSC_TESTNET]: [''],
  [ChainId.HARMONY_MAINNET]: ['fatex.exchange', 'fatex.one', 'fatex.com', 'fatex.io', 'fatex.org'],
  [ChainId.HARMONY_TESTNET]: ['fatex.exchange', 'fatex.one', 'fatex.com', 'fatex.io', 'fatex.org']
}

export { PRELOADED_PROPOSALS } from './proposals'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C')
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const COMP = new Token(ChainId.MAINNET, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound')
export const MKR = new Token(ChainId.MAINNET, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker')
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC')

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 2

export const COMMON_CONTRACT_NAMES: { [chainId in ChainId]: { [address: string]: string } } = {
  [ChainId.MAINNET]: {
    [GOVERNANCE_ADDRESS[ChainId.MAINNET]]: 'Governance',
    [TIMELOCK_ADDRESS[ChainId.MAINNET]]: 'Timelock'
  },
  [ChainId.ROPSTEN]: {
    [GOVERNANCE_ADDRESS[ChainId.ROPSTEN]]: 'Governance',
    [TIMELOCK_ADDRESS[ChainId.ROPSTEN]]: 'Timelock'
  },
  [ChainId.RINKEBY]: {
    [GOVERNANCE_ADDRESS[ChainId.RINKEBY]]: 'Governance',
    [TIMELOCK_ADDRESS[ChainId.RINKEBY]]: 'Timelock'
  },
  [ChainId.GÖRLI]: {
    [GOVERNANCE_ADDRESS[ChainId.GÖRLI]]: 'Governance',
    [TIMELOCK_ADDRESS[ChainId.GÖRLI]]: 'Timelock'
  },
  [ChainId.KOVAN]: {
    [GOVERNANCE_ADDRESS[ChainId.KOVAN]]: 'Governance',
    [TIMELOCK_ADDRESS[ChainId.KOVAN]]: 'Timelock'
  },
  [ChainId.BSC_MAINNET]: {
    [GOVERNANCE_ADDRESS[ChainId.BSC_MAINNET]]: 'Governance',
    [TIMELOCK_ADDRESS[ChainId.BSC_MAINNET]]: 'Timelock'
  },
  [ChainId.BSC_TESTNET]: {
    [GOVERNANCE_ADDRESS[ChainId.BSC_TESTNET]]: 'Governance',
    [TIMELOCK_ADDRESS[ChainId.BSC_TESTNET]]: 'Timelock'
  },
  [ChainId.HARMONY_MAINNET]: {
    [GOVERNANCE_ADDRESS[ChainId.HARMONY_MAINNET]]: 'Governance',
    [TIMELOCK_ADDRESS[ChainId.HARMONY_MAINNET]]: 'Timelock'
  },
  [ChainId.HARMONY_TESTNET]: {
    [GOVERNANCE_ADDRESS[ChainId.HARMONY_TESTNET]]: 'Governance',
    [TIMELOCK_ADDRESS[ChainId.HARMONY_TESTNET]]: 'Timelock'
  }
}

export const MERKLE_DISTRIBUTOR_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: undefined,
  [ChainId.HARMONY_MAINNET]: undefined,
  [ChainId.HARMONY_TESTNET]: undefined
}

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WETH[ChainId.KOVAN]],
  [ChainId.BSC_MAINNET]: [WETH[ChainId.BSC_MAINNET]],
  [ChainId.BSC_TESTNET]: [WETH[ChainId.BSC_TESTNET]],
  [ChainId.HARMONY_MAINNET]: [WETH[ChainId.HARMONY_MAINNET]],
  [ChainId.HARMONY_TESTNET]: [WETH[ChainId.HARMONY_TESTNET]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, COMP, MKR, WBTC],
  [ChainId.HARMONY_MAINNET]: [
    ...WETH_ONLY[ChainId.HARMONY_MAINNET],
    getTokenWithDefault(ChainId.HARMONY_MAINNET, 'BUSD'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, 'bscBUSD'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, '1USDC'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, 'FATE'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, '1ETH'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, 'LINK')
  ]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
  }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
  [ChainId.HARMONY_MAINNET]: [
    ...WETH_ONLY[ChainId.HARMONY_MAINNET],
    getTokenWithDefault(ChainId.HARMONY_MAINNET, 'BUSD'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, 'FATE')
  ],
  [ChainId.HARMONY_TESTNET]: [
    ...WETH_ONLY[ChainId.HARMONY_TESTNET],
    getTokenWithDefault(ChainId.HARMONY_TESTNET, 'BUSD'),
    getTokenWithDefault(ChainId.HARMONY_TESTNET, 'FATE')
  ]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
  [ChainId.HARMONY_MAINNET]: [
    ...WETH_ONLY[ChainId.HARMONY_MAINNET],
    getTokenWithDefault(ChainId.HARMONY_MAINNET, 'BUSD'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, 'bscBUSD'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, '1USDC'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, 'FATE'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, '1ETH'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, 'LINK')
  ],
  [ChainId.HARMONY_TESTNET]: [
    ...WETH_ONLY[ChainId.HARMONY_TESTNET],
    getTokenWithDefault(ChainId.HARMONY_TESTNET, 'BUSD'),
    getTokenWithDefault(ChainId.HARMONY_TESTNET, 'bscBUSD'),
    getTokenWithDefault(ChainId.HARMONY_TESTNET, '1USDC'),
    getTokenWithDefault(ChainId.HARMONY_TESTNET, 'FATE'),
    getTokenWithDefault(ChainId.HARMONY_TESTNET, '1ETH'),
    getTokenWithDefault(ChainId.HARMONY_TESTNET, 'LINK')
  ]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [
      new Token(ChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
      new Token(ChainId.MAINNET, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin')
    ],
    [USDC, USDT],
    [DAI, USDT]
  ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com/mtUDhEZPy1',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true
  },
  FORTMATIC: {
    connector: fortmatic,
    name: 'Fortmatic',
    iconName: 'fortmaticIcon.png',
    description: 'Login using Fortmatic hosted wallet',
    href: null,
    color: '#6748FF',
    mobile: true
  },
  Portis: {
    connector: portis,
    name: 'Portis',
    iconName: 'portisIcon.png',
    description: 'Login using Portis hosted wallet',
    href: null,
    color: '#4A6C9B',
    mobile: true
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C'
]

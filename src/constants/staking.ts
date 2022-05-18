import { ChainId, Token } from '@fatex-dao/sdk'
import getPairTokensWithDefaults from '../utils/getPairTokensWithDefaults'

export interface StakingRewardsInfo {
  pid: number
  tokens: [Token, Token]
  active: boolean
}

export const STAKING_REWARDS_INFO: {
  [chainId in ChainId]?: StakingRewardsInfo[]
} = {
  [ChainId.POLYGON_MAINNET]: [
    {
      pid: 0,
      tokens: getPairTokensWithDefaults(ChainId.POLYGON_MAINNET, 'FATE/USDC'),
      active: true
    },
    {
      pid: 1,
      tokens: getPairTokensWithDefaults(ChainId.POLYGON_MAINNET, 'WMATIC/USDC'),
      active: true
    },
    {
      pid: 2,
      tokens: getPairTokensWithDefaults(ChainId.POLYGON_MAINNET, 'FATE/PAXG'),
      active: true
    },
    {
      pid: 3,
      tokens: getPairTokensWithDefaults(ChainId.POLYGON_MAINNET, 'PAXG/USDC'),
      active: true
    },
    {
      pid: 4,
      tokens: getPairTokensWithDefaults(ChainId.POLYGON_MAINNET, 'FATE/WMATIC'),
      active: false
    },
    {
      pid: 5,
      tokens: getPairTokensWithDefaults(ChainId.POLYGON_MAINNET, 'WMATIC/PAXG'),
      active: false
    },
    {
      pid: 6,
      tokens: getPairTokensWithDefaults(ChainId.POLYGON_MAINNET, 'FATE/xFATE'),
      active: false
    },
    {
      pid: 7,
      tokens: getPairTokensWithDefaults(ChainId.POLYGON_MAINNET, 'ETH/PAXG'),
      active: false
    },
    {
      pid: 8,
      tokens: getPairTokensWithDefaults(ChainId.POLYGON_MAINNET, 'WBTC/PAXG'),
      active: false
    }
  ],
  [ChainId.HARMONY_MAINNET]: [
    {
      pid: 0,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FATE/WONE'),
      active: true
    },
    {
      pid: 1,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'WONE/1USDC'),
      active: true
    },
    {
      pid: 2,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'WONE/1WBTC'),
      active: true
    },
    {
      pid: 3,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'WONE/1ETH'),
      active: true
    },
    {
      pid: 5,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FATE/1ETH'),
      active: true
    },
    {
      pid: 6,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FATE/1WBTC'),
      active: true
    },
    {
      pid: 7,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FATE/1USDC'),
      active: true
    },
    {
      pid: 8,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FATE/XFATE'),
      active: true
    },
    {
      pid: 9,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'WONE/BUSD'),
      active: true
    },
    {
      pid: 10,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FATE/BUSD'),
      active: true
    },
    {
      pid: 11,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FATE/UST'),
      active: true
    },
    {
      pid: 12,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FATE/bscBUSD'),
      active: true
    },
    {
      pid: 13,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'WONE/UST'),
      active: true
    },
    {
      pid: 14,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'WONE/bscBUSD'),
      active: true
    },
    {
      pid: 15,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FATE/1PAXG'),
      active: true
    },
    {
      pid: 16,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1ETH/1WBTC'),
      active: true
    },
    {
      pid: 17,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FATE/1USDT'),
      active: true
    },
    {
      pid: 18,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'WONE/1USDT'),
      active: true
    },
    {
      pid: 19,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1USDT/1USDC'),
      active: true
    },
    {
      pid: 20,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'BUSD/bscBUSD'),
      active: true
    },
    {
      pid: 21,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1DAI/FATE'),
      active: true
    },
    {
      pid: 22,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1DAI/1USDC'),
      active: true
    },
    {
      pid: 23,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FATE/1SUSHI'),
      active: true
    },
    {
      pid: 24,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1SUSHI/1USDC'),
      active: true
    },
    {
      pid: 25,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1ETH/1DAI'),
      active: true
    },
    {
      pid: 26,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1ETH/1USDC'),
      active: true
    },
    {
      pid: 27,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1WBTC/1DAI'),
      active: true
    },
    {
      pid: 28,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1WBTC/1USDC'),
      active: true
    },
    {
      pid: 29,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1PAXG/1DAI'),
      active: true
    },
    {
      pid: 30,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1PAXG/1USDC'),
      active: true
    },
    {
      pid: 31,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1PAXG/1ETH'),
      active: true
    },
    {
      pid: 32,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1PAXG/1WBTC'),
      active: true
    },
    {
      pid: 33,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1PAXG/WONE'),
      active: true
    },
    {
      pid: 34,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'xFATE/1PAXG'),
      active: true
    },
    {
      pid: 35,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'UST/1DAI'),
      active: true
    },
    {
      pid: 36,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FATE/bscBNB'),
      active: true
    },
    {
      pid: 37,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1SUSHI/1PAXG'),
      active: true
    },
    {
      pid: 38,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'bscBNB/1PAXG'),
      active: true
    },
    {
      pid: 39,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1WBTC/UST'),
      active: true
    },
    {
      pid: 40,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1ETH/UST'),
      active: true
    },
    {
      pid: 41,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1SUSHI/UST'),
      active: true
    },
    {
      pid: 42,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'bscBNB/UST'),
      active: true
    },
    {
      pid: 43,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1PAXG/UST'),
      active: true
    },
    {
      pid: 44,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'UST/1USDC'),
      active: true
    },
    {
      pid: 45,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FATE/WMATIC'),
      active: true
    },
    {
      pid: 46,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'xFATE/WMATIC'),
      active: true
    },
    {
      pid: 47,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1PAXG/WMATIC'),
      active: true
    },
    {
      pid: 48,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FATE/FTM'),
      active: true
    },
    {
      pid: 49,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'xFATE/FTM'),
      active: true
    },
    {
      pid: 50,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1PAXG/FTM'),
      active: true
    },
    {
      pid: 51,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FATE/LUNA'),
      active: true
    },
    {
      pid: 52,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'xFATE/LUNA'),
      active: true
    },
    {
      pid: 53,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1PAXG/LUNA'),
      active: true
    },
    {
      pid: 54,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FATE/AVAX'),
      active: true
    },
    {
      pid: 55,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'xFATE/AVAX'),
      active: true
    },
    {
      pid: 56,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1PAXG/AVAX'),
      active: true
    },
    {
      pid: 57,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'JEWEL/1USDC'),
      active: true
    },
    {
      pid: 58,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'JEWEL/UST'),
      active: true
    },
    {
      pid: 59,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'JEWEL/FATE'),
      active: true
    },
    {
      pid: 60,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'JEWEL/1PAXG'),
      active: true
    },
    {
      pid: 61,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'JEWEL/xFATE'),
      active: true
    },
    {
      pid: 62,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'JEWEL/WONE'),
      active: true
    },
    {
      pid: 63,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'JEWEL/1DAI'),
      active: true
    },
    {
      pid: 64,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'bscLINK/1USDC'),
      active: true
    },
    {
      pid: 65,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'bscLINK/UST'),
      active: true
    },
    {
      pid: 66,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'bscLINK/FATE'),
      active: true
    },
    {
      pid: 67,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'bscLINK/1PAXG'),
      active: true
    },
    {
      pid: 68,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'bscLINK/xFATE'),
      active: true
    },
    {
      pid: 69,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'bscLINK/WONE'),
      active: true
    },
    {
      pid: 70,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'bscLINK/1DAI'),
      active: true
    },
    {
      pid: 71,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'WONE/1DAI'),
      active: true
    },
    {
      pid: 72,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FTM/1USDC'),
      active: true
    },
    {
      pid: 73,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'AVAX/1USDC'),
      active: true
    },
    {
      pid: 74,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'bscBNB/1USDC'),
      active: true
    },
    {
      pid: 75,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'bscLINK/LINK'),
      active: true
    },
    {
      pid: 76,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'WMATIC/1USDC'),
      active: true
    },
    {
      pid: 77,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'bscADA/1USDC'),
      active: true
    },
    {
      pid: 78,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FATE/bscADA'),
      active: true
    },
    {
      pid: 79,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'bscADA/1PAXG'),
      active: true
    },
    {
      pid: 80,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'LUNA/UST'),
      active: true
    },
    {
      pid: 81,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'bscBNB/1DAI'),
      active: true
    },
    {
      pid: 82,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'bscETH/1ETH'),
      active: true
    },
    {
      pid: 83,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'bscMATIC/WMATIC'),
      active: true
    },
    {
      pid: 84,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FTM/bscFTM'),
      active: true
    },
    {
      pid: 85,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1SUSHI/bscSUSHI'),
      active: true
    }
  ],
  [ChainId.HARMONY_TESTNET]: [
    {
      pid: 0,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_TESTNET, 'FATE/WONE'),
      active: true
    },
    {
      pid: 1,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_TESTNET, 'WONE/1BUSD'),
      active: true
    }
  ]
}

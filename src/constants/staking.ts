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

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
    // {
    //   pid: 4,
    //   tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, '1WBTC/FATE'),
    //   active: true
    // },
    {
      pid: 5,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FATE/1ETH'),
      active: true
    },
    {
      pid: 6,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'FATE/1WBTC'),
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

import { ChainId, Token } from '@fatex-dao/sdk'

const ZERO_ONE_ADDRESS = '0x0000000000000000000000000000000000000001'

export const GOVERNANCE_TOKEN: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, ZERO_ONE_ADDRESS, 18, 'FATE', 'Fate'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ONE_ADDRESS, 18, 'FATE', 'Fate'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, ZERO_ONE_ADDRESS, 18, 'FATE', 'Fate'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ONE_ADDRESS, 18, 'FATE', 'Fate'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ONE_ADDRESS, 18, 'FATE', 'Fate'),
  [ChainId.BSC_MAINNET]: new Token(ChainId.BSC_MAINNET, ZERO_ONE_ADDRESS, 18, 'FATE', 'Fate'),
  [ChainId.BSC_TESTNET]: new Token(ChainId.BSC_TESTNET, ZERO_ONE_ADDRESS, 18, 'FATE', 'Fate'),
  [ChainId.HARMONY_MAINNET]: new Token(
    ChainId.HARMONY_MAINNET,
    '0xB2e2650DFdb7b2DEc4a4455a375ffBfD926cE5FC',
    18,
    'FATE',
    'Fate'
  ),
  [ChainId.HARMONY_TESTNET]: new Token(
    ChainId.HARMONY_TESTNET,
    '0xB2e2650DFdb7b2DEc4a4455a375ffBfD926cE5FC',
    18,
    'FATE',
    'Fate'
  ),
  [ChainId.POLYGON_MAINNET]: new Token(
    ChainId.POLYGON_MAINNET,
    '0x4853365bC81f8270D902076892e13F27c27e7266',
    18,
    'FATE',
    'FATExFi'
  )
}

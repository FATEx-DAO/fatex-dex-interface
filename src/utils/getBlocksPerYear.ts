import { ChainId, JSBI } from '@fatex-dao/sdk'
import { BLOCKCHAIN_SETTINGS } from '@fatex-dao/sdk-extra'

export default function getBlocksPerYear(chainId: ChainId | undefined): JSBI {
  const blockchainSettings = chainId ? BLOCKCHAIN_SETTINGS[chainId] : undefined
  const blocksPerMinute =
    blockchainSettings && blockchainSettings.blockTime
      ? JSBI.divide(JSBI.BigInt(60), JSBI.BigInt(blockchainSettings.blockTime))
      : JSBI.BigInt(0)
  const blocksPerHour = JSBI.multiply(blocksPerMinute, JSBI.BigInt(60))
  const blocksPerDay = JSBI.multiply(blocksPerHour, JSBI.BigInt(24))
  const blocksPerYear = JSBI.multiply(blocksPerDay, JSBI.BigInt(365))

  return blocksPerYear
}

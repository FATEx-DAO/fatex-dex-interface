import { Blockchain } from '@fatex-dao/sdk'

// Returns the block time in seconds
export default function getBlockchainBlockTime(blockchain: Blockchain): number {
  switch (blockchain) {
    case Blockchain.BINANCE_SMART_CHAIN:
      return 3
    case Blockchain.HARMONY:
      return 2
    default:
      return 13
  }
}

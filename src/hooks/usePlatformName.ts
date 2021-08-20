import { Blockchain } from '@venomswap/sdk'
import useBlockchain from './useBlockchain'

export default function usePlatformName(): string {
  const blockchain = useBlockchain()
  switch (blockchain) {
    case Blockchain.BINANCE_SMART_CHAIN:
      return 'FATExDEX'
    case Blockchain.HARMONY:
      return 'FATExDEX'
    case Blockchain.ETHEREUM:
      return 'FATExDEX'
    default:
      return 'FATExDEX'
  }
}

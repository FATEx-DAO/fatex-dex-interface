import { Blockchain } from '@fatex-dao/sdk'
import useBlockchain from './useBlockchain'

export default function usePlatformName(): string {
  const blockchain = useBlockchain()
  switch (blockchain) {
    case Blockchain.BINANCE_SMART_CHAIN:
      return 'FATEx'
    case Blockchain.HARMONY:
      return 'FATEx'
    case Blockchain.ETHEREUM:
      return 'FATEx'
    default:
      return 'FATEx'
  }
}

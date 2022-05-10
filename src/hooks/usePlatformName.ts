import { Blockchain } from '@fatex-dao/sdk'
import useBlockchain from './useBlockchain'

export default function usePlatformName(): string {
  const blockchain = useBlockchain()
  switch (blockchain) {
    case Blockchain.BINANCE_SMART_CHAIN:
      return 'FATExFi'
    case Blockchain.HARMONY:
      return 'FATExFi'
    case Blockchain.ETHEREUM:
      return 'FATExFi'
    default:
      return 'FATExFi'
  }
}

import { Blockchain } from '@fatex-dao/sdk'
import useBlockchain from './useBlockchain'

export default function usePlatformName(): string {
  const blockchain = useBlockchain()
  switch (blockchain) {
    case Blockchain.BINANCE_SMART_CHAIN:
      return 'FATExFI'
    case Blockchain.HARMONY:
      return 'FATExFI'
    case Blockchain.ETHEREUM:
      return 'FATExFI'
    default:
      return 'FATExFI'
  }
}

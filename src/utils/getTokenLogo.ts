import { Blockchain } from '@fatex-dao/sdk'
import { BLOCKCHAIN } from '../connectors'
import viperTokenLogo from '../assets/images/viper-token-logo.png'
import cobraTokenLogo from '../assets/images/cobra-token-logo.png'

export default function getTokenLogo(): string {
  switch (BLOCKCHAIN) {
    case Blockchain.BINANCE_SMART_CHAIN:
      return cobraTokenLogo
    case Blockchain.HARMONY:
      return viperTokenLogo
    default:
      return viperTokenLogo
  }
}

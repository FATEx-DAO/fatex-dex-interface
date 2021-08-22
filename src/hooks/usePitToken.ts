import { Token } from '@fatex-dao/sdk'
import { X_FATE } from '../constants'
import { useActiveWeb3React } from './index'

export default function usePitToken(): Token | undefined {
  const { chainId } = useActiveWeb3React()
  return chainId ? X_FATE[chainId] : undefined
}

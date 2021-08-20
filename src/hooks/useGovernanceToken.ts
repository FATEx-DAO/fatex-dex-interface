import { Token } from '@fatex-dao/sdk'
import { GOVERNANCE_TOKEN } from '../constants'
import { useActiveWeb3React } from './index'

export default function useGovernanceToken(): Token | undefined {
  const { chainId } = useActiveWeb3React()
  return chainId ? GOVERNANCE_TOKEN[chainId] : undefined
}

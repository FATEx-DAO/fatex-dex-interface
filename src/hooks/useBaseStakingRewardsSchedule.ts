import { JSBI, TokenAmount } from '@fatex-dao/sdk'
// import { useSingleCallResult } from '../state/multicall/hooks'
// import { useMasterBreederContract } from './useContract'
import useGovernanceToken from './useGovernanceToken'

export default function useBaseStakingRewardsSchedule(): TokenAmount | undefined {
  const govToken = useGovernanceToken()

  // const result = useSingleCallResult(masterBreederContract, 'getNewRewardPerBlock', [0])
  const result = { loading: true, result: '0' }
  const baseRewardsPerBlock =
    govToken && result && !result.loading && result.result
      ? new TokenAmount(govToken, JSBI.BigInt(result.result))
      : undefined

  return baseRewardsPerBlock
}

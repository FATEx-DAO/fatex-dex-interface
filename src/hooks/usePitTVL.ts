import { useMemo } from 'react'
import { TokenAmount, Fraction } from '@venomswap/sdk'
import { useTokenBalance } from '../state/wallet/hooks'
import useBUSDPrice from './useBUSDPrice'
import usePitToken from './usePitToken'
import { FATE_TOKEN_INTERFACE } from '../constants/abis/governanceToken'
import useGovernanceToken from 'hooks/useGovernanceToken'

export default function usePitTVL(): Fraction | undefined {
  const govToken = useGovernanceToken()
  const govTokenBusdPrice = useBUSDPrice(govToken)
  const pit = usePitToken()
  const pitGovTokenBalance: TokenAmount | undefined = useTokenBalance(
    pit && pit.address,
    govToken,
    'balanceOf',
    FATE_TOKEN_INTERFACE
  )

  return useMemo(() => {
    return govTokenBusdPrice ? pitGovTokenBalance?.multiply(govTokenBusdPrice?.raw) : undefined
  }, [govToken, govTokenBusdPrice, pit, pitGovTokenBalance])
}

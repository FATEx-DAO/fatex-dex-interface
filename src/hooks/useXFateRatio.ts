import { useMemo } from 'react'
import { Fraction } from '@fatex-dao/sdk'

import { utils } from 'ethers'
import useXFateToken from './useXFateToken'
import { useTokenBalance } from '../state/wallet/hooks'
import useGovernanceToken from 'hooks/useGovernanceToken'
import { useTotalSupply } from '../data/TotalSupply'

const multiplier = utils.parseEther('1').toString()

export default function useXFateRatio(): Fraction | undefined {
  const govToken = useGovernanceToken()
  const xFate = useXFateToken()
  const xFateTotalSupply = useTotalSupply(xFate)
  const xFateGovTokenBalance = useTokenBalance(xFate?.address, govToken)

  return useMemo(() => {
    if (xFateTotalSupply?.equalTo('0')) {
      return new Fraction('1')
    } else {
      return xFateGovTokenBalance && xFateTotalSupply
        ? xFateGovTokenBalance?.divide(xFateTotalSupply?.raw.toString()).multiply(multiplier)
        : undefined
    }
  }, [xFateTotalSupply, xFateGovTokenBalance])
}

import { TokenAmount, JSBI, ChainId, Fraction } from '@fatex-dao/sdk'
import { TransactionResponse } from '@ethersproject/providers'
import { useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { useMerkleDistributorContract } from '../../hooks/useContract'
import { useSingleCallResult } from '../multicall/hooks'
import { calculateGasMargin, isAddress } from '../../utils'
import { useTransactionAdder } from '../transactions/hooks'
import useGovernanceToken from '../../hooks/useGovernanceToken'
import useCurrentBlockTimestamp from '../../hooks/useCurrentBlockTimestamp'
import { MERKLE_DISTRIBUTOR_PROOF_URL } from '../../constants'

interface UserClaimData {
  index: number
  amount: string
  proof: string[]
  flags?: {
    isSOCKS: boolean
    isLP: boolean
    isUser: boolean
  }
}

const CLAIM_PROMISES: { [key: string]: Promise<UserClaimData | null> } = {}

// returns the claim for the given address, or null if not valid
function fetchClaim(account: string, chainId: ChainId): Promise<UserClaimData | null> {
  const formatted = isAddress(account)
  if (!formatted) return Promise.reject(new Error('Invalid address'))
  const key = `${chainId}:${account}`

  return (CLAIM_PROMISES[key] =
    CLAIM_PROMISES[key] ??
    fetch(MERKLE_DISTRIBUTOR_PROOF_URL)
      .then(res => {
        if (res.status === 200) {
          return res.json()
        } else {
          console.debug(`No claim for account ${formatted} on chain ID ${chainId}`)
          return null
        }
      })
      .then(json => json[account])
      .catch(error => {
        console.error('Failed to get claim data', error)
      }))
}

// parse distributorContract blob and detect if user has claim data
// null means we know it does not
export function useUserClaimData(account: string | null | undefined): UserClaimData | null | undefined {
  const { chainId } = useActiveWeb3React()

  const key = `${chainId}:${account}`
  const [claimInfo, setClaimInfo] = useState<{ [key: string]: UserClaimData | null }>({})

  useEffect(() => {
    if (!account || !chainId) {
      return
    }

    fetchClaim(account, chainId).then(accountClaimInfo =>
      setClaimInfo(claimInfo => {
        return {
          ...claimInfo,
          [key]: accountClaimInfo
        }
      })
    )
  }, [account, chainId, key])

  return account && chainId ? claimInfo[key] : undefined
}

// check if user is in blob and has not yet claimed UNI
export function useUserHasAvailableClaim(account: string | null | undefined): boolean {
  const userClaimData = useUserClaimData(account)
  const distributorContract = useMerkleDistributorContract()
  const currentTimestamp = useCurrentBlockTimestamp()
  const startTimestamp = useSingleCallResult(distributorContract, 'startTimestamp', [])
  // user is in blob and contract marks as unclaimed
  return Boolean(
    userClaimData &&
      !startTimestamp.loading &&
      startTimestamp.result &&
      new Fraction(startTimestamp.result?.[0].toString())?.lessThan(currentTimestamp.toString())
  )
}

export function useUserUnclaimedAmount(account: string | null | undefined): TokenAmount | undefined {
  const userClaimData = useUserClaimData(account)
  // const canClaim = useUserHasAvailableClaim(account)
  const canClaim = true

  const govToken = useGovernanceToken()
  if (!govToken) return undefined
  if (!canClaim || !userClaimData) {
    return new TokenAmount(govToken, JSBI.BigInt(0))
  }
  return new TokenAmount(govToken, JSBI.BigInt(userClaimData.amount))
}

export function useClaimCallback(
  account: string | null | undefined
): {
  claimCallback: () => Promise<string>
} {
  // get claim data for this account
  const { library, chainId } = useActiveWeb3React()
  const govToken = useGovernanceToken()
  const claimData = useUserClaimData(account)

  // used for popup summary
  const addTransaction = useTransactionAdder()
  const distributorContract = useMerkleDistributorContract()

  const claimCallback = async function() {
    if (!claimData || !account || !library || !chainId || !distributorContract) return

    const args = [claimData.index, account, claimData.amount, claimData.proof]

    return distributorContract.estimateGas['claim'](...args, {}).then(estimatedGasLimit => {
      return distributorContract
        .claim(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Claimed ${govToken?.symbol}`,
            claim: { recipient: account }
          })
          return response.hash
        })
    })
  }

  return { claimCallback }
}

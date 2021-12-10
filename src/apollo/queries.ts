import gql from 'graphql-tag'

export const lockedRewardsByPool = gql`
  query lockedRewardsByPool($account: String, $epoch: Int, $blockNumber: Int) {
    userEpochTotalLockedRewardByPools(
      block: { number: $blockNumber }
      where: { user: $account, epoch: $epoch }
      orderBy: poolId
      orderDirection: asc
    ) {
      poolId
      amountFate
      amountUSD
    }
  }
`

export const proposalDescriptions = gql`
  query latestProposals {
    proposals(orderBy: id, orderDirection: desc) {
      id
      description
      targets
      signatures
      calldatas
      values
    }
  }
`

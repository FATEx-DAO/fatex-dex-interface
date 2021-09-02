import gql from 'graphql-tag'

export const lockedRewardsByPool = gql`
  query lockedRewardsByPool($account: String) {
    userEpoch0TotalLockedRewardByPools(where: { user: $account }, orderBy: poolId, orderDirection: asc) {
      poolId
      amountFate
      amountUSD
    }
  }
`

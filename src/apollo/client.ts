import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://sushi.graph.t.hmny.io/subgraphs/name/fatex-dao/fatex-dao-rewards'
  }),
  cache: new InMemoryCache()
})

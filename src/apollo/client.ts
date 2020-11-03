import { ApolloClient } from '@apollo/client'
import { cache } from './cache'

export const client = new ApolloClient({
  credentials: 'include',
  cache,
  connectToDevTools: process.env.NODE_ENV !== 'production',
  uri: process.env.REACT_APP_GRAPHQL_API,
})

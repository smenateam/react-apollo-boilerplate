import * as Apollo from '@apollo/client'
import { ApolloError } from '@apollo/client'
import { redirectHandler } from 'src/services/redirectWhenError'
import { sentryCaptureError } from 'src/vendor/sentry/captureErrors'
import {
  QueryHookOptions,
  MutationHookOptions,
  LazyQueryHookOptions,
  Variables,
} from './hooks.types'
import { getErrorFromResponse } from './utils'

export * from '@apollo/client'

export function useQuery<TData = unknown, TVariables = Apollo.OperationVariables>(
  query: Apollo.DocumentNode,
  options?: QueryHookOptions<TData, TVariables>
): Apollo.QueryResult<TData, TVariables> {
  return Apollo.useQuery<TData, TVariables>(query, {
    ...options,
    onCompleted: data => {
      const error = getErrorFromResponse(data)

      if (error?.__typename) {
        redirectHandler.createPath({ name: error.__typename, meta: error.message })
      }

      if (options?.onCompleted) options.onCompleted(data)
    },
    onError: (error: ApolloError) => {
      const variables = options?.variables as Variables
      sentryCaptureError({ error, variables, operation: query })
      if (options?.onError) options.onError(error)
    },
  })
}

export function useLazyQuery<TData = unknown, TVariables = Apollo.OperationVariables>(
  query: Apollo.DocumentNode,
  options?: LazyQueryHookOptions<TData, TVariables>
): Apollo.QueryTuple<TData, TVariables> {
  return Apollo.useLazyQuery<TData, TVariables>(query, {
    ...options,
    onCompleted: data => {
      const error = getErrorFromResponse(data)

      if (error?.__typename) {
        redirectHandler.createPath({ name: error.__typename, meta: error.message })
      }

      if (options?.onCompleted) options.onCompleted(data)
    },
    onError: (error: ApolloError) => {
      const variables = options?.variables as Variables
      sentryCaptureError({ error, variables, operation: query })
      if (options?.onError) options.onError(error)
    },
  })
}

export function useMutation<TData = unknown, TVariables = Apollo.OperationVariables>(
  mutation: Apollo.DocumentNode,
  options?: MutationHookOptions<TData, TVariables>
): Apollo.MutationTuple<TData, TVariables> {
  return Apollo.useMutation<TData, TVariables>(mutation, {
    ...options,
    onCompleted: data => {
      const error = getErrorFromResponse(data)

      if (error?.__typename) {
        redirectHandler.createPath({ name: error.__typename, meta: error.message })
      }

      if (options?.onCompleted) options.onCompleted(data)
    },
    onError: (error: ApolloError) => {
      const variables = options?.variables as Variables
      sentryCaptureError({ error, variables, operation: mutation })

      if (options?.onError) options.onError(error)
    },
  })
}

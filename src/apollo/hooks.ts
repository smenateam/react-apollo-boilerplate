import * as Apollo from '@apollo/client'
import { ApolloError } from '@apollo/client'
import { sentryCaptureError } from 'src/sentry/captureErrors'
import {
  QueryHookOptions,
  MutationHookOptions,
  LazyQueryHookOptions,
  Variables,
} from './hooks.types'

export * from '@apollo/client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useQuery<TData = any, TVariables = Apollo.OperationVariables>(
  query: Apollo.DocumentNode,
  options?: QueryHookOptions<TData, TVariables>
): Apollo.QueryResult<TData, TVariables> {
  return Apollo.useQuery<TData, TVariables>(query, {
    ...options,
    onCompleted: (data: TData) => {
      if (options?.onCompleted) options.onCompleted(data)
    },
    onError: (error: ApolloError) => {
      const variables = options?.variables as Variables
      sentryCaptureError({ error, variables, operation: query })

      if (options?.onError) options.onError(error)
    },
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useLazyQuery<TData = any, TVariables = Apollo.OperationVariables>(
  query: Apollo.DocumentNode,
  options?: LazyQueryHookOptions<TData, TVariables>
): Apollo.QueryTuple<TData, TVariables> {
  return Apollo.useLazyQuery<TData, TVariables>(query, {
    ...options,
    onCompleted: (data: TData) => {
      if (options?.onCompleted) options.onCompleted(data)
    },
    onError: (error: ApolloError) => {
      const variables = options?.variables as Variables
      sentryCaptureError({ error, variables, operation: query })

      if (options?.onError) options.onError(error)
    },
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useMutation<TData = any, TVariables = Apollo.OperationVariables>(
  mutation: Apollo.DocumentNode,
  options?: MutationHookOptions<TData, TVariables>
): Apollo.MutationTuple<TData, TVariables> {
  return Apollo.useMutation<TData, TVariables>(mutation, {
    ...options,
    onCompleted: (data: TData) => {
      if (options?.onCompleted) options.onCompleted(data)
    },
    onError: (error: ApolloError) => {
      const variables = options?.variables as Variables
      sentryCaptureError({ error, variables, operation: mutation })

      if (options?.onError) options.onError(error)
    },
  })
}

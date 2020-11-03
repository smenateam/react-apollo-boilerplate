import * as Apollo from '@apollo/client'
import { ApolloError, OperationVariables } from '@apollo/client'

export type LazyQueryHookOptions<TData, TVariables> = Apollo.LazyQueryHookOptions<
  TData,
  TVariables
> & {
  errorHandler?: Function
}

export type MutationHookOptions<TData, TVariables> = Apollo.MutationHookOptions<
  TData,
  TVariables
> & {
  errorHandler?: Function
}

export type QueryHookOptions<TData, TVariables> = Apollo.QueryHookOptions<TData, TVariables> & {
  errorHandler?: Function
}

export type Variables = OperationVariables | undefined

export type NetworkError = null | ApolloError

import { DocumentNode } from 'graphql'
import { NetworkError, Variables } from 'src/apollo/hooks.types'

export type SentryCaptureError = {
  error: NetworkError
  variables: Variables
  operation: DocumentNode
}

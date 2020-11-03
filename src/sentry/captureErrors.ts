import * as Sentry from '@sentry/react'
import { dissoc } from 'ramda'
import { SentryCaptureError } from './captureErrors.types'
import { getFormatedActivity, createTagsFromResponse } from './utils'

export const sentryCaptureError = ({
  error,
  variables = {},
  operation,
}: SentryCaptureError): void => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.error(error)
  }

  /**
   * Для тега activity берем операцию (query или mutation)
   * и название запроса, например
   */
  const activity = getFormatedActivity(operation)

  /**
   * Создаем теги для sentry из полученных полей
   * всех кроме __typename
   */
  const tags = createTagsFromResponse({})
  // Удаляем пароль
  const getExtra = (): {} => (variables?.password ? dissoc('password', variables) : variables)

  const captureContext = {
    extra: getExtra(),
    tags: { ACTIVITY: activity?.toString() ?? '', ...tags },
  }

  Sentry.captureException(error, captureContext)
}

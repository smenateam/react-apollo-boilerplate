// TODO: Добавить типы ошибок доступа ( AuthenticationError | AccessDeniedError )
type BusinessLogicError = null | { message: string, __typename: string }

export const getErrorFromResponse = (response: unknown): BusinessLogicError => {
  /**
   * Получает каждый ответ с сервера
   * смотрит есть ли там поле error
   * если есть возвращает error
   * если нет то null
   */
  let objectWithError = { error: null }
  JSON.stringify(response, (_, nestedValue) => {
    if (nestedValue && nestedValue.error) {
      objectWithError = nestedValue
    }
    return nestedValue
  })
  return objectWithError?.error
}

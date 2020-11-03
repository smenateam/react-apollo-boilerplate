// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BusinessLogicError = any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorFromResponse = (response: any): BusinessLogicError => {
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

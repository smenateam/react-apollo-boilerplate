import { DocumentNode, OperationDefinitionNode } from 'graphql'
import { concat } from 'ramda'

const snakeCase = (str: string): string =>
  str.replace(/([A-Z])/g, x => concat('_', x.toLowerCase()))

export const getFormatedActivity = (gqlOperation: DocumentNode): string | null => {
  /**
   * Вытаскикаем тип операции и имя операции
   * в массиве definitions первым объектом идет сама операция т.е. query или mutation
   * все остальные элементы это как правило fragments
   */
  const defenition = gqlOperation?.definitions[0] as OperationDefinitionNode
  if (!defenition || !defenition?.name?.value) return null

  const operationType = defenition.operation
  const operationName = snakeCase(defenition.name.value)

  return `${operationType}_${operationName}`.toUpperCase()
}

interface PlainObject {
  [key: string]: string | PlainObject
}
export const createTagsFromResponse = (response = {}): PlainObject => {
  const tags = {} as PlainObject

  /**
   * Рекурсивно пробегаем по объекту ответа
   * и создаем объекты вида {SHIFT_STATE: open}
   */
  const mapResponseToTags = (obj: PlainObject): void => {
    if (!obj) return
    Object.keys(obj).forEach((key: string) => {
      if (key === '__typename') return
      if (typeof obj[key] === 'object') {
        mapResponseToTags(obj[key] as PlainObject)
      } else {
        const tagName = `${obj.__typename}_${key}`.toUpperCase()
        tags[tagName] = obj[key]
      }
    })
  }
  mapResponseToTags(response)
  return tags
}

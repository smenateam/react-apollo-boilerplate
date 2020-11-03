# Graphql

## Клиент

В качестве клиента используется Apollo. 

Конфигурация находится в [файле](src/ApolloClient.ts)

## Инструменты разработки

### GraphQL CLI

В инфраструктуре GraphQL есть много удобных инструментов и каждый из них со своей конфигурацией и способом запуска, для того чтобы был единый API в проекте используется [GraphQL CLI](https://github.com/Urigo/graphql-cli). 

Конфигурация находится в [файле](.graphqlrc.yml)

Так же добавлены скрипты в package.json, которые позволяют пробросить .env при запуске команд GraphQL CLI с нужным урлом до сервера со схемой

#### Доступные скрипты
##### Кодогененрация
Запускает генерацию кода по схеме с помощью [GraphQL Code Generator](https://github.com/dotansimha/graphql-code-generator)

```bash
npm run graphql:codegen

npm run graphql:codegen:watch
```

##### Покрытие 
Считает как часто используется каждый тип и каждое поле с помощью [GraphQL Inspector](https://graphql-inspector.com/docs/essentials/coverage)

```bash
npm run graphql:coverage
```

##### Валидация
Валидирует все graphql документы на соответствие со схемой [GraphQL Inspector](https://graphql-inspector.com/docs/essentials/validate)

```bash
npm run graphql:validate
```

##### Интроспекция
Интроспектирует схему на сервере и создаёт локально файл со схемой на SDL или в json с помощью [GraphQL Inspector](https://graphql-inspector.com/docs/essentials/introspect)

```bash
npm run graphql:introspect
```

##### Линтинг
Линтит все graphql документы на соответствие со схемой с помощью [плагина для eslint](https://github.com/apollographql/eslint-plugin-graphql)

Для этого скрипта есть отдельный [конфиг для eslint](.eslintrc.graphql.js)

Скрипт состоит из двух частей:

1. graphql:lint:introspect - интроспекция схемы
2. graphql:lint:lint - линтинг


```bash
npm run graphql:lint 
```

### VSCode
Поддержка GraphQL реализуется с помощью [плагина GraphQL](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)

Конфигурация плагина находится в [файле](.graphqlrc.yml) в разделе `endpoints`

### Pycharm/Webstorm

Поддержка GraphQL реализуется с помощью [плагина JS GraphQL](https://plugins.jetbrains.com/plugin/8097-js-graphql)

Конфигурация плагина находится в отдельном [файле](.graphqlconfig) потому что плагин не поддерживает [graphql-config](https://graphql-config.com/introduction) версии 3. Когда добавят поддержку можно будет перевести на общий [файл](.graphqlrc.yml)


## Генерация кода
Генератор кода из конфига `./codegen.yml` узнает что ему нужно смотреть в папку `./src/graphql/**/*.ts` находит gql схемы, берет имя и тело схемы и создает [свои хуки](https://ru.reactjs.org/docs/hooks-custom.html) кладет их в папку `./src/__generated__`. К имени хука добавляет префикс 'use', а из тела схемы делает параметр для запроса. В итоге получается array с двумя элементами. первый элемент [apollo хук](https://www.apollographql.com/docs/react/api/react/hooks/), а второй объект с полями `js {data, loading, error}`.

<hr/>

### Пример работы

Создаем мутацию login

```graphql
# ./src/graphql/userLogout.graphql - Имя для модуля берем из graphiql
mutation userLogin($username: String!, $password: String!) {
  # Имя хука будет создано из имени мутации
  user {
    login(payload: { username: $username, password: $password }) {
      status
    }
  }
}
```

Генератор кода автоматически создает хук useUserLogin и проставляем для него типы

```tsx
/**

 * __useUserLogin__
 *
 * To run a mutation, you first call `__useUserLogin__` within a React component and pass it any options that fit your needs.
 * When your component renders, `__useUserLogin__` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [user, { data, loading, error }] = __useUserLogin__({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */

export function useUserLogin(baseOptions?: Apollo.MutationHookOptions<IUser, IUserVariables>) {
  return Apollo.useMutation<IUser, IUserVariables>(UserDocument, baseOptions)
}
```

Импортируем полученный хук и тип ответа в компоненте

```tsx
// ./src/components/Login/Login.tsx

import { ILoginPayload, useUserLogin } from '../../__generated__'

export const LoginForm = () => {
  // Хук должен находится внутри тела компонента
  const [login, { data, error, loading }] = useUserLogin()
  // в useUserLogin({ username, password }) при создании хука можно добавить аргументы для запроса на backend

  const handleLogin = async (payload: ILoginPayload) => {
    const { data } = await login(payload)
  }

  return (
    // ...
    <button onClick={() => handleLogin(payload)}></button>
  )
}
```

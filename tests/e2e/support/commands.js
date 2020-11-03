// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

let mocks = {}
let requests = {}
let responses = {}
let countRoutes = 0

Cypress.Commands.add('clearMocks', () => {
  mocks = {}
  requests = {}
  responses = {}
  countRoutes = 0
})

// мокает ответы для graphql запросов
// принимает на вход объект вида {operationName: {fixture: json}, operationName: {}}
Cypress.Commands.add('addMocks', (operations) => {
  mocks = { ...mocks, ...operations }

  cy.route2('/graphql', req => {
    if (!req.body) return

    countRoutes += 1
    const body = JSON.parse(req.body)
    const { operationName } = body
    requests[operationName] = req

    req.reply(res => {
      responses[operationName] = res

      if (mocks[operationName]?.fixture) {
        res.send({
          fixture: mocks[operationName].fixture,
        })
      }
    })
  }).as('route')
})

// получает тело запроса
Cypress.Commands.add('getRequest', (operationName) => {
  // cy.waitRoutes()
  return JSON.parse(requests[operationName].body)
})

// получает тело ответа
Cypress.Commands.add('getResponse', (operationName) => {
  return JSON.parse(responses[operationName].body)
})

// ожидает ответа всех запросов на момент вызова
// принимает на вход необязательные параметры
// count - число для возможных запросов после
// countAll - число для всех ожидаемых запросов
Cypress.Commands.add('waitRoutes', (count = 0, countAll = 0) => {
  const cuttentCount = countAll || countRoutes + count
  const arrayRoute = new Array(cuttentCount).fill('@route')
  countRoutes -= cuttentCount

  if (!arrayRoute.length) return 
  cy.wait(100)
  cy.wait(arrayRoute, { requestTimeout: 20000 })
  cy.wait(100)
})
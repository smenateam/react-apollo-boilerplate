import { renderHook } from '@testing-library/react-hooks'
import { createMemoryHistory } from 'history'
import React, { ReactElement } from 'react'
import { Router } from 'react-router-dom'
import { redirectHandler, RedirectWhenError } from '../index'

describe('services > RedirectWhenError', () => {
  it('RedirectHandler создает путь до /login', () => {
    redirectHandler.createPath({ name: 'AuthenticationError', meta: 'meta' })
    expect(redirectHandler.path).toEqual({ to: '/login', meta: 'meta', shouldRedirect: true })
  })

  it('RedirectHandler создает путь до /error', () => {
    redirectHandler.createPath({ name: 'AccessDeniedError', meta: 'keta' })
    expect(redirectHandler.path).toEqual({ to: '/error', meta: 'keta', shouldRedirect: true })
  })

  it('RedirectWhenError перенаправляет при изменении пути', () => {
    type Children = {
      children: ReactElement
    }
    const history = createMemoryHistory()
    const wrapper = ({ children }: Children) => <Router history={history}>{children}</Router>
    history.push('/')

    redirectHandler.createPath({ name: 'AuthenticationError', meta: 'meta' })

    renderHook(() => RedirectWhenError(), { wrapper })
    expect(history.location.pathname).toEqual('/login')
  })
})

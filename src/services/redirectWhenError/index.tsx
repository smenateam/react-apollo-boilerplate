import { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router'
import useObserver from 'pojo-observer'

type Path = {
  to: string
  meta: string
  shouldRedirect: boolean
}

type CreatePathArg = {
  meta: string
  name: string
}

interface RedirectHandlerInterface {
  path: Path
}

class RedirectHandler implements RedirectHandlerInterface {
  public path = {
    to: '',
    meta: '',
    shouldRedirect: false,
  }

  createPath({ name, meta = '' }: CreatePathArg) {
    if (name === 'AuthenticationError') {
      this.path = {
        shouldRedirect: true,
        to: '/login',
        meta,
      }
    }

    if (name === 'AccessDeniedError') {
      this.path = {
        shouldRedirect: true,
        to: '/error',
        meta,
      }
    }
  }

  resetPath() {
    this.path = {
      to: '',
      meta: '',
      shouldRedirect: false,
    }
  }
}

export const redirectHandler = new RedirectHandler()

export const RedirectWhenError = () => {
  const history = useHistory()
  const location = useLocation()
  const { path } = redirectHandler
  useObserver(redirectHandler)

  useEffect(() => {
    if (path?.shouldRedirect) {
      history.push(path.to, {
        from: location.pathname,
        meta: path.meta,
      })
      redirectHandler.resetPath()
    }
  }, [path, location.pathname, history])
  return null
}

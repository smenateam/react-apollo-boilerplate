import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

// Парсим из .env настройку для принудительной активации Sentry, нужно для dev-окружения
const ENFORCE_SENTRY =
  process.env.REACT_APP_ENFORCE_SENTRY !== undefined
    ? JSON.parse(process.env.REACT_APP_ENFORCE_SENTRY.toLowerCase())
    : false

function getSentryRelease(): string {
  // К релизам в sentry привязываются артефакты (js, ts,  файлы) чтобы не
  // перетирать артефакты release-окружения, добавляем имя окружения в релиз sentry
  return process.env.REACT_APP_ENVIRONMENT === 'release'
    ? `${process.env.REACT_APP_SENTRY_RELEASE}`
    : `${process.env.REACT_APP_SENTRY_RELEASE}-${process.env.REACT_APP_ENVIRONMENT}`
}

export default function initSentry(): void {
  if (process.env.NODE_ENV === 'production' || ENFORCE_SENTRY) {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      environment: process.env.REACT_APP_ENVIRONMENT,
      release: getSentryRelease(),
      integrations: [
        // https://docs.sentry.io/platforms/javascript/#adding-integration-from-sentryintegrations
        new Integrations.BrowserTracing(),
      ],
    })
  }
}

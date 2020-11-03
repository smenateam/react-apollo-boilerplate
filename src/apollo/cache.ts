import { InMemoryCache } from '@apollo/client'

const cacheConfig = {}

export const cache = new InMemoryCache(cacheConfig)

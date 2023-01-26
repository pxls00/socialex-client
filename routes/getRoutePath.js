import appRoutes from './appRoutes'

const routes = {
  ...appRoutes,
}

export function getRoutePath(path, ...additionalArgs) {
  const route = routes[path]

  if (typeof route === 'function') {
    return route(...additionalArgs)
  }

  return route
}

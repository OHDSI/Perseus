interface Env {
  server: string,
  dbServer: string
}

/**
 * @deprecated environment.ts value or current host is used
 */
export function getGlobalEnv(): Env {
  const env = window['env']
  return env ? env as Env : null
}

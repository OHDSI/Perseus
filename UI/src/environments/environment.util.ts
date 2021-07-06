interface Env {
  server: string,
  dbServer: string
}

export function getGlobalEnv(): Env {
  const env = window['env']
  return env ? env as Env : null
}

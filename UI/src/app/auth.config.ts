import { isDev, serverUrl } from '@app/app.constants'
import { AuthConfig } from 'angular-oauth2-oidc'

const env = window['envMpAYvc8QMp']

export const authConfig: AuthConfig = {
  issuer: `https://login.microsoftonline.com/${env?.tenantId}/v2.0`,
  redirectUri: `${serverUrl}`,
  clientId: env?.clientId,
  responseType: 'code',
  strictDiscoveryDocumentValidation: false,
  scope: `api://${env?.clientId}/app`,
  tokenEndpoint: `https://login.microsoftonline.com/${env?.tenantId}/oauth2/v2.0/token`,
  showDebugInformation: isDev
}

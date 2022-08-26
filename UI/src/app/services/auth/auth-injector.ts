import { JwtAuthService } from './jwt-auth.service';
import { AzureAuthService } from '@services/auth/azure-auth.service'
import { AuthStrategies } from '../../../environments/auth-strategies'
import { FakeAuthService } from '@services/auth/fake-auth.service'


export const authServiceClass = (strategy: AuthStrategies) => {
  switch (strategy) {
    case AuthStrategies.AAD:
      return AzureAuthService
    case AuthStrategies.SMTP:
      return JwtAuthService
    case AuthStrategies.FAKE:
      return FakeAuthService
    default:
      throw new Error('Unsupported auth strategy')
  }
}

export const authInjector = 'AuthService'

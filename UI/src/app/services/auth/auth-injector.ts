import { JwtAuthService } from './jwt-auth.service';
import { authStrategy } from '@app/app.constants'
import { AddAuthService } from '@services/auth/add-auth.service'
import { AuthStrategies } from '../../../environments/auth-strategies'
import { FakeAuthService } from '@services/auth/fake-auth.service'


const initAuthInjector = (strategy: AuthStrategies) => {
  switch (strategy) {
    case AuthStrategies.ADD:
      return AddAuthService
    case AuthStrategies.SMTP:
      return JwtAuthService
    case AuthStrategies.FAKE:
      return FakeAuthService
    default:
      throw new Error('Unsupported auth strategy')
  }
}
export const authInjector = initAuthInjector(authStrategy)

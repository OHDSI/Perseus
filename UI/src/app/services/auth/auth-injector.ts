import { JwtAuthService } from './jwt-auth.service';
import { isAddAuth } from '@app/app.constants'
import { AddAuthService } from '@services/auth/add-auth.service'

export const authInjector = isAddAuth ? AddAuthService : JwtAuthService

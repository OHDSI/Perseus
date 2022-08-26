import { Routes } from '@angular/router'
import { SignOutComponent } from '@app/auth/sign-out/sign-out.component'
import { RecoverPasswordComponent } from '@app/auth/recover-password/recover-password.component'
import { ResetPasswordGuard } from '@guards/auth/reset-password.guard'
import { ResetPasswordComponent } from '@app/auth/reset-password/reset-password.component'
import { AlreadyRegisteredGuard } from '@guards/auth/already-registered.guard'
import { AlreadyRegisteredComponent } from '@app/auth/already-registered/already-registered.component'
import { LinkExpiredGuard } from '@guards/auth/link-expired.guard'
import { LinkExpiredComponent } from '@app/auth/link-expired/link-expired.component'
import { isAddAuth } from '@app/app.constants'

export function getSmtpUrls(): Routes {
  if (isAddAuth) {
    return []
  } else {
    return [
      {
        path: 'sign-out',
        component: SignOutComponent
      },
      {
        path: 'recover-password',
        component: RecoverPasswordComponent
      },
      {
        path: 'reset-password',
        canActivate: [ResetPasswordGuard],
        component: ResetPasswordComponent
      },
      {
        path: 'already-registered',
        canActivate: [AlreadyRegisteredGuard],
        component: AlreadyRegisteredComponent
      },
      {
        path: 'link-expired',
        canActivate: [LinkExpiredGuard],
        component: LinkExpiredComponent
      }
    ]
  }
}

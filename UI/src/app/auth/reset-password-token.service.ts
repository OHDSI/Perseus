import { Injectable } from '@angular/core';

@Injectable()
export class ResetPasswordTokenService {
  private resetPasswordToken: string

  get token(): string {
    return this.resetPasswordToken
  }

  set token(token: string) {
    this.resetPasswordToken = token
  }
}


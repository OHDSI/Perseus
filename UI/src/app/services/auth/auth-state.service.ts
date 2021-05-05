import { Injectable } from '@angular/core';

/*
* Store reset password token,
* Already registered email,
* Expired Link type.
 */
@Injectable()
export class AuthStateService {
  private authState: any

  get state(): string {
    return this.authState
  }

  set state(state: string) {
    this.authState = state
  }
}


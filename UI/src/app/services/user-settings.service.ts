import { Injectable } from '@angular/core';

@Injectable()
export class UserSettings {
  get showQuestionButtons(): boolean {
    return true;
  }
}

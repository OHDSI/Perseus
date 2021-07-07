import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-error-message',
  templateUrl: './auth-error-message.component.html',
  styleUrls: ['./auth-error-message.component.scss']
})
export class AuthErrorMessageComponent {

  @Input()
  message: string;
}

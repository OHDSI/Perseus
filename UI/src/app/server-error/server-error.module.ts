import { NgModule } from '@angular/core';
import { ServerErrorPopupComponent } from './server-error-popup/server-error-popup.component';
import { ServerErrorComponent } from './server-error.component';
import { SharedModule } from '@shared/shared.module';
import { ServerErrorIconComponent } from './server-error-icon/server-error-icon.component';
import { ServerNotRespondingPopupComponent } from './server-not-responding-popup/server-not-responding-popup.component';

@NgModule({
  declarations: [
    ServerErrorPopupComponent,
    ServerErrorComponent,
    ServerErrorIconComponent,
    ServerNotRespondingPopupComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ServerErrorModule {
  static getComponent() {
    return ServerErrorComponent
  }
}

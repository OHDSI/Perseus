import { Injectable } from '@angular/core';
import { CdmBuilderWebsocketService } from './cdm-builder/cdm-builder-websocket.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketConfigurationService {

  name = CdmBuilderWebsocketService.name;

  get serviceName() {
    return this.name;
  }

  set serviceName(name: string) {
    this.name = name;
  }
}

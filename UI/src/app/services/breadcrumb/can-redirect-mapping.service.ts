import { Injectable, Optional } from '@angular/core';
import { CanRedirectService } from '@services/breadcrumb/can-redirect.service';
import { StoreService } from '@services/store.service';

@Injectable({
  providedIn: 'root'
})
export class CanRedirectMappingService implements CanRedirectService {
  constructor(@Optional() private storeService: StoreService) { }

  breadcrumbLabel(): string {
    return 'Link Fields';
  }

  canRedirect(): boolean {
    return Object.keys(this.storeService?.state.targetConfig).length !== 0
  }
}

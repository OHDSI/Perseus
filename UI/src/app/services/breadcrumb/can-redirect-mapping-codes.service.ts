import { Injectable, Optional } from '@angular/core';
import { CanRedirectService } from './can-redirect.service';
import { ImportCodesService } from '../usagi/import-codes.service';

@Injectable()
export class CanRedirectMappingCodesService implements CanRedirectService {

  constructor(@Optional() private importCodesService: ImportCodesService) { }

  breadcrumbLabel(): string {
    return 'Mapping codes';
  }

  canRedirect(): boolean {
    return this.importCodesService?.codeMappings?.length > 0
  }
}

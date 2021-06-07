import { Inject, Injectable } from '@angular/core';
import { CanRedirectService } from './can-redirect.service';
import { IBreadCrumb } from '@app/toolbar/breadcrumb/breadcrump.component';

@Injectable()
export class BreadcrumbService {

  constructor(@Inject(CanRedirectService) private canRedirectServices: CanRedirectService[]) {
  }

  filterBreadcrumbs(breadcrumbs: IBreadCrumb[]) {
    return breadcrumbs.filter(b => {
      const service = this.canRedirectServices.find(s => s.breadcrumbLabel() === b.label)
      return service ? service.canRedirect() : true
    })
  }
}

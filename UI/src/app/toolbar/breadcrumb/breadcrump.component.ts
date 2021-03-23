import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter } from 'rxjs/operators';

export interface IBreadCrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  public breadcrumbs: IBreadCrumb[] = [];

  private readonly singleBreadcrumbLabels = ['Link Tables', 'Import codes'];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.firstChild);
  }

  ngOnInit() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd), distinctUntilChanged())
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute, this.router.url, this.breadcrumbs);
      });
  }

  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadCrumb[] = []): IBreadCrumb[] {
    const label = route.routeConfig?.data?.breadcrumb;
    const path = route.routeConfig?.data ? route.routeConfig.path : null;

    const nextUrl = path ? `${url}/${path}` : url;

    const existedBreadcrumb = this.breadcrumbs?.find(item =>
      item.label === label && item.url === nextUrl
    );

    if (existedBreadcrumb) {
      return [existedBreadcrumb];
    }

    const breadcrumb: IBreadCrumb = {
        label,
        url: nextUrl,
    };

    if (this.breadcrumbs.length === 0 && label === 'Link Fields') {
      return;
    }

    const getBreadCrumbs = () => this.singleBreadcrumbLabels.includes(label) ? [] : breadcrumbs

    const newBreadcrumbs = breadcrumb.label ? [ ...getBreadCrumbs(), breadcrumb ] : [ ...breadcrumbs];

    if (route.firstChild) {
        return this.buildBreadCrumb(route.firstChild, this.router.url, newBreadcrumbs);
    }

    return newBreadcrumbs;
  }
}

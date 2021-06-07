import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter, startWith, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@shared/base/base.component';
import { BreadcrumbService } from '@services/breadcrumb/breadcrumb.service';

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
export class BreadcrumbComponent extends BaseComponent implements OnInit {

  public breadcrumbs: IBreadCrumb[] = []

  public currentUrl: string

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private breadcrumbService: BreadcrumbService) {
    super()
  }

  ngOnInit() {
    this.router.events
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(event => event instanceof NavigationEnd),
        startWith<NavigationEnd, NavigationEnd>(null),
        distinctUntilChanged()
      )
      .subscribe(event => {
        this.currentUrl = event?.url
        this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute, this.breadcrumbs)
      });
  }

  private buildBreadCrumb(route: ActivatedRoute, breadcrumbs: IBreadCrumb[] = [], url = '/perseus'): IBreadCrumb[] {
    const label = route.routeConfig?.data?.breadcrumb
    const path = route.routeConfig?.path
    const nextUrl = path ? `${url}/${path}` : url

    const newBreadcrumbs = label ? [...breadcrumbs.filter(it => it.label !== label), {label, url: nextUrl}] : [...breadcrumbs]

    if (route.firstChild) {
      return this.buildBreadCrumb(route.firstChild, newBreadcrumbs, nextUrl)
    }

    return this.breadcrumbService.filterBreadcrumbs(newBreadcrumbs)
  }
}

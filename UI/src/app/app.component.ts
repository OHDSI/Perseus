import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { BridgeService } from './services/bridge.service';

const ICON_NAMES = [ 'CDM_version',
  'folder',
  'folder_2',
  'mapping',
  'reset',
  'save',
  'help',
  'new_mapping',
  'edit',
  'delete',
  'scan_data',
  'search'
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  currentUrl;
  private readonly mobileQueryListener: () => void;

  constructor(
    cd: ChangeDetectorRef,
    media: MediaMatcher,
    private bridgeService: BridgeService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router
  ) {
    this.addIcons();

    this.mobileQueryListener = () => cd.detectChanges();

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQuery.addListener(this.mobileQueryListener);

    const windowResizedSubscription = fromEvent(window, 'resize')
      .pipe(
        debounceTime(50),
        map((event: any) => event.target)
      )
      .subscribe(window => {
        this.bridgeService.refreshAll();
      });

    this.router.events.subscribe((res) => this.currentUrl = this.router.url.replace('/', ''));
  }

  ngOnInit() {
    window.addEventListener("beforeunload", event => {
      event.preventDefault();
      event.returnValue = false;
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  addIcons() {
    ICON_NAMES.forEach(key => {
      this.matIconRegistry.addSvgIcon(
        key,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`./assets/icons/${key}.svg`)
      );
    });
  }
}


export type OpenMappingDialog = 'open' | 'save';

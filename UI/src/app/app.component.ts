import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { BridgeService } from './services/bridge.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  mobileQuery: MediaQueryList;

  private mobileQueryListener: () => void;

  constructor(
    cd: ChangeDetectorRef,
    media: MediaMatcher,
    private bridgeService: BridgeService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
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
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  addIcons() {
    ['CDM_version', 'folder', 'mapping', 'reset', 'save', 'help'].forEach(key => {
      this.matIconRegistry.addSvgIcon(
        key,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/icons/${key}.svg`)
      );
    });
  }
}



export type OpenMappingDialog = 'open' | 'save';

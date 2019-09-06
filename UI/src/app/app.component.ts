import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { debounceTime, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { BridgeService } from './services/bridge.service';
import { MatDialog } from '@angular/material';
import { OpenMappingDialogComponent } from './components/popaps/open-mapping-dialog/open-mapping-dialog.component';
import { StateService } from './services/state.service';

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
    bridge: BridgeService,
    private matDialog: MatDialog,
    private state: StateService
  ) {
    this.mobileQueryListener = () => cd.detectChanges();

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQuery.addListener(this.mobileQueryListener);

    const windowResizedSubscription = fromEvent(window, 'resize')
      .pipe(
        debounceTime(50),
        map((event: any) => event.target)
      )
      .subscribe(window => {
        console.log('Window height changed', window.innerHeight);
        bridge.refreshAll();
      });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  resetAllMappings() {
    throw new Error('not implemented');
  }

  openSaveMappingDialog(action: OpenMappingDialog) {
    const matDialog = this.matDialog.open(OpenMappingDialogComponent, {
      closeOnNavigation: true,
      disableClose: true,
      data: { action, target: this.state.Target }
    });

    matDialog.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}

export type OpenMappingDialog = 'open' | 'save';

import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { debounceTime, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { BridgeService } from './services/bridge.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  mobileQuery: MediaQueryList;

  private mobileQueryListener: () => void;

  constructor(cd: ChangeDetectorRef, media: MediaMatcher, bridge: BridgeService) {
    this.mobileQueryListener = () => cd.detectChanges();

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQuery.addListener(this.mobileQueryListener);

    const windowResizedSubscription = fromEvent(window, 'resize')
    .pipe(
      debounceTime(50),
      map((event: any) => event.target)
    ).subscribe(window => {
        console.log('Window height changed', window.innerHeight);
        bridge.refreshAll();
     });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }
}

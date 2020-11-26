import {Component, OnDestroy} from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Component({template: '<ng-container></ng-container>'})
export class BaseComponent implements OnDestroy {

    protected ngUnsubscribe: Subject<void> = new Subject<void>();

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}

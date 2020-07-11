import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewChild,
  ElementRef,
  Renderer,
  Renderer2
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { debounceTime, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { BridgeService } from './services/bridge.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { StateService } from './services/state.service';
import { OpenMappingDialogComponent } from './components/popups/open-mapping-dialog/open-mapping-dialog.component';
import { UploadService } from './services/upload.service';
import { environment } from 'src/environments/environment';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  @ViewChild('sourceUpload') fileInput: ElementRef;

  mobileQuery: MediaQueryList;

  private mobileQueryListener: () => void;

  private snakbarOptions = {
    duration: 3000
  };

  constructor(
    cd: ChangeDetectorRef,
    media: MediaMatcher,
    private bridgeService: BridgeService,
    private matDialog: MatDialog,
    private state: StateService,
    private dataService: DataService,
    private renderer: Renderer,
    private uploadService: UploadService,
    private snakbar: MatSnackBar
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
        this.bridgeService.refreshAll();
      });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  addIcons() {
    ['CDM_version', 'folder', 'mapping', 'reset', 'save'].forEach(key => {
      this.matIconRegistry.addSvgIcon(
        key,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/${key}.svg`)
      );
    });
  }

  resetAllMappings() {
    this.bridgeService.resetAllMappings();
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

  onOpenSourceClick(): void {
    if (this.fileInput.nativeElement.files[0]) {
      this.fileInput.nativeElement.value = '';
    }

    const event = document.createEvent('MouseEvent');
    event.initMouseEvent(
      'click',
      true,
      true,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );

    this.renderer.invokeElementMethod(
      this.fileInput.nativeElement,
      'dispatchEvent',
      [event]
    );
  }

  onFileUpload(event: any): void {
    const files = event.srcElement.files;
    const url = environment.url.concat('/load_schema');
    this.uploadService
      .putFileOnServer('POST', url, [], files)
      .then(okResponce => {
        this.snakbar.open(
          `Success file upload`,
          ' DISMISS ',
          this.snakbarOptions
        );
      })
      .catch(errResponce => {
        console.log(errResponce);
      });
    this.bridgeService.resetAllMappings();
    this.bridgeService.loadSavedSchema(files[0].name);
  }
}

export type OpenMappingDialog = 'open' | 'save';

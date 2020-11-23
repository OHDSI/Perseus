import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DbSettings } from '../model/db-settings';

@Component({
  selector: 'app-scan-data-progress',
  templateUrl: './scan-data-progress.component.html',
  styleUrls: ['./scan-data-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScanDataProgressComponent implements OnInit {

  @Input()
  dbSettings: DbSettings;

  // Percent
  progressValue = 0;

  constructor() { }

  ngOnInit(): void {
  }
}

import { Component, OnInit, Input, ElementRef, ContentChild, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Expanded } from 'src/app/pages/mapping/store/actions/common.actions';
import { MatExpansionPanelContent } from '@angular/material';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent {
  @Input() title: string;
  @Input() columnList: any[];
  
  constructor() {}
}

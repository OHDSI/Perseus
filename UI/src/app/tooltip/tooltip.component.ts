import { Component, Inject, OnInit } from '@angular/core';
import { OVERLAY_DIALOG_DATA } from '../services/overlay/overlay-dialog-data';
import { Tooltip } from './tooltip';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {

  text: string;

  link: string;

  constructor(@Inject(OVERLAY_DIALOG_DATA) public payload: Tooltip) {
  }

  ngOnInit(): void {
    const {text, link} = this.payload
    this.text = text
    this.link = link
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { OVERLAY_DIALOG_DATA } from '../../../services/overlay/overlay-dialog-data';
import { Hint } from '../hints';
import { calculateWidthByLongestWord } from '../../../utilites/text-width';

@Component({
  selector: 'app-hint-overlay',
  templateUrl: './hint-overlay.component.html',
  styleUrls: ['./hint-overlay.component.scss']
})
export class HintOverlayComponent implements OnInit {

  width: string;

  position: string

  constructor(@Inject(OVERLAY_DIALOG_DATA) public hint: Hint) { }

  ngOnInit(): void {
    this.width = this.hint.width ?? calculateWidthByLongestWord(this.hint.text)
    this.position = this.hint.position ?? 'right'
  }
}

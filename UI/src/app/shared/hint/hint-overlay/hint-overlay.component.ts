import { Component, Inject, OnInit } from '@angular/core';
import { OVERLAY_DIALOG_DATA } from '@services/overlay/overlay-dialog-data';
import { Hint } from '../hints';
import { calculateWidthByLongestWord } from '@utils/text-width';
import { SUPPORT_EMAIL } from '@app/app.constants'

@Component({
  selector: 'app-hint-overlay',
  templateUrl: './hint-overlay.component.html',
  styleUrls: ['./hint-overlay.component.scss']
})
export class HintOverlayComponent implements OnInit {

  width: string;

  position: string

  emailHref = `mailto:${SUPPORT_EMAIL}?subject=Support MySQL server lower than 8 version`

  constructor(@Inject(OVERLAY_DIALOG_DATA) public hint: Hint) { }

  ngOnInit(): void {
    this.width = this.hint.width ?? calculateWidthByLongestWord(this.hint.text)
    this.position = this.hint.position ?? 'right'
  }
}

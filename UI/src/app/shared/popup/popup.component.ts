import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-popup',
    templateUrl: './popup.template.html',
    styleUrls: ['./popup.styles.scss'],
})
export class PopupComponent {
    @Input() externalCssClasses: string = '';
}
import { BaseComponent } from '@shared/base/base.component';
import { 
    Component, 
    OnInit, 
    OnDestroy, 
    ElementRef,
    ViewChild, 
    Renderer2
} from "@angular/core";
import { StoreService } from '@app/services/store.service';
import { ITable } from '@app/models/table';
import { Criteria } from '@shared/search-by-name/search-by-name.component';

@Component({
    selector: 'app-cdm-tables-settings',
    templateUrl: './cdm-tables-settings.component.html',
    styleUrls: ['./cdm-tables-settings.component.scss'],
})
export class CdmTablesSettingsComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('settings', {static: true}) settingsEl: ElementRef;
    @ViewChild('settingsBtn', {static: true,  read: ElementRef}) settingsBtn: ElementRef;

    private handleClickPopup: () => void;

    public showSettings = false;
    public readonly popupTitle = 'Settings for Tables';
    public readonly searchPlaceholder = 'Search Tables';
    public query: string = '';
    
    private initTables: ITable[] = [];
    public filteredTables: ITable[] = [];
    
    constructor(private renderer: Renderer2, private storeService: StoreService) {
        super();
    }

    filterByName(byName: Criteria): void {
        this.query = byName.criteria;
        this.filteredTables = this.initTables.filter(item => item.name.includes(byName.criteria));
    }

    resetFilter(): void {
        this.query = '';
        this.filteredTables = [...this.initTables];
    }

    public showSettingsDetailsOf(options: {table: ITable, event: Event}): void {
        const { table, event } = options;
        const targetTable: ITable = this.filteredTables.find(t => t.name === table.name);
        if (targetTable?.settings?.shown === undefined) {
            return;
        }
        const settingsAlreadyShown = targetTable?.settings?.shown === true;
        if (settingsAlreadyShown && this.listItemDetailsClicked(event)) {
            return;
        }

        targetTable.settings.shown = !targetTable.settings.shown;
    }


    ngOnInit(): void {
        this.initializeTablesData();
        
        // TODO: possibly refactor with host listener ?
        this.handleClickPopup = this.renderer.listen('document', 'click', event => {
            const clickedPopup = this.settingsEl.nativeElement.contains(event.target);
            const resetSearch = event.target.classList.contains('mat-icon');
            const clickedInside = clickedPopup || resetSearch || this.listItemDetailsClicked(event);
            if (!clickedInside) {
                this.showSettings = false;
                return;
            }

            const clickedBtn = this.settingsBtn.nativeElement.contains(event.target);
            this.showSettings = clickedBtn ? !this.showSettings : this.showSettings;
        });
    }

    private listItemDetailsClicked(event: Event): boolean {
        const target = (event.target as Element);
        const popupClicked = target.classList.contains('settings-list__item-popup');
        const detailsClicked = target.classList.contains('settings-list__item-details');
        return popupClicked || detailsClicked;
    }

    

    private initializeTablesData(): void {
        const { target } = this.storeService.state;
        this.initTables = [...target];
        // SCAFFOLDING BLOCK OF CODE. DELETE AFTER SETTINGS PROPERTY IN TABLE WILL BE IMPLEMENTED
        this.initTables.forEach(table => table.settings = {shown: false})
        // SCAFFOLDING BLOCK OF CODE. DELETE AFTER SETTINGS PROPERTY IN TABLE WILL BE IMPLEMENTED
        this.filteredTables = [...this.initTables]; 
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.handleClickPopup) {
            this.handleClickPopup();
        }
    }

}
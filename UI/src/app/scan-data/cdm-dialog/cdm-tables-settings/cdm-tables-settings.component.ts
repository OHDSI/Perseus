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

    public showSettingsDetailsOf(tableName: string): void {
        const targetTable: ITable = this.filteredTables.find(table => table.name === tableName);
        if (targetTable?.settings === undefined) {
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
            const clickedInside = clickedPopup || resetSearch;
            if (!clickedInside) {
                this.showSettings = false;
                return;
            }

            const clickedBtn = this.settingsBtn.nativeElement.contains(event.target);
            this.showSettings = clickedBtn ? !this.showSettings : this.showSettings;
        });
    }

    private initializeTablesData(): void {
        const { target } = this.storeService.state;
        this.collapseByDefaultAllTableSettings(this.initTables);
        this.initTables = [...target];
        this.filteredTables = [...this.initTables];
    }

    private collapseByDefaultAllTableSettings(tables: ITable[]): void {
        tables.forEach(table => {
            if (table.settings) {
                table.settings.shown = false;
            }
        });
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.handleClickPopup) {
            this.handleClickPopup();
        }
    }

}
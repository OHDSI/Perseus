import { BaseComponent } from '@shared/base/base.component';
import { 
    Component, 
    OnInit,
    OnDestroy, 
    ElementRef,
    ViewChild, 
    HostListener,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { StoreService } from '@app/services/store.service';
import { ITable } from '@app/models/table';
import { Area } from '@app/models/area';
import { cloneDeep } from '@app/infrastructure/utility';
import { Criteria } from '@shared/search-by-name/search-by-name.component';

@Component({
    selector: 'app-cdm-tables-settings',
    templateUrl: './cdm-tables-settings.component.html',
    styleUrls: ['./cdm-tables-settings.component.scss'],
})
export class CdmTablesSettingsComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('settings', {static: true}) settingsEl: ElementRef;
    @ViewChild('settingsBtn', {static: true,  read: ElementRef}) settingsBtn: ElementRef;

    public showSettings = false;
    public readonly popupTitle = 'Settings for Tables';
    public readonly searchPlaceholder = 'Search Tables';
    public query: string = '';
    
    private initTables: ITable[] = [];
    public filteredTables: ITable[] = [];
    
    constructor(private storeService: StoreService) {
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

    public updateTableSettings(table: ITable, settingsName: string) {
        const updatedTableName = table.name;
        for (let table of this.initTables) {
            if (table.name !== updatedTableName) {
                continue;
            }
            table.settings[settingsName] = table.settingsForm.value[settingsName];
        }
        this.updateOriginalTable(table);
    }

    private updateOriginalTable(table: ITable): void {
        const newSettings = {...table.settings};
        delete newSettings.shown; // remove UI-retaled field
        this.storeService.updateTableSettings(Area.Target, table.name, newSettings);
    }


    ngOnInit(): void {
        this.initializeTablesData();
    }

    @HostListener('document:click', ['$event'])
    private handleClickPopup(event: Event) {
        const clickedPopup = this.settingsEl.nativeElement.contains(event.target);
        const resetSearch = (event.target as HTMLElement).classList.contains('mat-icon');
        const sliderToggle = (event.target as HTMLElement).classList.contains('mat-slide-toggle-bar');
        const clickedInside = clickedPopup || resetSearch || sliderToggle;
        if (!clickedInside) {
            this.showSettings = false;
            return;
        }

        const clickedBtn = this.settingsBtn.nativeElement.contains(event.target);
        this.showSettings = clickedBtn ? !this.showSettings : this.showSettings;
    }

    private initializeTablesData(): void {
        const { target: originalTables } = this.storeService.state;
        this.initTables = cloneDeep(originalTables);
        this.initTablesWithSettings(this.initTables);
        this.filteredTables = [...this.initTables]; // array of links to initTables
    }

    private initTablesWithSettings(tables: ITable[]): void {
        tables.forEach((table: ITable) => {
            if (!table.settings) {
                return;
            }
            this.setupTableFormGroup(table);
            this.collapseTableByDefault(table);
        });
    }

    private setupTableFormGroup(table: ITable): void {
        const formGroupConfig = {};
        for (let key in table.settings) {
            formGroupConfig[key] = new FormControl(table.settings[key]);
        }
        table.settingsForm = new FormGroup(formGroupConfig);
    }

    private collapseTableByDefault(table: ITable): void {
        table.settings.shown = false;
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}
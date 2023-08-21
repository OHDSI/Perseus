// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Overlay } from '@angular/cdk/overlay';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColumnInfoComponent } from '@app/cdm/comfy/columns-list/column-info/column-info.component';
import { DataConnectionService } from '@app/data-connection/data-connection.service';
import { CdmCustomMaterialModule } from '@app/material/cdm-custom-material.module';
import { ColumnInfo } from '@app/models/perseus/column-info';
import { BridgeService } from '@app/services/bridge.service';
import { CommonService } from '@app/services/common.service';
import { DataService } from '@app/services/data.service';
import { DrawService } from '@app/services/draw.service';
import { OVERLAY_DIALOG_DATA } from '@app/services/overlay/overlay-dialog-data';
import { PerseusApiService } from '@app/services/perseus/perseus-api.service';
import { StoreService } from '@app/services/store.service';
import { TextWidthDirective } from '@app/shared/text-width/text-width.directive';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
// import Button from './button.component';

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
export default {
  title: 'Perseus/ColumnInfo',
  component: ColumnInfoComponent,
  // More on argTypes: https://storybook.js.org/docs/angular/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

class MockDataConnectionService {
  sourceConnection = {
    getColumnInfo(tableName: string, columnName: string): ColumnInfo {
      return {
        topValues: [
          {
            frequency: '10',
            value: 'foo',
            percentage: '.25'
          },
          {
            frequency: '20',
            value: 'bar',
            percentage: '.50'
          },
        ],
        type: "string",
        uniqueValues: '3'
      }
    }
  }
}

// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: Story<ColumnInfoComponent> = (args: ColumnInfoComponent) => ({
  moduleMetadata: {
    declarations: [
      TextWidthDirective,
    ],
    imports: [
      CommonModule,
      CdmCustomMaterialModule,
      CdkTableModule,
      FormsModule,
      ReactiveFormsModule,
      NgxTrimDirectiveModule,
      BrowserAnimationsModule,
    ],
    providers: [
      {provide: OVERLAY_DIALOG_DATA, useValue: { 
        columnName: "string", tableNames: ["Person_ex", "Person2_ex"], positionStrategy: "top", maxHeight: 400 }
      },
      DataService,
      PerseusApiService,
      StoreService,
      BridgeService,
      DrawService,
      CommonService,
      MatDialog,
      Overlay,
      HttpClient,
      HttpHandler,
      { provide: DataConnectionService, useClass: MockDataConnectionService}
      ,
    ]
  },
  props: args,
});

export const WithProfile = Template.bind({});
// More on args: https://storybook.js.org/docs/angular/writing-stories/args
WithProfile.args = {
  // primary: true,
  // label: 'Button',
};

// export const Secondary = Template.bind({});
// Secondary.args = {
//   label: 'Button',
// };

// export const Large = Template.bind({});
// Large.args = {
//   size: 'large',
//   label: 'Button',
// };

// export const Small = Template.bind({});
// Small.args = {
//   size: 'small',
//   label: 'Button',
// };

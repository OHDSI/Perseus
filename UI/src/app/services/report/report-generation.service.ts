import { Injectable } from '@angular/core';
import { ReportCreator } from './report-creator';
import { WordReportCreator } from './word-report-creator';
import { stateToInfo, StoreService } from '../store.service';
import { MappingPair } from '@models/mapping';
import { Packer } from 'docx';
import { BridgeService } from '../bridge.service';
import { PerseusLookupService } from '../perseus/perseus-lookup.service';
import { saveAs } from 'file-saver';
import { ITable } from '@models/table';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

export enum ReportType {
  WORD,
  HTML,
  MD
}

export enum ReportGenerationEvent {
  PREPARE,
  READY
}

@Injectable()
export class ReportGenerationService {

  private source: ITable[]

  private mappingConfig

  private similarTableName: string

  private reportConfig$ = new Subject<ReportGenerationEvent>()

  private getReportCreator = (reportType: ReportType) => new WordReportCreator()

  constructor(private storeService: StoreService,
              private bridgeService: BridgeService,
              private lookupService: PerseusLookupService) {
  }

  get reportConfigReady$() {
    return this.reportConfig$.asObservable()
      .pipe(
        filter(event => event === ReportGenerationEvent.READY)
      )
  }

  get reportConfigPrepare$() {
    return this.reportConfig$.asObservable()
      .pipe(
        filter(event => event === ReportGenerationEvent.PREPARE)
      )
  }

  setSource(source: ITable[]) {
    this.source = source
    return this
  }

  setMappingConfig(mappingConfig) {
    this.mappingConfig = mappingConfig
    return this
  }

  setSimilarTableName(similarTableName) {
    this.similarTableName = similarTableName
    return this
  }

  emit(event: ReportGenerationEvent) {
    this.reportConfig$.next(event)
    return this
  }

  async generateReport(reportType: ReportType) {
    const reportCreator: ReportCreator = this.getReportCreator(reportType)
    const info = stateToInfo(this.storeService.state);
    const mappingHeader = {source: info.reportName, target: info.cdmVersion};
    const mapping = this.bridgeService.generateMappingWithViewsAndGroupsAndClones(this.source);

    reportCreator
      .createHeader1(`${info.reportName.toUpperCase()} Data Mapping Approach to ${info.cdmVersion}`)
      .createTablesMappingImage(mappingHeader, this.mappingConfig);

    const lookupTypesSet = new Set<string>(); // Lookups for appendix
    const sortAscByTargetFunc = (a: MappingPair, b: MappingPair) =>
      a.target_table > b.target_table ? 1 : (a.target_table === b.target_table ? 0 : -1);
    const sortedMappingItems = mapping.mapping_items.sort(sortAscByTargetFunc);

    let currentTargetTable: string = null;

    for (const mappingItem of sortedMappingItems) {
      let header3OnNewPage = true;
      if (currentTargetTable !== mappingItem.target_table) {
        currentTargetTable = mappingItem.target_table;
        header3OnNewPage = false;
        reportCreator
          .createHeader2(`Table name: ${currentTargetTable}`, true);
      }

      // set lookups
      for (const mappingNode of mappingItem.mapping) {
        if (mappingNode.lookup) {
          lookupTypesSet.add(mappingNode.lookupType);
          mappingNode.lookup = await this.lookupService
            .getLookup(mappingNode.lookup, mappingNode.lookupType)
            .toPromise();
        }
      }

      reportCreator
        .createHeader3(`Reading from ${mappingItem.source_table}`, header3OnNewPage);

      const hasClones = mappingItem.clones && mappingItem.clones.length > 0;

      if (hasClones) {
        mappingItem.clones.forEach((clone, index) => {
          reportCreator
            .createHeader4(`Clone ${clone.name}`, index !== 0);

          if (clone.condition && clone.condition !== '') {
            reportCreator
              .createParagraph(`Condition: ${clone.condition}`);
          }

          const mappingNodes = mappingItem.mapping
            .filter(mappingNode => mappingNode.targetCloneName === clone.name);

          reportCreator
            .createFieldsMappingImage(mappingHeader, mappingNodes)
            .createParagraph()
            .createFieldsDescriptionTable(mappingNodes);
        });
      } else {
        reportCreator
          .createFieldsMappingImage(mappingHeader, mappingItem.mapping)
          .createParagraph()
          .createFieldsDescriptionTable(mappingItem.mapping);
      }
    }

    reportCreator.createHeader1('Appendix');

    const viewKeys = Object.keys(mapping.views ? mapping.views : {});
    if (viewKeys.length > 0) {
      reportCreator.createHeader2('View mapping', false);
      viewKeys.forEach(key => {
        reportCreator
          .createHeader3(`${info.reportName.toUpperCase()} to ${key}`, false)
          .createSqlTextBlock(mapping.views[key])
          .createParagraph();
      });
    }

    reportCreator.createHeader2('Source tables', viewKeys.length > 0);

    this.source
      .filter(table => table.name !== this.similarTableName)
      .forEach((table, index) => reportCreator
        .createHeader3(`Table: ${table.name}`, index !== 0)
        .createSourceInformationTable(table.rows)
      );

    if (lookupTypesSet.size > 0) {
      reportCreator.createHeader2('Lookup', true);
      let onNewPage = false;
      for (const lookupType of lookupTypesSet) {
        const sqlTemplate = await this.lookupService
          .getLookupTemplate(lookupType)
          .toPromise();

        reportCreator
          .createHeader3(lookupType.toUpperCase(), onNewPage)
          .createSqlTextBlock(sqlTemplate);

        onNewPage = true;
      }
    }

    const report = reportCreator.generateReport();

    Packer.toBlob(report).then(blob => {
      saveAs(blob, 'Report.docx');
    });
  }
}

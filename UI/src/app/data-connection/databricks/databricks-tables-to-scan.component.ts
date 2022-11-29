import { SelectionChange, SelectionModel } from "@angular/cdk/collections";
import { NestedTreeControl } from "@angular/cdk/tree";
import { Component, OnInit } from "@angular/core";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { ScanRequestLog } from "../api/models";
import { DataConnectionTablesToScanComponent } from '../data-connection-tables-to-scan.component';
import { DataConnectionService } from "../data-connection.service";

interface ModelDefinitionNode {
  catalog?: string,
  database?: string,
  modelDefinition?: ScanRequestLog['modelDefinition'],
  children?: {[key: string]: ModelDefinitionNode},
}

@Component({
  templateUrl: './databricks-tables-to-scan.component.html',
  styleUrls: [
    './databricks-tables-to-scan.component.css',
    '../../scan-data/scan-data-dialog/scan-data-form/tables-to-scan/tables-to-scan.component.scss',
    '../../scan-data/styles/scan-data-step.scss',
    '../../scan-data/styles/scan-data-normalize.scss',
    '../../scan-data/styles/scan-data-popup.scss',
  ],
})
export class DatabricksTablesToScanComponent implements DataConnectionTablesToScanComponent, OnInit {

  treeControl: NestedTreeControl<ModelDefinitionNode>
  dataSource: MatTreeNestedDataSource<ModelDefinitionNode>
  modelDefinitionSelection: SelectionModel<ModelDefinitionNode>
  searchTableName: string

  constructor(
    private dataConnectionService: DataConnectionService
  ) {
  }

  ngOnInit(): void {
    this.treeControl = new NestedTreeControl<ModelDefinitionNode>(node => Object.values(node.children || {}));
    this.dataSource = new MatTreeNestedDataSource<ModelDefinitionNode>()
    this.dataSource.data = this.modelDefinitionTree(
      this.dataConnectionService.logsForLastModelDefRequest
        .filter(l => l.modelDefinition)
        .map(l => l.modelDefinition)
    )
    this.treeControl.dataNodes = this.dataSource.data
    this.treeControl.expandAll()
    this.modelDefinitionSelection = new SelectionModel<ModelDefinitionNode>(true)
    this.modelDefinitionSelection.changed.subscribe({
      next: (s: SelectionChange<ModelDefinitionNode>) => {
        const scanParameters = this.dataConnectionService.currentProfileRequest.scanParameters
        if (s.added) {
          if (!scanParameters.modelDefinitions) {
            scanParameters.modelDefinitions = []
          }
          scanParameters.modelDefinitions.push(
            ...s.added.map(n => n.modelDefinition)
          )
        }
        if (s.removed) {
          s.removed.forEach(n => {
            scanParameters.modelDefinitions.splice(scanParameters.modelDefinitions.indexOf(n.modelDefinition), 1)
          })
        }
        console.log(this.dataConnectionService.currentProfileRequest.scanParameters)
      }
    })
  }

  // onSelectAll() {
    
  //   this.tables = this.tables.map(t => ({...t, selected: true}))
  // }

  onDeselectAll() {
    this.modelDefinitionSelection.clear()
  }

  onSearchByTableName(query: string) {
    const lower = query.toLowerCase()
    this.dataSource.data = this.modelDefinitionTree(
      this.dataConnectionService.logsForLastModelDefRequest
        .filter(l => l.modelDefinition)
        .map(l => l.modelDefinition)
        .filter(m => m.settings.databricks.tableName.toLowerCase().includes(lower))
    )
    this.treeControl.dataNodes = this.dataSource.data
    this.treeControl.expandAll()
  }

  modelDefinitionTree(modelDefinitions: ScanRequestLog['modelDefinition'][]): ModelDefinitionNode[] {
    return Object.values(
      modelDefinitions.reduce((m: {[key: string]: ModelDefinitionNode}, d) => {
        const catalog = d.settings.databricks.catalog
        const database = d.settings.databricks.database
        const tableName = d.settings.databricks.tableName
        if (!m[catalog]) {
          m[catalog] = {
            catalog,
            children: {}
          }
        }
        if (!m[catalog].children[database]) {
          m[catalog].children[database] = {
            database,
            children: {}
          }
        }
        m[catalog].children[database].children[tableName] = {
          modelDefinition: d
        }
        return m
      }, {})
    )
  }

  hasChildren = (_, n: ModelDefinitionNode) => n.catalog || n.database
  
}
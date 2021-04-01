import { Injectable } from '@angular/core';
import { Concept, IConceptOptions, ITableConceptsOptions, TableConcepts } from '../components/concept-transformation/model/concept';
import { cloneDeep } from '../infrastructure/utility';
import * as conceptMap from './../components/concept-fileds-list.json';
import { createConceptFields, getConceptFieldType, updateConceptsIndexes, updateConceptsList } from 'src/app/services/utilites/concept-util';
import { Arrow } from '../models/arrow';

@Injectable({
    providedIn: 'root'
})
export class ConceptTransformationService {

    arrow: Arrow;
    targetTableName;
    conceptFields;
    targetCloneName;
    targetCondition;
    conceptFieldsMap = (conceptMap as any).default;
    concepts;
    arrowsCache;
    oppositeSourceTable;
    conceptsTable;

    connectedToConceptFields = {};

    constructor(targetTableName: any, oppositeSourceTable: any, concepts: any, arrow?: Arrow, cloneTableName?: any, condition?: any, arrowsCache?: any) {
        this.arrow = arrow;
        this.targetTableName = targetTableName;
        this.conceptFields = this.conceptFieldsMap[ this.targetTableName ];
        this.targetCloneName = cloneTableName;
        this.targetCondition = condition;
        this.concepts = concepts;
        this.arrowsCache = arrowsCache;
        this.oppositeSourceTable = oppositeSourceTable;
    }

    addFieldToConcepts() {
        const connectedFields = this.collectConnectedGroupedFields();
        const fieldType = getConceptFieldType(this.arrow.target.name);

        if (!this.concepts[ `${this.targetTableName}|${this.oppositeSourceTable}` ]) {
            this.addNewConceptTable(connectedFields, fieldType);
        } else {
            const newConceptFields = [];
            connectedFields.forEach((it) => {
                let fieldCompleted = false;
                for (const item of this.concepts[ `${this.targetTableName}|${this.oppositeSourceTable}` ].conceptsList) {
                    if (it.target.cloneTableName === item.fields[ fieldType ].targetCloneName) {
                        if (item.fields[ fieldType ].field === '' && (!item.fields[ fieldType ].constantSelected || item.fields[ fieldType ].constantSelected && item.fields[ fieldType ].constant === '')) {
                            item.fields[ fieldType ].field = it.source.name;
                            item.fields[ fieldType ].constantSelected = false;
                            fieldCompleted = true;
                            break;
                        }
                    }
                }
                if (!fieldCompleted) {
                    newConceptFields.push(it);
                }
            });
            newConceptFields.forEach(item => {
                const conceptIndex = this.concepts[ `${this.targetTableName}|${this.oppositeSourceTable}` ].conceptsList.length;
                const fields = createConceptFields(this.conceptFields, this.targetCloneName, this.targetCondition);
                const conceptOptions = this.createConceptOptions(conceptIndex, fields, fieldType, item.source.name);
                this.concepts[ `${this.targetTableName}|${this.oppositeSourceTable}` ].conceptsList.push(new Concept(conceptOptions));
            });
        }

    }

    collectConnectedGroupedFields() {
        const connectedFields = [];
        if (this.arrow.source.grouppedFields && this.arrow.source.grouppedFields.length) {
            this.arrow.source.grouppedFields.forEach(it => {
                const ungrouppedField = cloneDeep(this.arrow);
                ungrouppedField.source = it;
                connectedFields.push(ungrouppedField);
            });
        } else {
            connectedFields.push(this.arrow);
        }
        return connectedFields;
    }

    addNewConceptTable(connectedFields?: any, fieldType?: any) {
        const conceptTableOptions: ITableConceptsOptions = {
            lookup: {},
            conceptsList: []
        };
        this.conceptsTable = new TableConcepts(conceptTableOptions);
        this.targetCloneName ? this.conceptsTable.lookup[this.targetCloneName] = {} : this.conceptsTable.lookup['Default'] = {};
        if(connectedFields){
            connectedFields.forEach(it => {
                const conceptIndex = connectedFields.indexOf(it);
                const fields = createConceptFields(this.conceptFields, this.targetCloneName, this.targetCondition);
                const conceptOptions = this.createConceptOptions(conceptIndex, fields, fieldType, it.source.name);
                this.conceptsTable.conceptsList.push(new Concept(conceptOptions));
            });
        }

        this.concepts[ `${this.targetTableName}|${this.oppositeSourceTable}` ] = this.conceptsTable;
    }

    createConceptOptions(index: any, fields: any, fieldType: any, fieldName: any) {
        fields[ fieldType ].field = fieldName;
        fields[ fieldType ].constantSelected = false;

        const conceptOptions: IConceptOptions = {
            id: index,
            fields
        };

        return conceptOptions;
    }


    deleteFieldsFromConcepts() {
        const connectedFields = this.collectConnectedGroupedFields();
        const fieldType = getConceptFieldType(this.arrow.target.name);
        const conceptsList = this.concepts[ `${this.targetTableName}|${this.oppositeSourceTable}` ].conceptsList;

        connectedFields.forEach(item => {
            conceptsList.forEach(conc => {
                if (conc.fields[ fieldType ].targetCloneName === this.targetCloneName && conc.fields[ fieldType ].field === item.source.name) {
                    conc.fields[ fieldType ].field = '';
                    conc.fields[ fieldType ].constantSelected = true;
                }
            });
        });
        this.concepts[ `${this.targetTableName}|${this.oppositeSourceTable}` ].conceptsList = updateConceptsList(conceptsList);
        updateConceptsIndexes(this.concepts[ `${this.targetTableName}|${this.oppositeSourceTable}` ].conceptsList);
    }

}

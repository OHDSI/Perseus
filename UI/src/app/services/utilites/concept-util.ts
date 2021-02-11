export function getConceptFieldNameByType(columnType: string, connectedToConceptFields: any){
    let names = Object.keys(connectedToConceptFields).filter(it => it.endsWith(columnType));
    if(columnType === 'concept_id'){
      names = names.filter(it=> !it.endsWith('source_concept_id') && !it.endsWith('type_concept_id'))
    }
    return names[0];
  }
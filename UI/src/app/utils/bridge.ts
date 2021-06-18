export function canLink(config, sourceTableName, targetTableName) {
  for (const item of config) {
    if (item.includes(sourceTableName) && item.includes(targetTableName)) {
      return true;
    }
  }
  return false;
}

export function removeDeletedLinksFromFields(conceptsCopy: any, linksToConceptFields: any, conceptFieldsDictionary: any) {
  conceptsCopy.conceptsList.forEach(conc => {
    Object.keys(conc.fields).forEach(type => {
      const sourceField = conc.fields[ type ].field;
      const linkExists = linksToConceptFields.filter(it => it.target.name === conceptFieldsDictionary[ type ] && it.source.name === sourceField);
      if (sourceField && !linkExists.length) {
        conc.fields[ type ].field = '';
      }
    })
  })
}

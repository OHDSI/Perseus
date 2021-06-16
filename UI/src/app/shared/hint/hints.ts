export interface Hint {
  text: string
  link: string,
  width?: string
  position?: string;
}

export const hints: {[key: string]: Hint} = {
  scanData: {
    text: 'The scan will get information about tables, fields, and frequency distributions of values.',
    link: 'https://github.com/SoftwareCountry/Perseus/wiki/Connecting-to-native-data#scan-native-databasefiles',
    width: '200px'
  },
  fakeDataGeneration: {
    text: 'This feature allows to create a fake dataset based on a scan report. The generated fake data can be outputted directly to database tables. The resulting dataset could be used to develop ETL code when direct access to the data is not available.',
    link: 'https://github.com/SoftwareCountry/Perseus/wiki/Convert-Fake-data-to-CDM',
    width: '249px'
  },
  createView: {
    text: 'A view is a composition of a table in the form of a predefined SQL query. A view can contain all rows\n' +
      'of a table or select rows from a table. A view can be created from one or many tables which depends\n' +
      'on the written SQL query to create a view.',
    link: 'https://github.com/SoftwareCountry/Perseus/wiki/Link-native-tables-to-CDM-tables#concatenating-native-tables',
    width: '300px'
  },
  createGroup: {
    text: 'Use Ctrl to select multiple fields and then click on Create group.',
    link: 'https://github.com/SoftwareCountry/Perseus/wiki/Link-native-fields-to-CDM-fields#fields-groups',
    width: '237px'
  },
  addCondition: {
    text: 'Set conditional SQL expression\n' +
      'for applying Variation.',
    link: 'https://github.com/SoftwareCountry/Perseus/wiki/Link-native-fields-to-CDM-fields#condition',
    width: '190px',
    position: 'top'
  },
  clone: {
    text: 'Clone button generates a copy\n' +
      'of Target table.',
    link: 'https://github.com/SoftwareCountry/Perseus/wiki/Link-native-fields-to-CDM-fields#clone',
    width: '182px',
    position: 'top'
  },
  sqlTransformation: {
    text: 'Made changes will be shown if you switch from Visual mode to Manual, but not at the opposite.',
    link: 'https://github.com/SoftwareCountry/Perseus/wiki/Link-native-fields-to-CDM-fields#sql-functions',
    width: '230px'
  }
}

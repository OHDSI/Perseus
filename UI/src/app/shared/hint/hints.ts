export interface Hint {
  text: string
  link: string
}

export const hints: {[key: string]: Hint} = {
  scanData: {
    text: 'The scan will get information about tables, fields, and frequency distributions of values.',
    link: 'https://github.com/SoftwareCountry/Perseus/wiki/Connecting-to-native-data#scan-native-databasefiles'
  },
  fakeDataGeneration: {
    text: 'This feature allows to create a fake dataset based on a scan report. The generated fake data can be outputted directly to database tables. The resulting dataset could be used to develop ETL code when direct access to the data is not available.',
    link: 'https://github.com/SoftwareCountry/Perseus/wiki'
  }
}

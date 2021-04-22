export interface Tooltip {
  text: string
  link: string
}

export const tooltips: {[key: string]: Tooltip} = {
  settingOfScanTables: {
    text: 'Settings of Scanning Tables',
    link: 'https://github.com/SoftwareCountry/Perseus/wiki/Connecting-to-native-data'
  }
}

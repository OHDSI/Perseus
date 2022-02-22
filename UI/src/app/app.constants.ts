import { environment } from '../environments/environment'

export const appVersion = '0.3'

export const similarTableName = 'similar'

export const isProd = environment.production
export const isDev = !isProd;

const server = environment.server || window.location.hostname
const port = environment.port || window.location.port
const protocol = window.location.protocol

export const dbServer = server

// urls
export const serverUrl = `${protocol}//${server}:${port}`

export const perseusApiUrl = 'http://localhost:5000/perseus/api'
// export const perseusApiUrl = `${serverUrl}/api`

export const whiteRabbitServerUrl = `${serverUrl}/white-rabbit-service`
export const whiteRabbitWsUrl = whiteRabbitServerUrl
export const whiteRabbitApiUrl = `${whiteRabbitServerUrl}/api`

export const cdmBuilderServerUrl = serverUrl
export const cdmBuilderLogUrl = `${cdmBuilderServerUrl}/log`
export const cdmBuilderApiUrl = `${cdmBuilderServerUrl}/cdm-builder/api`

export const dqdServerUrl = `${serverUrl}/dqd`
export const dqdApiUrl = `${dqdServerUrl}/api`
export const dqdWsUrl = `ws://${server}:${port}/dqd/progress`

export const athenaUrl = 'http://127.0.0.1:5050/athena/api'
export const usagiWsUrl = 'http://127.0.0.1:5150'
export const usagiUrl = 'http://127.0.0.1:5150/usagi/api'
//

export const numberOfPanelsWithoutSimilar = 2
export const numberOfPanelsWithOneSimilar = 3
export const numberOfPanelsWithTwoSimilar = 4

export const conceptFieldsTypes = ['concept_id', 'source_value', 'source_concept_id', 'type_concept_id']

export const mainPageRouter = '/perseus'
export const loginRouter = '/sign-in'
export const codesRouter = '/codes'

export const externalUrls = [
  'athena.ohdsi.org'
]

export const serverErrorExclusionUrls = [
  'athena',
  'get_term_search_results',
  'save_mapped_codes',
  'is_token_valid'
]

export const COLUMNS_TO_EXCLUDE_FROM_TARGET = [
  'CONCEPT',
  'VOCABULARY',
  'DOMAIN',
  'CONCEPT_CLASS',
  'CONCEPT_RELATIONSHIP',
  'RELATIONSHIP',
  'CONCEPT_SYNONYM',
  'CONCEPT_ANCESTOR',
  'SOURCE_TO_CONCEPT_MAP',
  'DRUG_STRENGTH'
]

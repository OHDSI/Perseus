import { environment } from '../environments/environment'
import { AuthStrategies } from '../environments/auth-strategies'

export const appVersion = '0.4'
export const similarTableName = 'similar'

export const isProd = environment.production
export const isDev = !isProd;

export const serverUrl = environment.serverUrl || window.location.origin

export const authStrategy = environment.authStrategy
export const isAzureAuth = authStrategy === AuthStrategies.AAD

export const authApiUrl = isAzureAuth ?
  `${serverUrl}/auth/api` :
  `${serverUrl}/user/api`
export const perseusApiUrl = `${serverUrl}/backend/api`
export const whiteRabbitApiUrl = `${serverUrl}/white-rabbit/api`
export const cdmBuilderApiUrl = `${serverUrl}/cdm-builder/api`
export const dqdServerUrl = `${serverUrl}/data-quality-dashboard`
export const dqdApiUrl = `${dqdServerUrl}/api`
export const athenaUrl = `${serverUrl}/athena/api`
export const usagiUrl = `${serverUrl}/usagi/api`

export const numberOfPanelsWithoutSimilar = 2
export const numberOfPanelsWithOneSimilar = 3
export const numberOfPanelsWithTwoSimilar = 4

export const conceptFieldsTypes = [
  'concept_id',
  'source_value',
  'source_concept_id',
  'type_concept_id'
]

export const mainPageName = 'comfy'

export const mainPageRouter = '/perseus'
export const loginRouter = '/sign-in'
export const codesRouter = '/codes'
export const mappingRouter = '/mapping'

export const externalUrls = [
  'athena.ohdsi.org',
  'login.microsoftonline.com'
]

export const serverErrorExclusionUrls = [
  'athena.ohdsi.org',
  'athena',
  'get_term_search_results',
  'save_mapped_codes',
  'is_token_valid',
  'scan-report/conversion'
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

export const SUPPORT_EMAIL = 'perseus.support@softwarecountry.com'

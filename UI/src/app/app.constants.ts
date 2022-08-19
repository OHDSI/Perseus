import { environment } from '../environments/environment'
import { AuthStrategies } from '../environments/auth-strategies'

export const appVersion = '0.4'
export const similarTableName = 'similar'

export const isProd = environment.production
export const isDev = !isProd;

export const serverUrl = environment.serverUrl || window.location.origin

export const authStrategy = environment.authStrategy
export const isAddAuth = authStrategy === AuthStrategies.ADD

export const authApiUrl = isAddAuth ?
  `${serverUrl}/auth/api` :
  `${serverUrl}/user/api`
export const perseusApiUrl = `${'http://localhost:5000'}/backend/api`
export const whiteRabbitApiUrl = `http://localhost:8000/white-rabbit/api`
export const cdmBuilderApiUrl = `${serverUrl}/cdm-builder/api`
export const dqdServerUrl = `http://localhost:8001/data-quality-dashboard`
export const dqdApiUrl = `${dqdServerUrl}/api`
export const athenaUrl = `http://localhost:5002/athena/api`
export const usagiUrl = `${'http://localhost:5003'}/usagi/api`

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
  'athena.ohdsi.org'
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

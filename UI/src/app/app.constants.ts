import { environment } from '../environments/environment';

export const similarTableName = 'similar';

export const isProd = environment.production;
export const isDev = !isProd;
export const isLocal = environment.local

export const dbServer = environment.dbServer;

// urls
export const server = environment.server;

export const serverUrl = environment.port === 80 ?
  `http://${server}` :
  `http://${server}:${environment.port}`;

export const apiUrl = `${serverUrl}/api`;

export const whiteRabbitPrefix = '/white-rabbit-service';
export const whiteRabbitWsUrl = `${serverUrl}${whiteRabbitPrefix}`
export const whiteRabbitApiUrl = `${serverUrl}${whiteRabbitPrefix}/api`;

export const cdmBuilderLogUrl = `${serverUrl}/log`;
export const cdmBuilderApiUrl = `${serverUrl}/cdm-builder/api`;

export const dqdUrl = `${serverUrl}/dqd`;
export const dqdApiUrl = `${dqdUrl}/api`;
export const dqdWsUrl = `ws://${server}:8001/dqd/progress`; // 8001 port
//

export const numberOfPanelsWithoutSimilar = 2;
export const numberOfPanelsWithOneSimilar = 3;
export const numberOfPanelsWithTwoSimilar = 4;

export const conceptFieldsTypes = ['concept_id', 'source_value', 'source_concept_id', 'type_concept_id'];

export const mainPageRouter = '/perseus'
export const loginRouter = '/sign-in'
export const codesRouter = '/codes'

export const externalUrls = [
  'athena.ohdsi.org'
]

export const serverErrorExclusionUrls = [
  'get_term_search_results',
  'save_mapped_codes',
  'is_token_valid'
]

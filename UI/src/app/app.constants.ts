import { environment } from '../environments/environment';

export const similarTableName = 'similar';

export const apiUrl = environment.url;

export const isProd = environment.production;
export const isDev = !isProd;

export const whiteRabbitUrl = environment.whiteRabbitUrl;
export const whiteRabbitPrefix = '/white-rabbit-service';
export const whiteRabbitApiUrl = `${whiteRabbitUrl}/${whiteRabbitPrefix}/api`;

export const cdmBuilderLogUrl = `${environment.cdmBuilderUrl}/log`;
export const cdmBuilderApiUrl = `${environment.cdmBuilderUrl}/cdm-builder/api`;

export const dqdUrl = environment.dqdUrl;
export const dqdApiUrl = `${environment.dqdUrl}/api`;
export const dqdWsUrl = environment.dqdWsUrl;

export const numberOfPanelsWithoutSimilar = 2;
export const numberOfPanelsWithOneSimilar = 3;
export const numberOfPanelsWithTwoSimilar = 4;

export const conceptFieldsTypes = ['concept_id', 'source_value', 'source_concept_id', 'type_concept_id'];

export const mainPageRouter = '/perseus'

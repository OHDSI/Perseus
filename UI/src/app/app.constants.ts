import { environment } from '../environments/environment';

export const similarTableName = 'similar';

export const isProd = environment.production;
export const isDev = !isProd;

export const whiteRabbitUrl = environment.whiteRabbitUrl;
export const whiteRabbitPrefix = '/white-rabbit-service';
export const whiteRabbitApiUrl = `${whiteRabbitUrl}/${whiteRabbitPrefix}/api`;

export const cdmBuilderUrl = environment.cdmBuilderUrl;

export const numberOfPanelsWithoutSimilar = 2;
export const numberOfPanelsWithOneSimilar = 3;
export const numberOfPanelsWithTwoSimilar = 4;

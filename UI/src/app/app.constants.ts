import { environment } from '../environments/environment';

export const similarTableName = 'similar';

export const isProd = environment.production;
export const isDev = !isProd;

export const whiteRabbitUrl = environment.whiteRabbitUrl;
export const whiteRabbitPrefix = '/white-rabbit-service';
export const whiteRabbitApiUrl = `${whiteRabbitUrl}/${whiteRabbitPrefix}/api`;

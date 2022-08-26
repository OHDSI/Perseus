import { externalUrls } from '@app/app.constants'

export const notExternalUrl = (requestUrl: string) => !externalUrls.find(url => requestUrl.includes(url))

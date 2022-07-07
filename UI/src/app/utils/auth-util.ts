import { externalUrls } from '@app/app.constants'

export const notExternalUrl = requestUrl => !externalUrls.find(url => requestUrl.includes(url))

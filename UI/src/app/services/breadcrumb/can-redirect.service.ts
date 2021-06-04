export abstract class CanRedirectService {

  abstract breadcrumbLabel(): string

  abstract canRedirect(): boolean
}

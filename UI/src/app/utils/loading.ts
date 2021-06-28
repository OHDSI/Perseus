import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

export function withLoading$<R, C extends {loading: boolean}>(request$: Observable<R>, component: C) {
  component.loading = true
  return request$
    .pipe(
      finalize(() => component.loading = false)
    )
}

export function withLoading<T, C extends {loading: boolean}>(component: C): (source$: Observable<T>) => Observable<T> {
  return source$ => withLoading$<T, C>(source$, component)
}

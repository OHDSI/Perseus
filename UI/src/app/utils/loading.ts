import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

interface ComponentWithLoading {
  loading: boolean;
}

function withLoading$<R, C>(request$: Observable<R>, component: C, fieldName: string): Observable<R> {
  component[fieldName] = true;
  return request$
    .pipe(
      finalize(() => (component[fieldName] = false))
    );
}

export function withLoading<T, C extends ComponentWithLoading>(component: C): (source$: Observable<T>) => Observable<T> {
  return source$ => withLoading$<T, C>(source$, component, 'loading');
}

export function withLoadingField<T, C>(component: C, fieldName: keyof C): (source$: Observable<T>) => Observable<T> {
  return source$ => withLoading$<T, C>(source$, component, fieldName.toString());
}


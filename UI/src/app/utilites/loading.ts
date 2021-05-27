import { Observable } from 'rxjs/internal/Observable';
import { finalize } from 'rxjs/operators';

export function withLoading$<C extends {loading: boolean}, R>(component: C, request$: Observable<R>) {
  component.loading = true
  return request$
    .pipe(
      finalize(() => component.loading = false)
    )
}

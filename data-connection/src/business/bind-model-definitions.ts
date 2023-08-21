import {inject} from '@loopback/core';
import {
  defineCrudRepositoryClass,
  defineModelClass,
  Entity,
  juggler,
  ModelDefinition,
  ModelDefinitionSyntax,
} from '@loopback/repository';
import {defineCrudRestController} from '@loopback/rest-crud';
// import * as databricks from 'loopback-connector-databricks/src/databricks';
import {concatAll, from, Observable} from 'rxjs';
import {DataConnectionApplication} from '../application';

export const discoverModelDefinitions = (
  ds: juggler.DataSource,
): Observable<ModelDefinitionSyntax> => {
  return new Observable(subscriber => {
    ds.connect()
      .then(() => {
        // Adapt the fully loaded model definitions
        // to a more ideal observable api.
        from(ds.discoverModelDefinitions())
          .pipe(concatAll())
          .subscribe({
            next: d => subscriber.next(d as ModelDefinitionSyntax),
            complete: () => subscriber.complete(),
            error: () => subscriber.error(),
          });
      })
      .catch(subscriber.error);
  });
};

export function bindModelDefinitions(
  d: ModelDefinitionSyntax,
  key: string,
  app: DataConnectionApplication,
): void {
  const m = defineModelClass(Entity, new ModelDefinition(d));
  const r = defineCrudRepositoryClass(m);
  inject(`datasources.${key}`)(r, undefined, 0);
  const basePath = '/' + d.name;
  const c = defineCrudRestController(m, {basePath});
  const b = app.repository(r);
  inject(b.key)(c, undefined, 0);
  app.controller(c);
}

import {inject} from '@loopback/core';
import {defineCrudRepositoryClass, defineModelClass, Entity, juggler, ModelDefinition, ModelDefinitionSyntax} from '@loopback/repository';
import {defineCrudRestController} from '@loopback/rest-crud';
// import * as databricks from 'loopback-connector-databricks/src/databricks';
import {concatAll, from, Observable} from 'rxjs';
import {DataConnectionApplication} from '../application';
import {ScanRequest, ScanRequestLog, Status} from '../models';

export function scan(
  scanRequest: Omit<ScanRequest, 'id'>,
  app: DataConnectionApplication,
  iDataSource = juggler.DataSource
): Observable<ScanRequestLog> {
  return new Observable((subscriber) => {
    const {connector, ...dataSourceConfig} = scanRequest.dataSourceConfig
    const ds = new iDataSource({
      name: connector,
      // connector: databricks,
      connector: require(`loopback-connector-${connector}`),
      // connector: require('../../../../loopback-connector-databricks/lib/index'),
      ...dataSourceConfig
    })
    ds.connect().then(() => {
      app.dataSource(ds, connector)
      from(ds.discoverModelDefinitions()).pipe(concatAll()).subscribe({
        next: d => {
          const m = defineModelClass(Entity, new ModelDefinition(d as ModelDefinitionSyntax))
          const r = defineCrudRepositoryClass(m)
          inject(`datasources.${ds.name}`)(r, undefined, 0)
          const b = app.repository(r)
          const basePath = '/' + d.name;
          const c = defineCrudRestController(m, {basePath});
          inject(b.key)(c, undefined, 0);
          app.controller(c);
          subscriber.next(new ScanRequestLog({
            scanRequestId: scanRequest.getId(),
            status: Status.IN_PROGRESS,
            modelDefinition: d as ModelDefinitionSyntax
          }))
        },
        complete: () => subscriber.complete()
      })
    }, subscriber.error)
  })

}

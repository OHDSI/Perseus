import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, inject} from '@loopback/core';
import {
  defineCrudRepositoryClass,
  defineModelClass,
  Entity,
  ModelDefinition,
  RepositoryMixin,
} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {defineCrudRestController} from '@loopback/rest-crud';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {readdir, readFile} from 'fs/promises';
import path from 'path';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class DataConnectionApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);
    this.basePath('/data-connection');

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
      models: {
        nested: true,
      },
    };
  }

  async bindModelDefs(dataSourceName: string) {
    const scans = await readdir('./src/model-defs');
    for (const s of scans) {
      const modelDefs = await readdir(`./src/model-defs/${s}`);
      for (const f of modelDefs) {
        const fd = await readFile(`./src/model-defs/${s}/${f}`);
        const m = defineModelClass(
          Entity,
          new ModelDefinition(JSON.parse(fd.toString())),
        );
        const r = defineCrudRepositoryClass(m);
        inject(`datasources.${dataSourceName}`)(r, undefined, 0);
        const basePath = '/' + m.name;
        const c = defineCrudRestController(m, {basePath});
        const b = this.repository(r);
        inject(b.key)(c, undefined, 0);
        this.controller(c);
      }
    }
  }
}

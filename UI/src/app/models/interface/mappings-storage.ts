import { Configuration } from '../configuration';

export interface IMappingsStorage {
  configuration: any;
  save(mapping: Configuration) ;
  open(name: string): Configuration;
}

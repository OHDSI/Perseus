export interface IStorage<T> {
  configuration: T;
  save(mapping: T) ;
  open(name: string): T;
}

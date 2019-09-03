export interface SavedMappingOptions {
  name?: string;
  payload?: string;
}

export class SavedMapping {
  name: string;
  payload: string;

  constructor(options: SavedMappingOptions = {}) {
    this.name = options.name;
    this.payload = options.payload;
  }
}

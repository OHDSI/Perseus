import {inject} from '@loopback/core';
import {DataConnectionApplication} from '../application';
import {ModelProfileController} from '../controllers';
import {ModelProfileRepository} from '../repositories';

export const getOrBindProfileRepository = async (
  key: string,
  dsKey: string,
  app: DataConnectionApplication,
): Promise<ModelProfileRepository> => {
  const rKey = `repositories.${key}`;
  if (app.isBound(rKey)) {
    return app.get<ModelProfileRepository>(rKey);
  } else {
    return bindProfileRepository(key, dsKey, app);
  }
};

export const bindProfileRepository = async (
  key: string,
  dsKey: string,
  app: DataConnectionApplication,
): Promise<ModelProfileRepository> => {
  const r = ModelProfileRepository;
  inject(`datasources.${dsKey}`)(r, undefined, 0);
  // const basePath = '/' + key;
  const c = ModelProfileController;
  const b = app.repository(r, key);
  inject(b.key)(c, undefined, 0);
  app.controller(c, key);
  return (await b.getValue(app)) as ModelProfileRepository;
};

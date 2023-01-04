import {
  Client,
  createRestAppClient,
  givenHttpServerConfig
} from '@loopback/testlab';
import {DataConnectionApplication} from '..';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new DataConnectionApplication({
    rest: restConfig,
  });
  app.basePath('');

  await app.boot();
  // await app.bindModelDefs('memory');
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: DataConnectionApplication;
  client: Client;
}

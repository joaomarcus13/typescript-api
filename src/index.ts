import { SetupServer } from './server';
import './util/module-alias';
import config from 'config';

(async (): Promise<void> => {
  const server = new SetupServer(config.get('App.port'));
  await server.init();
  server.start();
})();

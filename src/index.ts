import { SetupServer } from './server';
import './util/module-alias';

const server = new SetupServer(3000);
server.init();
server.start();

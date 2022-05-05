import { SetupServer } from '../src/server';
import supertest from 'supertest';
import { afterAll, beforeAll } from '@jest/globals';

let server: SetupServer;
beforeAll(async () => {
  server = new SetupServer();
  await server.init();
  global.testRequest = supertest(server.getApp());
});

afterAll(async () => await server.close());

import express, { Application } from 'express';
import { Server } from '@overnightjs/core';
import { ForecastController } from './controllers/forecast';
import { BeachesController } from './controllers/beaches';
import { UsersController } from './controllers/users';
import * as database from './database';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public start(): void {
    this.app.listen(this.port, () =>
      console.info('server listening on port', this.port)
    );
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(express.json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UsersController();
    this.addControllers([
      forecastController,
      beachesController,
      usersController,
    ]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public getApp(): Application {
    return this.app;
  }
}

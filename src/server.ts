import express, { Application } from 'express';
import { Server } from '@overnightjs/core';
import { ForecastController } from './controllers/forecast';
export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public start(): void {
    this.app.listen(this.port, () => console.log('running'));
  }

  public init(): void {
    this.setupExpress();
    this.setupControllers();
  }

  private setupExpress(): void {
    this.app.use(express.json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    this.addControllers([forecastController]);
  }

  public getApp(): Application {
    return this.app;
  }
}

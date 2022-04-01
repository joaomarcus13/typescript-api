import './util/module-alias';
import express from 'express';
import { Server } from '@overnightjs/core';
export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }
  private setupExpress(): void {
    this.app.use(express.json());
  }
}

import { Response } from 'express';
import mongoose from 'mongoose';
import { CUSTOM_VALIDATION } from '../models/user';

interface ResponseError {
  code: number;
  error: string;
}

export abstract class BaseController {
  protected sendCreatedUpdateErrorResponse(
    res: Response,
    error: mongoose.Error.ValidationError | Error
  ): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientErrors(error);
      res.status(clientErrors.code).send(clientErrors);
    } else {
      res.status(500).send({ error: 'Internal server error' });
    }
  }

  private handleClientErrors(
    error: mongoose.Error.ValidationError
  ): ResponseError {
    const duplicatedKindError = Object.values(error.errors).filter(
      (err) => err.kind === CUSTOM_VALIDATION.DUPLICATED
    );
    return duplicatedKindError.length
      ? { code: 409, error: error.message }
      : { code: 422, error: error.message };
  }
}

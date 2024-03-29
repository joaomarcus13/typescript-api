import { Controller, Post } from '@overnightjs/core';
import mongoose from 'mongoose';
import { Response, Request } from 'express';
import { BaseController } from '.';
import { User } from '../models/user';
import AuthService from '../services/auth';

@Controller('users')
export class UsersController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(201).send(newUser);
    } catch (error) {
      this.sendCreatedUpdateErrorResponse(
        res,
        error as Error | mongoose.Error.ValidationError
      );
    }
  }

  @Post('authenticate')
  public async authenticate(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'User not found',
      });
    }
    if (!(await AuthService.comparePassword(password, user.password))) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'Password does not match',
      });
    }
    const token = await AuthService.generateToken(user.toJSON());
    return res.status(200).send({ ...user.toJSON(), token });
  }
}

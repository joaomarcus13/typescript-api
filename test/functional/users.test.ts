import { expect, it, beforeEach, describe } from '@jest/globals';

import { User } from '../../src/models/user';
import AuthService from '../../src/services/auth';
describe('Users functional tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
  describe('when create a new user', () => {
    it('should successfully create a new user with encrypted password', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '123456',
      };
      const respose = await global.testRequest.post('/users').send(newUser);
      expect(respose.status).toBe(201);
      expect(respose.body).toEqual(
        expect.objectContaining({
          ...newUser,
          ...{ password: expect.any(String) },
        })
      );
      await expect(
        AuthService.comparePassword(newUser.password, respose.body.password)
      ).resolves.toBeTruthy();
    });

    it('should return 400 when there is a validation error', async () => {
      const newUser = {
        // name: 'John Doe',
        email: 'john@mail.com',
        password: '123456',
      };
      const respose = await global.testRequest.post('/users').send(newUser);
      expect(respose.status).toBe(422);
      expect(respose.body).toEqual({
        code: 422,
        message: 'User validation failed: name: Path `name` is required.',
        error: 'Unprocessable Entity',
      });
    });

    it('should return 409 when the email already exists', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '123456',
      };
      await global.testRequest.post('/users').send(newUser);
      const respose = await global.testRequest.post('/users').send(newUser);
      expect(respose.status).toBe(409);
      expect(respose.body).toEqual({
        code: 409,
        message:
          'User validation failed: email: already exists in the database.',
        error: 'Conflict',
      });
    });
  });

  describe('when authenticating a user', () => {
    it('should generate a token for a valid user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '123456',
      };
      await new User(newUser).save();
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: newUser.email, password: newUser.password });
      expect(response.body).toEqual(
        expect.objectContaining({ token: expect.any(String) })
      );
    });

    it('Should return UNAUTHORIZED if the user with the given email is not found', async () => {
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: 'some-email@mail.com', password: '1234' });

      expect(response.status).toBe(401);
    });

    it('Should return UNAUTHORIZED if the user is found but the password does not match', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };
      await new User(newUser).save();
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: newUser.email, password: 'different password' });

      expect(response.status).toBe(401);
    });
  });
});

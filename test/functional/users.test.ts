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
        error: 'User validation failed: name: Path `name` is required.',
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
        error: 'User validation failed: email: already exists in the database.',
      });
    });
  });
});

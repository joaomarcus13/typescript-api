import { User } from '../../src/models/user';
describe('Users functional tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
  describe('when create a new user', () => {
    it('should successfully create a new user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '123456',
      };
      const respose = await global.testRequest.post('/users').send(newUser);
      expect(respose.status).toBe(201);
      expect(respose.body).toEqual(expect.objectContaining(newUser));
    });
  });
});

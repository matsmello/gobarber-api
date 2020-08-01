import "reflect-metadata";

import AuthenticateUserService from './AuthenticateUserService'
import CreateUserService from './CreateUserService'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import AppError from "@shared/errors/AppError";

describe('AuthenticateUser', () => {
  it('should be able to authenticate a new user', async () => {
      const fakeHashProvider = new FakeHashProvider();
      const fakeUsersRepository = new FakeUsersRepository();
      
      const authenticateUserService = new AuthenticateUserService(
        fakeUsersRepository,
        fakeHashProvider
      );
      
      const createUser = new CreateUserService(
        fakeUsersRepository,
        fakeHashProvider
      );

      await createUser.execute({
        email: 'email@email.com',
        password: '123123',
        name: 'Jhon Doe'
      })

      const response = await authenticateUserService.execute({
        email: 'email@email.com',
        password: '123123',
      })

      expect(response).toHaveProperty('token');
  })

  it('should not be able to authenticate with non existing user', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeUsersRepository = new FakeUsersRepository();
    
    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    expect(
      authenticateUserService.execute({
      email: 'email@email.com',
      password: '123123',
    })).rejects.toBeInstanceOf(AppError);
  })

  it('should not be able to authenticate with a strong password', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeUsersRepository = new FakeUsersRepository();
    
    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
    
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUser.execute({
      email: 'email@email.com',
      password: '123123',
      name: 'Jhon Doe'
    })

    expect(authenticateUserService.execute({
      email: 'email@email.com',
      password: 'wrong_password',
    })).rejects.toBeInstanceOf(AppError);
})
})
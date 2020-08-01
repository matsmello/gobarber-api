import "reflect-metadata";

import CreateUserService from './CreateUserService'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import AppError from "@shared/errors/AppError";
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeHashProvider = new FakeHashProvider();
      const createUserService = new CreateUserService(
        fakeUsersRepository,
        fakeHashProvider
      );

      const user = await createUserService.execute({
        name: 'Matheus',
        password: '123123',
        email: 'email@email.com'
      })

      expect(user).toHaveProperty('id');
  })

  it('should not be able to create a new user with same email from another', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUserService.execute({
      name: 'Matheus',
      password: '123123',
      email: 'email@email.com'
    })

    expect(createUserService.execute({
      name: 'Matheus',
      password: '123123',
      email: 'email@email.com'
    })).rejects.toBeInstanceOf(AppError);
})
})
import "reflect-metadata";

import UpdateUserAvatarService from './UpdateUserAvatarService'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import AppError from "@shared/errors/AppError";
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'

describe('UpdateUserAvatar', () => {
  it('should create new avatar to user', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeStorageProvider = new FakeStorageProvider();
      
      const updateUserAvatarService = new UpdateUserAvatarService(
        fakeUsersRepository,
        fakeStorageProvider
      );

      const user = await fakeUsersRepository.create({
        name: 'Matheus',
        password: '123123',
        email: 'email@email.com'
      })

      await updateUserAvatarService.execute({
        user_id: user.id,
        avatarFilename: 'avatar.jpg',
      })

      expect(user.avatar).toBe('avatar.jpg')
  })

  it('should receive error when user does not exist', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    
    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );

    expect(updateUserAvatarService.execute({
      user_id: '12',
      avatarFilename: 'avatar.jpg',
    })).rejects.toBeInstanceOf(AppError)
  })

  it('should update user avatar when already exists', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    
    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );

    const user = await fakeUsersRepository.create({
      name: 'Matheus',
      password: '123123',
      email: 'email@email.com'
    })

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    })

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    })

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg')

    expect(user.avatar).toBe('avatar2.jpg')
})
})
import "reflect-metadata";

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'
import CreateUserService from './CreateUserService'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'
import AppError from "@shared/errors/AppError";

describe('SendForgotPasswordEmail', () => {
  it('should be able to recovery the password using the user email', async () => {

      const fakeUsersRepository = new FakeUsersRepository();
      const fakeMailProvider = new FakeMailProvider();
      const sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
        fakeUsersRepository,
        fakeMailProvider
      );

     const sendEmail = jest.spyOn(fakeMailProvider, 'sendEmail');

      await fakeUsersRepository.create({
        name: 'Jonh Doe',
        email: 'email@email.com',
        password: '123123'
      })

      await sendForgotPasswordEmailService.execute({email: 'email@email.com'})

      expect(sendEmail).toHaveBeenCalled();
  })
})
import IUsersRepository from "../repositories/IUsersRepository";
import { injectable, inject } from "tsyringe";
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider
    ) {}

  public async execute({ email }: IRequest): Promise<void> {
    await this.mailProvider.sendEmail(email, 'Recuperação de senha')
  }
}

export default SendForgotPasswordEmailService;

import IUsersRepository from "../repositories/IUsersRepository";
import { injectable, inject } from "tsyringe";
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import AppError from "@shared/errors/AppError";

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
    ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if(!user) {
      throw new AppError('User does not exists');
    }

    const {token} = await this.userTokensRepository.generate(user.id);

    await this.mailProvider.sendEmail(email, `Recuperação de senha. ${token}`)
  }
}

expo. ${token}rt default SendForgotPasswordEmailService;

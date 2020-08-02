import IUsersRepository from "../repositories/IUsersRepository";
import { injectable, inject } from "tsyringe";
import {differenceInHours} from 'date-fns'
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import AppError from "@shared/errors/AppError";

interface IRequest {
  password: string;
  token: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
    ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if(!userToken) {
      throw new AppError('User token does not exists');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if(!user) {
      throw new AppError('User does not exists');
    }

    const tokenCreatedAt = userToken.created_at;

    if(differenceInHours(tokenCreatedAt, Date.now()) > 2) {
      throw new AppError('The token is invalid.');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;

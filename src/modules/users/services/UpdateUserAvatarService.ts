import User from "@modules/users/infra/typeorm/entities/User";
import fs from "fs";
import path from "path";
import uploadConfig from "@config/upload";
import AppError from "@shared/errors/AppError";
import IUsersRepository from "../repositories/IUsersRepository";
import { injectable, inject } from "tsyringe";
import IStorageProvider from "@shared/container/providers/StorageProvider/models/IStorageProvider";

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,) {}
  
  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    // Verify if exists User
    if (!user) {
      throw new AppError(
        "Only users authenticated can change avatar image.",
        401
      );
    }

    // Verify if exists avatar
    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar)
    }

    // Save new image to user
    const filename = await this.storageProvider.saveFile(avatarFilename)
    
    user.avatar = filename;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;

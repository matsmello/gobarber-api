import User from "@modules/users/infra/typeorm/entities/User";
import fs from "fs";
import path from "path";
import uploadConfig from "@config/upload";
import AppError from "@shared/errors/AppError";
import IUsersRepository from "../repositories/IUsersRepository";
import { injectable, inject } from "tsyringe";

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository) {}
  
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
      //Current avatar paths
      const userAvatarFilePath = path.join(uploadConfig.tmpDir, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      //Remove avatar file
      if (userAvatarFileExists) {
        // Remove from our diskStorage
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    // Save new image to user
    user.avatar = avatarFilename;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;

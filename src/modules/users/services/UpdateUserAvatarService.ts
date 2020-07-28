import { getRepository } from "typeorm";
import User from "../models/User";
import fs from "fs";
import path from "path";
import uploadConfig from "./../config/upload";
import AppError from "../errors/AppError";

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    // Get User
    const usersRepository = await getRepository(User);
    const user = await usersRepository.findOne(user_id);

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

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;

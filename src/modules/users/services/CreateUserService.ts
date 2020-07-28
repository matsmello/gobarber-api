import { getRepository } from "typeorm";
import User from "./../models/User";
import { hash } from "bcryptjs";
import AppError from "../errors/AppError";
interface Request {
  name: string;
  email: string;
  password: string;
}
class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExists = await usersRepository.findOne({ email });

    if (checkUserExists) {
      throw new AppError("Email address already exists", 401);
    }

    const hashedPassword = await hash(password, 8);

    const user = await usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
import {getRepository} from 'typeorm'
import User from './../models/User'
import {hash} from 'bcryptjs'

interface Request {
  name: string;
  email: string;
  password: string;
}
class CreateUserService {
  public async execute({name, email, password}: Request): Promise<User> {
    const usersRepository = getRepository(User)

    const checkUserExists = await usersRepository.findOne({email})

    if (checkUserExists) {
      throw new Error('Email address already exists')
    }

    const hashedPassword = await hash(password, 8);

    const user = await usersRepository.create({ name, email, password: hashedPassword})

    await usersRepository.save(user)

    return user;
  }
}

export default CreateUserService
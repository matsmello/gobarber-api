import User from "@modules/users/infra/typeorm/entities/User";
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from "uuidv4";

class FakeUsersRepository  implements IUsersRepository{
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const user = this.users.find(user => user.id === id);
    return user
  }
  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(user => user.email === email);
    return user
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id == user.id);

    this.users[findIndex] = user;

    return user;
  }


  public async create({email, password, name}: ICreateUserDTO): Promise<User> {
    const newUser = new User();

    Object.assign(newUser, { id: uuid() }, {email, password, name});
    this.users.push(newUser)

    return newUser;
  }
}

export default FakeUsersRepository;

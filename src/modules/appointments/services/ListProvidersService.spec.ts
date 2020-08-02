import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

describe('ListProviders', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let listProviders: ListProvidersService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to show all the providers', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Matheus Mello',
      email: 'email@email.com',
      password: '123456',
    });

    const providers = await listProviders.execute({});

    expect(providers.length).toBe(1);
    expect(providers).toEqual([user]);
  });

  it('should be able to show all the providers without the current user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Matheus Mello',
      email: 'email@email.com',
      password: '123456',
    });

    const providers = await listProviders.execute({ user_id: user.id });

    expect(providers.length).toBe(0);
    expect(providers).toEqual([]);
  });
});

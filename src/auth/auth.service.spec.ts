import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  const registerDto: RegisterDto = {
    name: 'Test User',
    email: 'test.user@test.com',
    password: '123456',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(registerDto),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user', async () => {
    const createSpy = jest.spyOn(usersService, 'create');
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(() => Promise.resolve('$123456'));

    await service.register(registerDto);
    const userDto = {
      name: 'Test User',
      email: 'test.user@test.com',
      password: '$123456',
    };
    expect(createSpy).toHaveBeenCalledWith(userDto);
  });

  // it('should sign in an user', async () => {
  //   const createSpy = jest.spyOn(usersService, 'create');
  //
  //   await service.register(registerDto);
  //   expect(createSpy).toHaveBeenCalledWith(registerDto);
  // });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const registerDto: RegisterDto = {
    name: 'Test User',
    email: 'test.user@test.com',
    password: '123456',
  };

  const loginDto: LoginDto = {
    username: 'test.user@test.com',
    password: '123456',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            signIn: jest.fn().mockResolvedValue({
              access_token: '123456',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register()', () => {
    it('should register a new user', async () => {
      const createSpy = jest.spyOn(service, 'register');

      await controller.register(registerDto);
      expect(createSpy).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('signIn()', () => {
    it('should sign in an user', async () => {
      const createSpy = jest.spyOn(service, 'signIn');

      expect(controller.signIn(loginDto)).resolves.toEqual({
        access_token: '123456',
      });
      expect(createSpy).toHaveBeenCalledWith(
        loginDto.username,
        loginDto.password,
      );
    });
  });
});

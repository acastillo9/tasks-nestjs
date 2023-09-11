import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<void> {
    const hash = await bcrypt.hash(registerDto.password, SALT_ROUNDS);
    const createUserDto: CreateUserDto = {
      ...registerDto,
      password: hash,
    };
    await this.usersService.create(createUserDto);
  }

  async signIn(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    const authorized = await bcrypt.compare(password, user.password);
    if (!authorized) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user._id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

import { Controller, Get, Param, Post } from '@nestjs/common';
import { userInfo } from 'node:os';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { password, ...user } = await this.usersService.create(createUserDto);
    return user;
  }

  @Get(':username')
  async get(
    @Param('username') username: string,
  ): Promise<Omit<User, 'password'>> {
    const { password, ...user } = await this.usersService.findOne(username);
    return user;
  }
}

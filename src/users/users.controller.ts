import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { userInfo } from 'node:os';
import { JwtAuthGuard } from 'src/common/jwt-auth.gurad';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:username')
  async get(
    @Param('username') username: string,
  ): Promise<Omit<User, 'password'>> {
    const { password, ...user } = await this.usersService.findOne(username);
    return user;
  }
}

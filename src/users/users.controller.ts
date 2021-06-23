import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.gurad';
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

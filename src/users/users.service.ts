import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (await this.findOne(createUserDto.username))
      throw new BadRequestException(
        `username "${createUserDto.username}" already exists`,
      );

    createUserDto = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findOne(username: string): Promise<User> {
    return this.usersRepository.findOne({ username });
  }
}

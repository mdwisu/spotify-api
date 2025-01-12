import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string,
  ) {
    const existUser = await this.userRepository.findOneBy({
      email: email,
    });
    if (existUser) {
      throw new InternalServerErrorException(
        `User with email ${email} already exists`,
      );
    }

    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });
    const callback = await this.userRepository.save(user);
    const { password: removedPassword, ...userWithoutPassword } = callback;
    console.log(removedPassword);
    return userWithoutPassword;
  }

  findAll(relations: string[] = []) {
    return this.userRepository.find({ relations });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  async findOne(
    where: Partial<Record<keyof User, any>>,
    relations: string[] = [],
  ) {
    return this.userRepository.findOne({ where, relations });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} ${updateUserDto} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

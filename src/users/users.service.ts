import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} ${updateUserDto} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  // UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
// import { ZodValidationPipe } from '../zod-validation/zod-validation.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '../auth/public.decorator';
// import { CreateUserDto, CreateUserSchema } from './schemas/user.schema';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  // @UsePipes(new ZodValidationPipe(CreateUserSchema))
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(
      body.firstName,
      body.lastName,
      body.email,
      body.password,
      body.role,
    );
  }

  @Get()
  findAll() {
    return this.usersService.findAll(['artist']);
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.usersService.findOne({ id }, ['artist']);
  }
  @Get('pass/:id')
  findByPass(@Param('id') id: number) {
    return this.usersService.findOne({ password: id }, ['artist']);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

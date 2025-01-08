import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  // UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
// import { ZodValidationPipe } from '../zod-validation/zod-validation.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '../auth/public.decorator';
// import { CreateUserDto, CreateUserSchema } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  // @UsePipes(new ZodValidationPipe(CreateUserSchema))
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(
      createUserDto.firstName,
      createUserDto.lastName,
      createUserDto.email,
      createUserDto.password,
      createUserDto.role,
    );
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findByEmail(@Param('id') id: string) {
    return this.usersService.findByEmail(id);
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

import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  admin(@Request() req) {
    return `admin, ${req.user}`;
  }

  @Get('user')
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles('user')
  user() {
    return 'user';
  }

  @Get('adminuser')
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles('admin', 'user')
  adminuser() {
    return 'adminuser';
  }

  @Post('register')
  async register(@Body() body) {
    return this.authService.register(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('me')
  getMe(@Request() req) {
    return req.user;
  }

  @Post('validate')
  async validate(@Body() body) {
    return this.authService.validateUser(body.email, body.password);
  }
}

import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { GithubAuthGuard } from '../guards/github-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

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
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.firstName,
      registerDto.lastName,
      registerDto.email,
      registerDto.password,
    );
  }

  @Post('set-password')
  async setPassword(@Body() body: { token: string; password: string }) {
    // Verifikasi JWT token
    const { email } = this.jwtService.verify(body.token);

    return this.authService.setPassword(email, body.password);
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
  @Roles('user')
  @Get('me')
  getMe(@Request() req) {
    return req.user;
  }

  @Post('validate')
  async validate(@Body() body) {
    return this.authService.validateUser(body.email, body.password);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Req() req) {
    // Hanya memulai proses login
  }
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req) {
    return this.authService.findOrCreateOAuthUser(req.user, 'google');
  }

  @Get('github')
  @UseGuards(GithubAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async githubAuth(@Req() req) {
    // Hanya memulai proses login
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubAuthRedirect(@Req() req) {
    return this.authService.findOrCreateOAuthUser(req.user, 'github');
  }
}

import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private mailService: MailerService,
  ) {}

  async setPassword(email: string, newPassword: string) {
    try {
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        return { message: 'User not found' };
      }
      // Hash password sebelum menyimpannya
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await this.userRepository.save(user);
      return { message: 'Password has been set successfully' };
    } catch (error) {
      console.error('Error setting password:', error);
      throw new Error('Failed to set password. Please try again.');
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    } else if (user && !user.password) {
      await this.sendSetPasswordEmail(email);
      return {
        message:
          'Email ini sudah terdaftar melalui login Google atau GitHub, silakan login dengan itu atau klik link di email untuk membuat password Anda.',
        ignoreJwt: true,
      };
    }
    return null;
  }

  async sendSetPasswordEmail(email: string) {
    const token = this.jwtService.sign({ email });
    const linkSetPassword = `${this.configService.get('FRONTEND_URL')}/auth/set-password?token=${token}`;
    await this.mailService.sendMail({
      to: email,
      subject: 'Set Password',
      html:
        'klik link ini untuk membuat password <a href="' +
        linkSetPassword +
        '">Set Password</a>',
    });
  }

  async login(user: any) {
    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
    if (user.ignoreJwt) return { message: user.message };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    const userExist = await this.userRepository.findOneBy({
      email,
    });
    if (userExist) {
      if (userExist.password) {
        return {
          message: 'User already exist',
        };
      } else {
        await this.sendSetPasswordEmail(email);
        return {
          message:
            'Email ini sudah terdaftar melalui login Google atau GitHub, silakan login dengan itu atau klik link di email untuk membuat password Anda.',
        };
      }
    }
    // Hash password sebelum menyimpannya
    const hashedPassword = await bcrypt.hash(password, 10);
    password = hashedPassword;
    const newUser = this.userRepository.create({
      firstName,
      lastName,
      email,
      password,
    });
    return await this.userRepository.save(newUser);
  }

  async findOrCreateGoogleUser(googleUser: any) {
    try {
      let user = await this.userRepository.findOneBy({
        email: googleUser.email,
      });
      if (!user) {
        const newUser = this.userRepository.create({
          email: googleUser.email,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          googleId: googleUser.googleId,
          role: 'user',
        });
        user = await this.userRepository.save(newUser);
        console.log('Pengguna baru dibuat:', user);
      } else if (!user.googleId) {
        // Jika pengguna ada tapi tidak memiliki googleId, tambahkan googleId
        user.googleId = googleUser.googleId;
        user = await this.userRepository.save(user); // Perbarui pengguna
        console.log('Google ID ditambahkan ke pengguna:', user);
      }
      // Siapkan payload untuk token JWT
      const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };
      // Generate JWT
      const accessToken = this.jwtService.sign(payload);
      return {
        message: 'User logged in successfully',
        access_token: accessToken,
        user: payload, // Kembalikan data pengguna untuk frontend jika diperlukan
      };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to process Google login. Please try again.');
    }
  }
  async findOrCreateGitHubUser(githubUser: any) {
    try {
      console.log(githubUser);
      let user = await this.userRepository.findOneBy({
        email: githubUser.email,
      });
      if (!user) {
        const newUser = this.userRepository.create({
          githubId: githubUser.githubId,
          email: githubUser.email,
          firstName: githubUser.firstName,
          lastName: githubUser.lastName,
        });
        user = await this.userRepository.save(newUser);
        console.log('Pengguna baru dibuat:', user);
      } else if (!user.githubId) {
        user.githubId = githubUser.githubId;
        console.log('Github ID ditambahkan ke pengguna:', user);
      }
      // Siapkan payload untuk token JWT
      const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };
      // Generate JWT
      const accessToken = this.jwtService.sign(payload);
      return {
        message: 'User logged in successfully',
        access_token: accessToken,
        user: payload, // Kembalikan data pengguna untuk frontend jika diperlukan
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findOrCreateOAuthUser(oauthUser: any, provider: 'google' | 'github') {
    try {
      let user = await this.userRepository.findOneBy({
        email: oauthUser.email,
      });

      const providerIdField = provider === 'google' ? 'googleId' : 'githubId';

      if (!user) {
        // Buat pengguna baru jika belum ada
        const newUser = this.userRepository.create({
          email: oauthUser.email,
          firstName: oauthUser.firstName,
          lastName: oauthUser.lastName,
          [providerIdField]: oauthUser[providerIdField],
          role: 'user', // Set default role
        });
        user = await this.userRepository.save(newUser);
        console.log('Pengguna baru dibuat:', user);
      } else if (!user[providerIdField]) {
        // Tambahkan ID provider jika belum ada
        user[providerIdField] = oauthUser[providerIdField];
        user = await this.userRepository.save(user); // Perbarui pengguna
        console.log(`${provider} ID ditambahkan ke pengguna:`, user);
      }

      // Siapkan payload untuk token JWT
      const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };

      // Generate JWT
      const accessToken = this.jwtService.sign(payload);

      return {
        message: 'User logged in successfully',
        access_token: accessToken,
        user: payload, // Kembalikan data pengguna untuk frontend jika diperlukan
      };
    } catch (error) {
      console.error(`Error processing ${provider} login:`, error);
      throw new Error(`Failed to process ${provider} login. Please try again.`);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'), // Ganti dengan GitHub Client ID
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'), // Ganti dengan GitHub Client Secret
      callbackURL: 'http://localhost:3000/auth/github/callback',
      scope: ['user:email'], // Permintaan akses
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    done: Function,
  ): Promise<any> {
    const { username, emails } = profile;
    const user = {
      username,
      email: emails?.[0]?.value,
      accessToken,
    };
    done(null, user);
  }
}

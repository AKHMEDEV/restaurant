import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { AuthProvider } from 'generated/prisma';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const clientID = configService.get('GOOGLE_CLIENT_ID') || 'test_client_id';
    const clientSecret =
      configService.get('GOOGLE_CLIENT_SECRET') || 'test_client_secret';
    const callbackURL =
      configService.get('GOOGLE_CALLBACK_URL') || 'http://localhost:3000/auth/google/redirect';

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, displayName, emails, photos } = profile;

    const userData = {
      fullName: displayName,
      email: emails?.[0]?.value,
      avatarUrl: photos?.[0]?.value,
      provider: AuthProvider.GOOGLE,
      googleId: id,
    };

    const user = await this.authService.googleLogin(userData);

    return done(null, user);
  }
}

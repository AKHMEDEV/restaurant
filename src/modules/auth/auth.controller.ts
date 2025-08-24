import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GoogleRateLimit } from './decorators/google-rate-limit.decorator';
import { GoogleRateLimitGuard } from './guards/google-rate-limit.guard';
import { GoogleRateLimitInterceptor } from './interceptors/google-rate-limit.interceptor';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register') 
  @ApiOperation({ summary: 'users register' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.service.register(dto);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { user };
  }

  @Post('login')
  @ApiOperation({ summary: 'users login' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.service.login(dto);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { user };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'initiate google oauth login' })
  async googleAuth() {
    return { message: 'Google OAuth started' };
  }

  @Get('google/callback')
  @UseGuards(GoogleRateLimitGuard, AuthGuard('google'))
  @GoogleRateLimit()
  @UseInterceptors(GoogleRateLimitInterceptor)
  @ApiOperation({
    summary: 'Handle Google OAuth callback and set auth cookies',
  })
  googleRedirect(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const { tokens } = req.user as { user: any; tokens: any };

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return {
      message: 'Google authentication successful',
      user: req.user.user,
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'logout user and clear cookies' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return { message: 'Logout successful' };
  }
}

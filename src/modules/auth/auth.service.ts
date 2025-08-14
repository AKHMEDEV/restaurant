import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtHelper } from '../../helpers';
import { PrismaService } from '../../prisma';
import { LoginDto, RegisterDto } from './dto';
import { AuthProvider, UserRole } from 'generated/prisma';
import * as bcrypt from 'bcryptjs';
import { MailService } from 'src/nodemailer/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jstHelper: JwtHelper,
    private readonly mailService:MailService
  ) {}

  async register(payload: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: payload.email }, { phone: payload.phone }],
      },
    });

    if (existingUser) {
      throw new BadRequestException('user already exists');
    }

    const hashPassword = await bcrypt.hash(payload.password, 10);

    const user = await this.prisma.user.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        password: hashPassword,
        phone: payload.phone,
        role: UserRole.USER,
        provider: AuthProvider.LOCAL,
      },
    });
    await this.mailService.sendMail({
      to:user.email,
      subject: `Wellcome`,
      html:`<p>Hi <b>  ${user.fullName}!</b></p>
       
      `,
    })
    

    const tokens = await this.jstHelper.generateTokens({
      id: user.id,
      role: user.role,
    });

    return { user, tokens };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      throw new UnauthorizedException('email or password incorrect');
    }

    if (user.provider !== AuthProvider.LOCAL) {
      throw new UnauthorizedException(
        'Siz Google orqali kirgansiz, parol bilan kirmang.',
      );
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('email or password incorect');
    }

    const tokens = await this.jstHelper.generateTokens({
      id: user.id,
      role: user.role,
    });

    return { user, tokens };
  }

  async googleLogin(userData: {
    fullName: string;
    email: string;
    avatarUrl: string;
    provider: AuthProvider;
    googleId: string;
  }) {
    let user = await this.prisma.user.findFirst({
      where: {
        provider: userData.provider,
        googleId: userData.googleId,
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          fullName: userData.fullName,
          email: userData.email,
          avatarUrl: userData.avatarUrl,
          provider: userData.provider,
          googleId: userData.googleId,
        },
      });
      await this.mailService.sendMail({
        to: user.email,
        subject: `Wellcome`,
        html: `<p>Hi <b> ${user.fullName}!</b></p>
    
      `,
      }); 
    }

    const tokens = await this.jstHelper.generateTokens({
      id: user.id,
      role: user.role,
    });

    return { user, tokens };
  }
}

import {
  Injectable,
  NotFoundException,
  ConflictException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { AuthProvider, UserRole } from 'generated/prisma';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async findUserOrThrow(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async validateUniqueFields(
    payload: Partial<CreateUserDto & UpdateUserDto>,
    excludeId?: string,
  ) {
    const uniqueFields: (keyof typeof payload)[] = [
      'fullName',
      'email',
      'phone',
      'telegramChatId',
      'googleId',
    ];

    for (const field of uniqueFields) {
      if (payload[field]) {
        const existing = await this.prisma.user.findFirst({
          where: {
            [field]: payload[field],
            NOT: excludeId ? { id: excludeId } : undefined,
          } as any,
        });

        if (existing) {
          throw new ConflictException(
            `${field} is already used by another user`,
          );
        }
      }
    }
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany();
    return {
      message: 'Users fetched successfully',
      count: users.length,
      data: users,
    };
  }

  async createUser(payload: CreateUserDto) {
    await this.validateUniqueFields(payload);

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        ...payload,
        password: hashedPassword,
        role: payload.role || UserRole.USER,
        provider: AuthProvider.LOCAL,
      },
    });

    return {
      message: 'User created successfully',
      data: newUser,
    };
  }

  async findOneUser(id: string) {
    const user = await this.findUserOrThrow(id);
    return {
      message: 'User fetched successfully',
      data: user,
    };
  }

  async updateUser(id: string, payload: UpdateUserDto) {
    await this.findUserOrThrow(id);
    await this.validateUniqueFields(payload, id);

    const updated = await this.prisma.user.update({
      where: { id },
      data: payload,
    });

    return {
      message: 'User updated successfully',
      data: updated,
    };
  }

  async deleteUser(id: string) {
    await this.findUserOrThrow(id);

    await this.prisma.user.delete({ where: { id } });

    return {
      message: 'User deleted successfully',
    };
  }

  private async seedAdmin() {
    const defaultUsers = [
      {
        fullName: 'john',
        email: 'john@gmail.com',
        password: 'john123',
        role: UserRole.SUPER_ADMIN,
        phone: '+998333053334',
      },
      {
        fullName: 'ahmed',
        email: 'ahmed@gmail.com',
        password: 'ahmed123',
        role: UserRole.ADMIN,
        phone: '+998333053333',
      },
    ];

    for (const user of defaultUsers) {
      const exists = await this.prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!exists) {
        const hashedPassword = bcrypt.hashSync(user.password, 10);

        await this.prisma.user.create({
          data: {
            ...user,
            provider: AuthProvider.LOCAL,
            password: hashedPassword,
          },
        });

        console.log(`✅ ${user.email} created`);
      } else {
        console.log(`🟡 ${user.email} already exists`);
      }
    }
  }
}

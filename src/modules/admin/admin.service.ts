import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, UpdateUserDto } from '../user/dto';
import { AuthProvider, UserRole } from 'generated/prisma';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly allowedRoles: UserRole[] = [
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  ];

  private async validateUniqueFields(
    payload: Partial<UpdateUserDto>,
    excludeId?: string,
  ) {
    const uniqueFields: (keyof UpdateUserDto)[] = ['email', 'phone'];

    for (const field of uniqueFields) {
      if (payload[field]) {
        const existing = await this.prisma.user.findFirst({
          where: {
            [field]: payload[field],
            NOT: { id: excludeId },
          },
        });

        if (existing) {
          throw new BadRequestException(
            `${field} is already used by another user`,
          );
        }
      }
    }
  }

  async getAllAdmins() {
    const admins = await this.prisma.user.findMany({
      where: {
        OR: [{ role: UserRole.ADMIN }, { role: UserRole.SUPER_ADMIN }],
      },
    });

    return {
      message: 'success',
      count: admins.length,
      data: admins,
    };
  }

  async createAdmin(payload: CreateUserDto) {
    await this.validateUniqueFields(payload);

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const newAdmin = await this.prisma.user.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        password: hashedPassword,
        phone: payload.phone,
        role: payload.role || UserRole.ADMIN,
        provider: AuthProvider.LOCAL,
        avatarUrl: payload.avatarUrl,
        telegramChatId: payload.telegramChatId,
      },
    });

    return {
      message: 'Admin created successfully',
      data: newAdmin,
    };
  }

  async getOneAdmin(id: string) {
    const admin = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!admin || !this.allowedRoles.includes(admin.role)) {
      throw new NotFoundException('Admin not found');
    }

    return {
      message: 'success',
      data: admin,
    };
  }

  async updateAdmin(id: string, payload: UpdateUserDto) {
    const admin = await this.prisma.user.findUnique({ where: { id } });

    if (!admin || !this.allowedRoles.includes(admin.role)) {
      throw new NotFoundException('Admin not found');
    }

    await this.validateUniqueFields(payload, id);

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        avatarUrl: payload.avatarUrl,
      },
    });

    return {
      message: 'Admin updated successfully',
      data: updated,
    };
  }

  async deleteAdmin(id: string) {
    const admin = await this.prisma.user.findUnique({ where: { id } });

    if (!admin || !this.allowedRoles.includes(admin.role)) {
      throw new NotFoundException('Admin not found');
    }

    await this.prisma.user.delete({ where: { id } });

    return { message: 'Admin deleted successfully' };
  }
}

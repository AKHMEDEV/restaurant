import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateVendorDto, UpdateVendorDto } from './dto';
import { AuthProvider, UserRole, Prisma } from 'generated/prisma';

@Injectable()
export class VendorService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly role = UserRole.VENDOR;

  async getAllVendors() {
    const vendors = await this.prisma.user.findMany({
      where: { role: this.role },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'success',
      count: vendors.length,
      data: vendors,
    };
  }

  async createVendor(payload: CreateVendorDto) {
    const orInputs: Prisma.UserWhereInput[] = [];

    if (payload.email) orInputs.push({ email: payload.email });
    if (payload.phone) orInputs.push({ phone: payload.phone });

    if (orInputs.length > 0) {
      const exists = await this.prisma.user.findFirst({
        where: { OR: orInputs },
      });

      if (exists) {
        throw new BadRequestException(
          'Vendor with given email or phone already exists',
        );
      }
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const newVendor = await this.prisma.user.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        password: hashedPassword,
        phone: payload.phone,
        role: this.role,
        provider: AuthProvider.LOCAL,
        avatarUrl: payload.avatarUrl,
      },
    });

    return {
      message: 'Vendor created successfully',
      data: newVendor,
    };
  }

  async getOneVendor(id: string) {
    const vendor = await this.prisma.user.findUnique({ where: { id } });

    if (!vendor || vendor.role !== this.role) {
      throw new NotFoundException('Vendor not found');
    }

    return {
      message: 'success',
      data: vendor,
    };
  }

  async updateVendor(id: string, payload: UpdateVendorDto) {
    const vendor = await this.prisma.user.findUnique({ where: { id } });

    if (!vendor || vendor.role !== this.role) {
      throw new NotFoundException('Vendor not found');
    }

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
      message: 'Vendor updated successfully',
      data: updated,
    };
  }

  async deleteVendor(id: string) {
    const vendor = await this.prisma.user.findUnique({ where: { id } });

    if (!vendor || vendor.role !== this.role) {
      throw new NotFoundException('Vendor not found');
    }

    await this.prisma.user.delete({ where: { id } });

    return {
      message: 'Vendor deleted successfully',
    };
  }
}

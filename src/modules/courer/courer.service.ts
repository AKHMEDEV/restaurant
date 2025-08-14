import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from 'generated/prisma';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma';
import { CreateCourierDto, UpdateCourierDto } from './dto';

@Injectable()
export class CouriersService {
  constructor(private readonly prisma: PrismaService) {}

  private async findCourierById(id: string) {
    const courier = await this.prisma.user.findFirst({
      where: { id, role: UserRole.COURIER },
      include: { courierProfile: true },
    });

    if (!courier) throw new NotFoundException('Courier not found');
    return courier;
  }

  async getAllCouriers() {
    const couriers = await this.prisma.user.findMany({
      where: { role: UserRole.COURIER },
      include: {
        courierProfile: true,
        courierOrders: {
          include: {
            items: { include: { menu: true } },
            restaurant: true,
            user: true,
          },
        },
        comments: true,
        notifications: true,
        reactions: true,
        favorites: true,
        auditLogs: true,
        cartItems: { include: { menu: true } },
      },
    });

    return {
      message: 'Couriers fetched successfully',
      data: couriers,
    };
  }

  async findCourierByid(id: string) {
    const courier = await this.prisma.user.findUnique({
      where: { id },
      include: {
        courierProfile: true,
        courierOrders: {
          include: {
            items: { include: { menu: true } },
            restaurant: true,
            user: true,
          },
        },
        comments: true,
        notifications: true,
        reactions: true,
        favorites: true,
        auditLogs: true,
        cartItems: { include: { menu: true } },
      },
    });

    if (!courier) {
      throw new NotFoundException(`Courier with id ${id} not found`);
    }

    return courier;
  }

  async createNewCourer(dto: CreateCourierDto) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { phone: dto.phone }] },
    });

    if (existing)
      throw new BadRequestException('Email or phone already in use');

    const hashedPassword = await bcrypt.hash('courier123', 10);

    const courier = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        role: UserRole.COURIER,
        courierProfile: {
          create: { vehicle: dto.vehicle ?? null },
        },
      },
      include: { courierProfile: true },
    });

    return {
      message: 'Courier created successfully',
      data: courier,
    };
  }

  async updateCourerById(id: string, dto: UpdateCourierDto) {
    const courier = await this.findCourierById(id);

    if (dto.email || dto.phone) {
      const existing = await this.prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                dto.email ? { email: dto.email } : {},
                dto.phone ? { phone: dto.phone } : {},
              ],
            },
          ],
        },
      });

      if (existing)
        throw new BadRequestException('Email or phone already in use');
    }

    const updatedCourier = await this.prisma.user.update({
      where: { id: courier.id },
      data: {
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        courierProfile: dto.vehicle
          ? { update: { vehicle: dto.vehicle } }
          : undefined,
      },
      include: { courierProfile: true },
    });

    return {
      message: 'Courier updated successfully',
      data: updatedCourier,
    };
  }

  async deleteCourerById(id: string) {
    await this.findCourierById(id);
    await this.prisma.user.delete({ where: { id } });

    return { message: 'Courier deleted successfully' };
  }
}

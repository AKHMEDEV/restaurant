import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import { OrderStatus, PaymentStatus, UserRole } from 'generated/prisma';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: dto.restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restoran topilmadi');

    for (const item of dto.items) {
      const menu = await this.prisma.menu.findUnique({
        where: { id: item.menuId },
      });
      if (!menu)
        throw new NotFoundException(`Menyu elementi topilmadi: ${item.menuId}`);
      if (!menu.isAvailable)
        throw new BadRequestException(`${menu.name} mavjud emas`);
    }

    let totalAmount = 0;
    for (const item of dto.items) {
      const menu = await this.prisma.menu.findUnique({
        where: { id: item.menuId },
      });

      if (!menu) {
        throw new NotFoundException(`Menyu elementi topilmadi: ${item.menuId}`);
      }

      totalAmount += menu.price * item.quantity;
    }

    const order = await this.prisma.order.create({
      data: {
        userId,
        restaurantId: dto.restaurantId,
        deliveryAddress: dto.deliveryAddress,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        totalAmount,
        method: dto.deliveryMethod || 'DELIVERY',
        items: {
          create: dto.items.map((i) => ({
            menuId: i.menuId,
            quantity: i.quantity,
            price: 0,
          })),
        },
      },
      include: { items: true },
    });

    return { message: 'Buyurtma yaratildi', data: order };
  }

  async getUserOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { menu: true } },
        restaurant: true,
        courier: { select: { id: true, fullName: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return {
      message: 'buyurtmalaringiz',
      count: orders.length,
      data: orders,
    };
  }

  async getVendorOrders(vendorId: string) {
    const restaurants = await this.prisma.restaurant.findMany({
      where: { ownerId: vendorId },
      select: { id: true },
    });
    const restaurantIds = restaurants.map((r) => r.id);

    const orders = await this.prisma.order.findMany({
      where: { restaurantId: { in: restaurantIds } },
      include: {
        items: { include: { menu: true } },
        user: { select: { id: true, fullName: true, phone: true } },
        courier: { select: { id: true, fullName: true, phone: true } },
        restaurant: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      message: 'Vendor buyurtmalari',
      count: orders.length,
      data: orders,
    };
  }

  async getCourierOrders() {
    const orders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.READY,
        courierId: null,
      },
      include: {
        items: { include: { menu: true } },
        user: { select: { id: true, fullName: true, phone: true } },
        restaurant: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      message: 'Courier uchun tayyor buyurtmalar',
      count: orders.length,
      data: orders,
    };
  }

  async assignCourier(orderId: string, courierId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Buyurtma topilmadi');
    if (order.courierId)
      throw new BadRequestException(
        'Buyurtma allaqachon kurerga biriktirilgan',
      );
    if (order.status !== OrderStatus.READY)
      throw new BadRequestException(
        'Buyurtma courierga faqat READY holatda biriktirilishi mumkin',
      );

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        courierId,
        status: OrderStatus.DELIVERED,
      },
    });

    return { message: 'Buyurtma courierga biriktirildi', data: updatedOrder };
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    userRole: UserRole,
    userId: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { restaurant: { select: { ownerId: true } } },
    });
    if (!order) throw new NotFoundException('Buyurtma topilmadi');

    if (userRole === UserRole.VENDOR && order.restaurant.ownerId !== userId) {
      throw new ForbiddenException('Siz bu buyurtmani boshqara olmaysiz');
    }

    if (userRole === UserRole.COURIER && order.courierId !== userId) {
      throw new ForbiddenException('Siz bu buyurtmaning courieri emassiz');
    }

    if (userRole === UserRole.USER) {
      throw new ForbiddenException('Siz statusni ozgartira olmaysiz');
    }

    const validTransitions = {
      [UserRole.VENDOR]: [
        OrderStatus.PREPARING,
        OrderStatus.READY,
        OrderStatus.CANCELLED,
      ],
      [UserRole.COURIER]: [
        OrderStatus.DELIVERED,
        OrderStatus.DELIVERED,
        OrderStatus.CANCELLED,
      ],
    };

    if (!validTransitions[userRole]?.includes(status)) {
      throw new BadRequestException(
        'Siz ushbu statusga otish huquqiga ega emassiz',
      );
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return { message: 'Buyurtma statusi yangilandi', data: updatedOrder };
  }
}

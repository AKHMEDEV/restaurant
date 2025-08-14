import { Injectable } from '@nestjs/common';
import { OrderStatus, UserRole } from 'generated/prisma';
import { PrismaService } from 'src/prisma';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getOverview(role: UserRole, userId?: string) {
    if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
      const totalUsers = await this.prisma.user.count();
      const totalOrders = await this.prisma.order.count();
      const totalRestaurants = await this.prisma.restaurant.count();
      const revenueData = await this.prisma.order.aggregate({
        _sum: { totalAmount: true },
      });

      return {
        totalUsers,
        totalOrders,
        totalRestaurants,
        totalRevenue: revenueData._sum.totalAmount || 0,
      };
    }

    if (role === UserRole.VENDOR && userId) {
      return this.getVendorStats(userId);
    }

    if (role === UserRole.COURIER && userId) {
      return this.getCourierStats(userId);
    }

    return {
      message:
        'Umumiy statistikalar uchun ruxsat yoq yoki malumot mavjud emas',
    };
  }

  async getVendorStats(vendorId: string) {
    const restaurants = await this.prisma.restaurant.findMany({
      where: { ownerId: vendorId },
      select: { id: true },
    });
    const restaurantIds = restaurants.map((r) => r.id);

    const orders = await this.prisma.order.findMany({
      where: { restaurantId: { in: restaurantIds } },
      select: { totalAmount: true, status: true },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    const statusCounts = orders.reduce(
      (acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      },
      {} as Record<OrderStatus, number>,
    );

    return {
      totalRestaurants: restaurantIds.length,
      totalOrders,
      totalRevenue,
      ordersByStatus: statusCounts,
    };
  }

  async getCourierStats(courierId: string) {
    const orders = await this.prisma.order.findMany({
      where: { courierId },
      select: { totalAmount: true, status: true, createdAt: true },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    const statusCounts = orders.reduce(
      (acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      },
      {} as Record<OrderStatus, number>,
    );

    return {
      totalOrders,
      totalRevenue,
      ordersByStatus: statusCounts,
    };
  }

  async getAdminPanelStats() {
    const ordersByStatus = await this.prisma.order.groupBy({
      by: ['status'],
      _count: { _all: true },
    });

    const revenueByMonth = await this.prisma.$queryRaw<
      { month: number; revenue: number }[]
    >`
      SELECT EXTRACT(MONTH FROM "createdAt") AS month,
             SUM("totalAmount") AS revenue
      FROM "Order"
      WHERE EXTRACT(YEAR FROM "createdAt") = EXTRACT(YEAR FROM NOW())
      GROUP BY month
      ORDER BY month;
    `;

    return {
      ordersByStatus: ordersByStatus.reduce(
        (acc, o) => {
          acc[o.status] = o._count._all;
          return acc;
        },
        {} as Record<OrderStatus, number>,
      ),
      revenueByMonth,
    };
  }

  async getVendorDashboardStats(vendorId: string) {
    const restaurants = await this.prisma.restaurant.findMany({
      where: { ownerId: vendorId },
      select: { id: true },
    });
    const restaurantIds = restaurants.map((r) => r.id);

    const ordersByMonth = await this.prisma.$queryRaw<
      { month: number; totalOrders: number; revenue: number }[]
    >`
      SELECT
        EXTRACT(MONTH FROM "createdAt") AS month,
        COUNT(*) AS "totalOrders",
        SUM("totalAmount") AS revenue
      FROM "Order"
      WHERE "restaurantId" = ANY(${restaurantIds})
        AND EXTRACT(YEAR FROM "createdAt") = EXTRACT(YEAR FROM NOW())
      GROUP BY month
      ORDER BY month;
    `;

    return {
      totalRestaurants: restaurantIds.length,
      ordersByMonth,
    };
  }

  async getAdminDashboardStats() {
    const ordersByMonth = await this.prisma.$queryRaw<
      { month: number; totalOrders: number; revenue: number }[]
    >`
      SELECT
        EXTRACT(MONTH FROM "createdAt") AS month,
        COUNT(*) AS "totalOrders",
        SUM("totalAmount") AS revenue
      FROM "Order"
      WHERE EXTRACT(YEAR FROM "createdAt") = EXTRACT(YEAR FROM NOW())
      GROUP BY month
      ORDER BY month;
    `;

    const ordersByStatus = await this.prisma.order.groupBy({
      by: ['status'],
      _count: { _all: true },
    });

    return {
      ordersByMonth,
      ordersByStatus: ordersByStatus.reduce(
        (acc, o) => {
          acc[o.status] = o._count._all;
          return acc;
        },
        {} as Record<OrderStatus, number>,
      ),
    };
  }

  async getCourierDashboardStats(courierId: string) {
    const dailyStats = await this.prisma.$queryRaw<
      { date: string; totalOrders: number; revenue: number }[]
    >`
      SELECT
        TO_CHAR("createdAt", 'YYYY-MM-DD') AS date,
        COUNT(*) AS "totalOrders",
        SUM("totalAmount") AS revenue
      FROM "Order"
      WHERE "courierId" = ${courierId}
        AND "createdAt" >= NOW() - INTERVAL '7 days'
      GROUP BY date
      ORDER BY date;
    `;

    return dailyStats;
  }
}

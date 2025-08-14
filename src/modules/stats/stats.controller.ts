import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { CheckAuthGuard } from 'src/guards';
import { ApiOperation } from '@nestjs/swagger';

@Controller('stats')
@UseGuards(CheckAuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'all statistics (by role)' })
  async overview(@Req() req) {
    const { role, id } = req.user;
    return this.statsService.getOverview(role, id);
  }

  @Get('vendor/:id')
  @ApiOperation({ summary: 'orders and revenue statistics for the vendor' })
  async vendorStats(@Param('id') id: string) {
    return this.statsService.getVendorStats(id);
  }

  @Get('courier/:id')
  @ApiOperation({ summary: 'orders and income for courier' })
  async courierStats(@Param('id') id: string) {
    return this.statsService.getCourierStats(id);
  }

  @Get('admin-panel')
  @ApiOperation({ summary: 'general graphs for the admin panel' })
  async adminPanelStats() {
    return this.statsService.getAdminPanelStats();
  }

  @Get('vendor-dashboard/:id')
  @ApiOperation({ summary: 'vendor dashboard metrics' })
  async vendorDashboard(@Param('id') id: string) {
    return this.statsService.getVendorDashboardStats(id);
  }

  @Get('admin-dashboard')
  @ApiOperation({ summary: 'admin dashboard metrics' })
  async adminDashboard() {
    return this.statsService.getAdminDashboardStats();
  }

  @Get('courier-dashboard/:id')
  @ApiOperation({ summary: 'courier daily assignments and earnings' })
  async courierDashboard(@Param('id') id: string) {
    return this.statsService.getCourierDashboardStats(id);
  }
}

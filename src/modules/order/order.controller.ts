import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import { CheckAuthGuard } from 'src/guards/check-auth.guard';
import { CheckRoleGuard } from 'src/guards';
import { OrdersService } from './order.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('orders')
@UseGuards(CheckAuthGuard, CheckRoleGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'create order (user)' })
  createOrder(@Req() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'get user orders' })
  @UseGuards(CheckAuthGuard)
  getUserOrders(@Req() req) {
    return this.ordersService.getUserOrders(req.user.id);
  }

  @Get('vendor')
  @UseGuards(CheckAuthGuard)
  @ApiOperation({ summary: 'get vendor order' })
  getVendorOrders(@Req() req) {
    return this.ordersService.getVendorOrders(req.user.id);
  }

  @Get('courier')
  @ApiOperation({ summary: 'new orders for courers' })
  @UseGuards(CheckAuthGuard)
  getCourierOrders() {
    return this.ordersService.getCourierOrders();
  }

  @Put(':id/assign')
  @ApiOperation({ summary: 'couriers accepting order' })
  @UseGuards(CheckAuthGuard)
  assignCourier(@Req() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.assignCourier(id, req.user.id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'change order status (vendor and courer)' })
  @UseGuards(CheckAuthGuard)
  updateOrderStatus(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(
      id,
      dto.status,
      req.user.role,
      req.user.id,
    );
  }
}

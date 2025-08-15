import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Get,
  Req,
  UseGuards,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Request } from 'express';
import { CheckAuthGuard } from 'src/guards';
import { AddToCartDto } from './dto';

@UseGuards(CheckAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private service: CartService) {}

  @Post('add')
  addToCart(@Req() req: Request, @Body() dto: AddToCartDto) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User not authenticated');

    return this.service.addToCart(userId, dto.menuId, dto.quantity);
  }

  @Patch('update')
  updateCart(@Req() req: Request, @Body() dto: AddToCartDto) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User not authenticated');

    return this.service.updateCartItem(userId, dto.menuId, dto.quantity);
  }

  @Delete(':menuId')
  removeFromCart(@Req() req: Request, @Param('menuId') menuId: string) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User not authenticated');

    return this.service.removeFromCart(userId, menuId);
  }

  @Get()
  getUserCart(@Req() req: Request) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User not authenticated');

    return this.service.getUserCart(userId);
  }
}

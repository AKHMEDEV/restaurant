import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto';
import { Roles } from 'src/decorators';
import { UserRole } from 'generated/prisma';
import { CheckAuthGuard, CheckRoleGuard } from 'src/guards';
import { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly service: RestaurantService) {}

  @ApiOperation({ summary: 'get all restaurants info' })
  @Get()
  @UseGuards(CheckAuthGuard, CheckRoleGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.VENDOR)
  async getAll() {
    return this.service.getAll();
  }

  @ApiOperation({
    summary: 'create a new restaurant (admin)',
  })
  @UseGuards(CheckAuthGuard, CheckRoleGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.VENDOR)
  @Post()
  async create(@Req() req: Request, @Body() payload: CreateRestaurantDto) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User not authenticated');

    return this.service.create(payload, userId);
  }

  @ApiOperation({ summary: 'get restaurant details by ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'update restaurant by ID (vendor or admin)' })
  @UseGuards(CheckAuthGuard, CheckRoleGuard)
  @Roles(UserRole.VENDOR, UserRole.SUPER_ADMIN)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateRestaurantDto,
    @Req() req: Request,
  ) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User not authenticated');

    return this.service.update(id, payload, userId);
  }

  @ApiOperation({ summary: 'delete restaurant by ID (vendor or admin)' })
  @UseGuards(CheckAuthGuard, CheckRoleGuard)
  @Roles(UserRole.VENDOR)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User not authenticated');

    return this.service.delete(id, userId);
  }

  @ApiOperation({ summary: 'get all menus for given restaurant ID ' })
  @Get(':id/menus')
  async getMenus(@Param('id') id: string) {
    const restaurant = await this.service.findOne(id);
    return {
      message: 'success',
      count: restaurant.data.menus.length,
      data: restaurant.data.menus,
    };
  }

  @ApiOperation({
    summary: 'Get all reviews (comments) for given restaurant ID',
  })
  @Get(':id/reviews')
  async getReviews(@Param('id') id: string) {
    const restaurant = await this.service.findOne(id);
    return {
      message: 'success',
      count: restaurant.data.comments.length,
      data: restaurant.data.comments,
    };
  }

  @ApiOperation({ summary: 'get the likes count given restaurant ID' })
  @Get(':id/likes')
  async getLikes(@Param('id') id: string) {
    const likesCount = await this.service['prisma'].reaction.count({
      where: {
        targetType: 'RESTAURANT',
        targetId: id,
        type: 'LIKE',
      },
    });

    return {
      message: 'success',
      likes: likesCount,
    };
  }

  @Post(':restaurantId/images')
  @ApiOperation({ summary: 'Upload multiple images for a restaurant' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
      required: ['images'],
    },
  })
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadImages(
    @Param('restaurantId') restaurantId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.service.uploadRestaurantImages(restaurantId, files);
  }
}

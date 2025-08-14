import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { Roles } from 'src/decorators';
import { UserRole } from 'generated/prisma';
import { CheckRoleGuard } from 'src/guards';
import { CreateMenuDto, UpdateMenuDto } from './dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('menus')
export class MenuController {
  constructor(private readonly service: MenuService) {}

  @Get()
  @ApiOperation({ summary: 'get all menus (admin and vendor)' })
  @UseGuards(CheckRoleGuard)
  @Roles(UserRole.VENDOR, UserRole.SUPER_ADMIN)
  async getAllMenus() {
    return this.service.getAll();
  }

  @Post()
  @ApiOperation({ summary: 'create a new menu (vendor and admin)' })
  @UseGuards(CheckRoleGuard)
  @Roles(UserRole.VENDOR, UserRole.SUPER_ADMIN)
  async createMenu(@Body() payload: CreateMenuDto) {
    return this.service.create(payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get menu details by ID' })
  @UseGuards(CheckRoleGuard)
  @Roles(UserRole.VENDOR, UserRole.SUPER_ADMIN)
  async getMenuById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'update menu by ID (vendor and admin)' })
  @UseGuards(CheckRoleGuard)
  @Roles(UserRole.VENDOR, UserRole.SUPER_ADMIN)
  async updateMenu(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateMenuDto,
  ) {
    return this.service.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete menu by ID (vendor and admin)' })
  @UseGuards(CheckRoleGuard)
  @Roles(UserRole.VENDOR)
  async deleteMenu(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.delete(id);
  }
}

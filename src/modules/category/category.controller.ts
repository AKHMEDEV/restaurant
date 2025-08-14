import { ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Post, UseGuards, Body, Param } from '@nestjs/common';
import { Roles } from 'src/decorators';
import { UserRole } from 'generated/prisma';
import { CheckRoleGuard } from 'src/guards';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @UseGuards(CheckRoleGuard)
  @ApiOperation({ summary: 'Get all categories' })
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VENDOR)
  @Get()
  async getAll() {
    return this.service.getAll();
  }

  @Get('menus/by-name/:categoryName')
  @ApiOperation({ summary: 'Get menus by category name' })
  async getMenusByCategoryName(@Param('categoryName') categoryName: string) {
    return this.service.getMenusByCategoryName(categoryName);
  }

  @UseGuards(CheckRoleGuard)
  @ApiOperation({ summary: 'Create category' })
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post()
  async create(@Body() payload: CreateCategoryDto) {
    return this.service.create(payload);
  }
}

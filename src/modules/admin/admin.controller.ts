import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateUserDto, UpdateUserDto } from '../user/dto';
import { Roles } from 'src/decorators';
import { CheckRoleGuard } from 'src/guards';
import { UserRole } from 'generated/prisma';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admins')
@Controller('admins')
@UseGuards(CheckRoleGuard)
@Roles(UserRole.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'get all admins ' })
  getAllAdmins() {
    return this.service.getAllAdmins();
  }

  @Post()
  @ApiOperation({ summary: 'create a new admin' })
  createAdmin(@Body() payload: CreateUserDto) {
    return this.service.createAdmin(payload);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'get one admin',
  })
  getOneAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getOneAdmin(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'update admin by ID ' })
  updateAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateUserDto,
  ) {
    return this.service.updateAdmin(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete admin by ID' })
  deleteAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.deleteAdmin(id);
  }
}

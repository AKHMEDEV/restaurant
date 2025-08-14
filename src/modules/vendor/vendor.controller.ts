import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Roles } from 'src/decorators';
import { UserRole } from 'generated/prisma';
import { CheckRoleGuard } from 'src/guards';
import { ApiOperation } from '@nestjs/swagger';

@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @ApiOperation({ summary: 'get all vendors (admin)' })
  @UseGuards(CheckRoleGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get()
  async findAll() {
    return this.vendorService.getAllVendors();
  }

  @ApiOperation({ summary: 'create a new vendor (admin)' })
  @UseGuards(CheckRoleGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post()
  async create(@Body() dto: CreateVendorDto) {
    return this.vendorService.createVendor(dto);
  }

  @ApiOperation({
    summary: 'get onw vendor by id (admin)',
  })
  @UseGuards(CheckRoleGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vendorService.getOneVendor(id);
  }

  @ApiOperation({ summary: 'update vendor info (admin)' })
  @UseGuards(CheckRoleGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVendorDto,
  ) {
    return this.vendorService.updateVendor(id, dto);
  }

  @ApiOperation({ summary: 'delete vendor by id (admin)' })
  @UseGuards(CheckRoleGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.vendorService.deleteVendor(id);
  }
}

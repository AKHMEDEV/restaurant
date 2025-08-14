import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateCourierDto, UpdateCourierDto } from './dto';
import { CouriersService } from './courer.service';
import { ApiOperation } from '@nestjs/swagger';
import { CheckRoleGuard } from 'src/guards';
import { UserRole } from 'generated/prisma';
import { Roles } from 'src/decorators';

@Controller('couriers')
export class CouriersController {
  constructor(private readonly service: CouriersService) {}

  @ApiOperation({ summary: 'Retrieve a list of all couriers' })
  @UseGuards(CheckRoleGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get()
  getAllCouriers() {
    return this.service.getAllCouriers();
  }

  @ApiOperation({
    summary: 'Retrieve detailed information about a courier by ID',
  })
  @UseGuards(CheckRoleGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get(':id')
  getOneCourier(@Param('id') id: string) {
    return this.service.findCourierByid(id);
  }

  @ApiOperation({ summary: 'Create a new courier with provided details' })
  @UseGuards(CheckRoleGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  createCourier(@Body() dto: CreateCourierDto) {
    return this.service.createNewCourer(dto);
  }

  @ApiOperation({ summary: 'Update an existing courier by ID' })
  @UseGuards(CheckRoleGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Put(':id')
  updateCourier(@Param('id') id: string, @Body() dto: UpdateCourierDto) {
    return this.service.updateCourerById(id, dto);
  }

  @ApiOperation({ summary: 'Delete a courier by ID' })
  @UseGuards(CheckRoleGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':id')
  deleteCourier(@Param('id') id: string) {
    return this.service.deleteCourerById(id);
  }
}

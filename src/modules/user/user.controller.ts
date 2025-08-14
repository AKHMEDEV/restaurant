import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators';
import { UserRole } from 'generated/prisma';
import { CheckRoleGuard } from 'src/guards';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Request } from 'express';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  @ApiOperation({ summary: 'get all users' })
  @UseGuards(CheckRoleGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async getAll() {
    return this.service.getAllUsers();
  }

  @Post()
  @ApiOperation({ summary: 'create a new user' })
  @UseGuards(CheckRoleGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async create(@Body() dto: CreateUserDto) {
    return this.service.createUser(dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'get user profile' })
  async getMe(@Req() req: Request) {
    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User not authenticated');

    return this.service.findOneUser(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'get one user by id (admin)',
  })
  @UseGuards(CheckRoleGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOneUser(id);
  }

  @Put('me')
  @ApiOperation({ summary: 'update current user profile' })
  async updateMe(@Req() req: Request, @Body() payload: UpdateUserDto) {
    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User not authenticated');

    return this.service.updateUser(userId, payload);
  }

  @Put(':id')
  @ApiOperation({ summary: 'update user info (admin)' })
  @UseGuards(CheckRoleGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateUserDto,
  ) {
    return this.service.updateUser(id, payload);
  }

  @Delete('me')
  @ApiOperation({ summary: 'tipa logout ozizni ozi ochiradi' })
  async deleteMe(@Req() req: Request) {
    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User not authenticated');

    return this.service.deleteUser(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete user by id (admin)' })
  @UseGuards(CheckRoleGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.deleteUser(id);
  }
}

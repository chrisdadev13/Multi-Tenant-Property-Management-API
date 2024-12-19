import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  Post,
  Request,
  Param,
  Put,
  Get,
  Query,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreateDto } from './dto/create.dto';
import { AddressDto } from './dto/address.dto';
import { UpdateDto } from './dto/update.dto';
import { Permissions } from 'src/permissions/permissions.decorator';
import { PermissionGuard } from 'src/permissions/permissions.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import mongoose from 'mongoose';
import { SearchDto } from './dto/search.dto';

@Controller({
  path: 'properties',
  version: '1',
})
@UseGuards(AuthGuard)
@UseGuards(PermissionGuard)
export class PropertiesController {
  constructor(private PropertiesService: PropertiesService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  @Permissions('properties:create')
  create(@Request() req: Request, @Body() createDto: CreateDto) {
    return this.PropertiesService.create({
      name: createDto.name,
      address: createDto.address as AddressDto,
      tenant: new mongoose.Types.ObjectId(req['user'].tenant as string),
      owner: new mongoose.Types.ObjectId(req['user'].sub as string),
      assignedUsers: createDto.assignedUsers.map(
        (id) => new mongoose.Types.ObjectId(id),
      ),
    });
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @Permissions('properties:update')
  update(@Param() params: { id: string }, @Body() updateDto: UpdateDto) {
    const { owner, assignedUsers, ...rest } = updateDto;

    return this.PropertiesService.update(params.id, {
      ...rest,
      owner: owner ? new mongoose.Types.ObjectId(owner) : undefined,
      assignedUsers: assignedUsers
        ? assignedUsers.map((id) => new mongoose.Types.ObjectId(id))
        : undefined,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get('search')
  @Permissions('properties:read')
  search(@Query() searchDto: SearchDto) {
    return this.PropertiesService.search(
      searchDto.tenantId,
      searchDto.searchParam,
    );
  }
}

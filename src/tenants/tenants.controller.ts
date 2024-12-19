import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Put,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateDto } from './dto/create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Types } from 'mongoose';
import { Permissions } from 'src/permissions/permissions.decorator';
import { PermissionGuard } from 'src/permissions/permissions.guard';

@Controller({
  path: 'tenants',
  version: '1',
})
@UseGuards(AuthGuard)
@UseGuards(PermissionGuard)
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  create(@Request() req: Request, @Body() createDto: CreateDto) {
    return this.tenantsService.create({
      name: createDto.name,
      contactPhone: createDto.contactPhone,
      contactEmail: createDto.contactEmail,
      owner: new Types.ObjectId(req['user'].sub as string),
    });
  }
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param() params: { id: string }) {
    return this.tenantsService.findOne(params.id);
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @Permissions('tenancies:update')
  update(@Param() params: { id: string }, @Body() createDto: CreateDto) {
    return this.tenantsService.update(params.id, {
      name: createDto.name,
      contactPhone: createDto.contactPhone,
      contactEmail: createDto.contactEmail,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @Permissions('tenancies:delete')
  delete(@Param() params: { id: string }) {
    return this.tenantsService.delete(params.id);
  }
}

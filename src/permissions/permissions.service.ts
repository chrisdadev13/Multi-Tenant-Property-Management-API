import { Injectable } from '@nestjs/common';
import { Permission } from './model/permissions.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDto } from './dto/create.dto';
import { SYSTEM_PERMISSIONS } from './constants';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
  ) {}

  async createPermission(data: CreateDto): Promise<Permission> {
    const resource = data.resource.toLowerCase();
    const action = data.action.toLowerCase();

    return this.permissionModel.create({
      ...data,
      resource,
      action,
    });
  }

  async createSystemPermissions(): Promise<void> {
    try {
      for (const permission of SYSTEM_PERMISSIONS) {
        console.log(permission);
        await this.permissionModel.create(permission);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionModel.find().sort({ resource: 1, action: 1 });
  }

  async findByResourceAndAction(
    resource: string,
    action: string,
  ): Promise<Permission> {
    return this.permissionModel.findOne({
      resource: resource.toLowerCase(),
      action: action.toLowerCase(),
    });
  }
  async initializeSystemPermissions(): Promise<void> {
    for (const permission of SYSTEM_PERMISSIONS) {
      await this.permissionModel.updateOne(
        {
          resource: permission.resource,
          action: permission.action,
        },
        {
          $setOnInsert: permission,
        },
        { upsert: true },
      );
    }
  }
}

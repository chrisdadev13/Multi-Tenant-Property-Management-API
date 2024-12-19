import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './model/roles.model';
import { PermissionsService } from 'src/permissions/permissions.service';
import { CreateDto } from './dto/create.dto';
import { RoleTemplates } from './constants';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private permissionsService: PermissionsService,
  ) {}

  async createRole(tenantId: string, data: CreateDto): Promise<Role> {
    const role = new this.roleModel({
      ...data,
      tenant: tenantId,
      permissions: [],
    });
    return role.save();
  }

  async addPermissionsToRole(
    roleId: string,
    permissionIds: string[],
  ): Promise<Role> {
    return this.roleModel
      .findByIdAndUpdate(
        roleId,
        {
          $addToSet: {
            permissions: {
              $each: permissionIds,
            },
          },
        },
        { new: true },
      )
      .populate('permissions');
  }

  async findAdminRole(tenantId: string): Promise<Role> {
    return this.roleModel.findOne({ tenant: tenantId, name: 'Admin' });
  }

  async removePermissionFromRole(
    roleId: string,
    permissionId: string,
  ): Promise<Role> {
    return this.roleModel
      .findByIdAndUpdate(
        roleId,
        {
          $pull: {
            permissions: permissionId,
          },
        },
        { new: true },
      )
      .populate('permissions');
  }

  async createDefaultTenantRoles(tenantId: string): Promise<void> {
    const allPermissions = await this.permissionsService.findAll();

    const permissionMap = new Map(
      allPermissions.map((p) => [`${p.resource}:${p.action}`, p._id]),
    );

    const roleCreationPromises = Object.values(RoleTemplates).map(
      (template) => {
        const permissionIds = template.permissionRules.flatMap((rule) =>
          rule.actions
            .map((action) => permissionMap.get(`${rule.resource}:${action}`))
            .filter(Boolean),
        );

        return this.roleModel.create({
          name: template.name,
          description: template.description,
          tenant: tenantId,
          permissions: permissionIds,
        });
      },
    );

    await Promise.all(roleCreationPromises);
  }

  async checkPermission(
    roleId: string,
    resource: string,
    action: string,
  ): Promise<boolean> {
    const permission = await this.permissionsService.findByResourceAndAction(
      resource,
      action,
    );
    if (!permission) return false;

    const role = await this.roleModel.findOne({
      _id: roleId,
      permissions: permission._id,
    });

    return !!role;
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from './model/tenants.model';
import { User } from 'src/users/model/users.model';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<Tenant>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly rolesService: RolesService,
  ) {}

  async create(tenant: Omit<Tenant, '_id'>): Promise<Tenant> {
    const tenantExists = await this.tenantModel.exists({
      contactEmail: tenant.contactEmail,
    });
    if (tenantExists) {
      throw new ConflictException('Tenant with this email already exists');
    }

    const owner = await this.userModel.findById(tenant.owner);
    if (!owner) {
      throw new NotFoundException('Owner user not found');
    }

    const newTenant = await this.tenantModel.create(tenant);

    await this.rolesService.createDefaultTenantRoles(newTenant._id);

    const adminRole = await this.rolesService.findAdminRole(newTenant._id);

    await this.userModel.updateOne(
      { _id: tenant.owner },
      { role: adminRole._id, tenant: newTenant._id },
    );

    return newTenant;
  }

  async update(id: string, tenant: Partial<Tenant>): Promise<Tenant> {
    if (tenant.contactEmail) {
      const alreadyExists = await this.tenantModel.exists({
        contactEmail: tenant.contactEmail,
        _id: { $ne: id },
      });

      if (alreadyExists) {
        throw new ConflictException({
          message: 'Tenant with this email already exists',
        });
      }
    }

    return this.tenantModel.findByIdAndUpdate(
      id,
      { $set: tenant },
      { new: true },
    );
  }

  async delete(id: string): Promise<Tenant> {
    return this.tenantModel.findByIdAndDelete(id);
  }
  async findOne(id: string): Promise<Tenant> {
    return this.tenantModel.findById(id);
  }
}

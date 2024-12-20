import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Tenant } from './model/tenants.model';
import { User } from 'src/users/model/users.model';
import { RolesService } from 'src/roles/roles.service';
import { Job } from 'src/jobs/model/jobs.model';
import { Property } from 'src/properties/model/properties.model';
import { Tenancy } from 'src/tenancies/model/tenancies.model';

interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<Tenant>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Job.name) private readonly jobModel: Model<Job>,
    @InjectModel(Property.name) private readonly propertyModel: Model<Property>,
    @InjectModel(Tenancy.name) private readonly tenancyModel: Model<Tenancy>,
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

  async getDashboardData(tenantId: string, pagination?: PaginationOptions) {
    const tenant = new mongoose.Types.ObjectId(tenantId);

    const page = Number(pagination.page) ?? 1;
    const limit = Number(pagination.limit) ?? 10;
    const skip = (page - 1) * limit;

    const sortField = pagination.sortBy ?? 'createdAt';
    const sortOrder = pagination.sortOrder === 'desc' ? -1 : 1;

    const paginando = await this.userModel.aggregate([
      {
        $sort: {
          [sortField]: sortOrder,
        },
      },
      {
        $match: { tenant },
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'role',
        },
      },
      {
        $unwind: '$role',
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          name: true,
          email: true,
          role: '$role.name',
        },
      },
    ]);

    console.log(paginando);

    const [propertyStats, tenancyStats, jobStats, userStats, totalUsers] =
      await Promise.all([
        this.propertyModel.countDocuments({ tenant }),
        this.tenancyModel.aggregate([
          {
            $match: {
              tenant,
              status: 'active',
              endDate: { $gt: new Date() },
            },
          },
          {
            $count: 'total',
          },
        ]),
        this.jobModel.aggregate([
          {
            $match: { tenant },
          },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ]),
        this.userModel.aggregate([
          {
            $sort: {
              [sortField]: sortOrder,
            },
          },
          {
            $match: { tenant },
          },
          {
            $lookup: {
              from: 'roles',
              localField: 'role',
              foreignField: '_id',
              as: 'role',
            },
          },
          {
            $unwind: '$role',
          },
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
          {
            $project: {
              name: true,
              email: true,
              role: '$role.name',
            },
          },
        ]),
        this.userModel.aggregate([
          {
            $match: { tenant },
          },
          {
            $count: 'total',
          },
        ]),
      ]);

    const totalPages = Math.ceil((totalUsers[0]?.total || 0) / limit);

    return {
      totalProperties: propertyStats,
      totalActiveTenancies: tenancyStats[0]?.total || 0,
      jobStatusBreakdown: jobStats.map(({ _id, count }) => ({
        status: _id,
        count,
      })),
      users: {
        data: userStats.map(({ name, email, role }) => ({
          name,
          email,
          role,
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalUsers[0]?.total || 0,
          itemsPerPage: limit,
        },
      },
    };
  }

  async delete(id: string): Promise<Tenant> {
    return this.tenantModel.findByIdAndDelete(id);
  }
  async findOne(id: string): Promise<Tenant> {
    return this.tenantModel.findById(id);
  }
}

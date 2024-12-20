import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './model/jobs.model';
import { Model, Types } from 'mongoose';
import { User } from 'src/users/model/users.model';
import { Property } from 'src/properties/model/properties.model';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<Job>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Property.name) private propertyModel: Model<User>,
  ) {}

  async getJobsGroupedByStatus(tenantId: Types.ObjectId) {
    return this.jobModel.aggregate([
      {
        $match: {
          tenant: tenantId,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedUser',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: {
          path: '$userDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          users: {
            $push: {
              _id: '$userDetails._id',
              name: '$userDetails.name',
              email: '$userDetails.email',
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
          users: 1,
        },
      },

      {
        $sort: {
          status: 1,
        },
      },
    ]);
  }

  async assingJobToUser({
    tenantId,
    propertyId,
    userId,
    description,
    dueDate,
  }: {
    tenantId: string;
    propertyId: Types.ObjectId;
    userId: Types.ObjectId;
    description: string;
    dueDate: Date;
  }) {
    const user = await this.userModel.findOne({
      _id: userId,
      tenant: tenantId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const property = await this.propertyModel.findOne({
      _id: propertyId,
      tenant: tenantId,
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const job = await this.jobModel.create({
      tenant: tenantId,
      property: propertyId,
      assignedUser: userId,
      status: 'pending',
      description,
      dueDate,
    });

    return job;
  }
}

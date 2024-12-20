import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './model/jobs.model';
import { Model } from 'mongoose';
import { User } from 'src/users/model/users.model';
import { Property } from 'src/properties/model/properties.model';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<Job>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Property.name) private propertyModel: Model<User>,
  ) {}

  async assingJobToUser(
    tenantId: string,
    propertyId: string,
    jobId: string,
    userId: string,
  ) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.tenant.toString() !== tenantId) {
      throw new NotFoundException('User not found in this tenant team');
    }

    const property = await this.propertyModel.findOne({
      _id: propertyId,
      tenant: tenantId,
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const job = await this.jobModel.findByIdAndUpdate(jobId, {
      property: propertyId,
      assignedUser: userId,
    });

    return job;
  }
}

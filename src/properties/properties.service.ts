import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Property } from './model/properties.model';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property.name) private readonly propertyModel: Model<Property>,
  ) {}

  async create(property: Omit<Property, '_id'>): Promise<Property> {
    return this.propertyModel.create(property);
  }

  async search(tenantId: string, searchQuery: string): Promise<Property[]> {
    const aggregationPipelines: mongoose.PipelineStage[] = [
      {
        $match: {
          tenant: new mongoose.Types.ObjectId(tenantId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedUsers',
          foreignField: '_id',
          as: 'assignedUsers',
          pipeline: [
            {
              $project: {
                _id: true,
                name: true,
                email: true,
              },
            },
          ],
        },
      },
      {
        $match: {
          $or: [
            {
              name: {
                $regex: searchQuery,
                $options: 'i',
              },
            },
            {
              'assignedUsers.name': {
                $regex: searchQuery,
                $options: 'i',
              },
            },
            {
              'assignedUsers.email': {
                $regex: searchQuery,
                $options: 'i',
              },
            },
            {
              'address.city': {
                $regex: searchQuery,
                $options: 'i',
              },
            },
            {
              'address.state': {
                $regex: searchQuery,
                $options: 'i',
              },
            },
            {
              'address.street': {
                $regex: searchQuery,
                $options: 'i',
              },
            },
          ],
        },
      },
    ];

    try {
      const properties =
        await this.propertyModel.aggregate(aggregationPipelines);

      return properties;
    } catch (error) {
      console.error(error);
    }
  }

  async update(id: string, property: Partial<Property>): Promise<Property> {
    return this.propertyModel.findByIdAndUpdate(id, property, { new: true });
  }

  async delete(id: string): Promise<Property> {
    return this.propertyModel.findByIdAndDelete(id);
  }
}

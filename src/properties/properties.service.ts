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
    const isSearchingByAssignedUser =
      mongoose.Types.ObjectId.isValid(searchQuery);

    const properties = this.propertyModel.aggregate([
      {
        $match: {
          tenant: new mongoose.Types.ObjectId(tenantId),
        },
      },
    ]);

    return properties;
  }

  async update(id: string, property: Partial<Property>): Promise<Property> {
    return this.propertyModel.findByIdAndUpdate(id, property, { new: true });
  }

  async delete(id: string): Promise<Property> {
    return this.propertyModel.findByIdAndDelete(id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobHistory, JobHistoryDocument } from './model/job-history.model';

@Injectable()
export class JobHistoryService {
  constructor(
    @InjectModel(JobHistory.name)
    private jobHistoryModel: Model<JobHistoryDocument>,
  ) {}

  async logAssignment(
    jobHistoryData: Partial<JobHistory>,
  ): Promise<JobHistory> {
    const newJobHistory = new this.jobHistoryModel({
      ...jobHistoryData,
      action: 'ASSIGNED',
    });
    return newJobHistory.save();
  }
}

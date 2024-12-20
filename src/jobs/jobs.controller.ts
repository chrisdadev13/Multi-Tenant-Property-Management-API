import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionGuard } from 'src/permissions/permissions.guard';
import { JobsService } from './jobs.service';
import { AssignDto } from './dto/assign.dto';
import { JobHistoryService } from 'src/job-history/job-history.service';
import { Permissions } from 'src/permissions/permissions.decorator';
import mongoose from 'mongoose';

@Controller({
  path: 'jobs',
  version: '1',
})
@UseGuards(AuthGuard)
@UseGuards(PermissionGuard)
export class JobsController {
  constructor(
    private jobsService: JobsService,
    private jobsHistory: JobHistoryService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('status')
  @Permissions('jobs:read')
  async status(@Request() req: Request) {
    return this.jobsService.getJobsGroupedByStatus(
      new mongoose.Types.ObjectId(req['user'].tenant as string),
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('assign')
  @Permissions('jobs:assign')
  async assignJobToUser(
    @Request() req: Request,
    @Body() assignJobDto: AssignDto,
  ) {
    const assignedJob = await this.jobsService.assingJobToUser({
      propertyId: new mongoose.Types.ObjectId(assignJobDto.propertyId),
      userId: new mongoose.Types.ObjectId(assignJobDto.userId),
      tenantId: req['user'].tenant,
      description: assignJobDto.description,
      dueDate: assignJobDto.dueDate,
    });

    try {
      await this.jobsHistory.logAssignment({
        jobId: new mongoose.Types.ObjectId(assignedJob._id),
        assignedBy: new mongoose.Types.ObjectId(req['user'].sub as string),
        assignedTo: new mongoose.Types.ObjectId(assignJobDto.userId),
        tenantId: new mongoose.Types.ObjectId(req['user'].tenant as string),
        action: 'ASSIGNED',
      });
    } catch (error) {
      console.error(error);
    }

    return assignedJob;
  }
}

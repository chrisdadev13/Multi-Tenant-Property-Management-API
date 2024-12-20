import { Module } from '@nestjs/common';
import { JobHistoryService } from './job-history.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JobHistory, JobHistorySchema } from './model/job-history.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobHistory.name, schema: JobHistorySchema },
    ]),
  ],
  providers: [JobHistoryService],
})
export class JobHistoryModule {}

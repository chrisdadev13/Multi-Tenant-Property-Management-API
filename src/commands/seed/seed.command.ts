import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { seed } from './database.seeder';

@Injectable()
export class SeedCommand {
  constructor(@InjectConnection() private connection: Connection) {}

  @Command({
    command: 'db:seed',
    describe: 'Seed the database with initial data',
  })
  async run(): Promise<void> {
    try {
      await seed(this.connection);
      console.log('Database seeded successfully!');
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    }
  }
}

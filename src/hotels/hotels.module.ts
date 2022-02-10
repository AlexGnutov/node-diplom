import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { DatabaseModule } from '../database/database.module';
import { HotelsProviders } from './hotels.providers';

@Module({
  imports: [DatabaseModule],
  providers: [HotelsService, ...HotelsProviders],
  exports: [HotelsService],
  controllers: [HotelsController],
})
export class HotelsModule {}

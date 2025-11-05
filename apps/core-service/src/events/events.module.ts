import { Module } from '@nestjs/common';
import { UserEventsController } from './user-events.controller';
import { EventLoggerController } from './event-logger.controller';
import { PrismaModule } from '@app/database';

@Module({
  imports: [PrismaModule],
  controllers: [UserEventsController, EventLoggerController],
})
export class EventsModule {}
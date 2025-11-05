import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '@app/database';
import { EventsModule } from '@app/events'; // ← TAMBAH INI

@Module({
  imports: [
    PrismaModule,
    EventsModule, // ← TAMBAH INI
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
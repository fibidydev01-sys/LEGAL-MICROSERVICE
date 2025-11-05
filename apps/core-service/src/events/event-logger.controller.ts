import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PrismaService } from '@app/database';

@Controller()
export class EventLoggerController {
  private readonly logger = new Logger(EventLoggerController.name);

  constructor(private prisma: PrismaService) {}

  @EventPattern('*')
  async logAllEvents(@Payload() data: any) {
    this.logger.debug(`Event received: ${JSON.stringify(data)}`);
    
    // Optional: Save to database
    // await this.prisma.logAktivitas.create({
    //   data: {
    //     aksi: data.pattern,
    //     deskripsi: JSON.stringify(data.data),
    //     user_id: data.data.userId || 'system',
    //   },
    // });
  }
}
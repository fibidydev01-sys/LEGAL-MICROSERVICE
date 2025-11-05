import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private client: ClientProxy;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const rabbitmqUrl = this.configService.get<string>('RABBITMQ_URL');
    const queuePrefix = this.configService.get<string>('RABBITMQ_QUEUE_PREFIX', 'legal_');

    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: `${queuePrefix}events`,
        queueOptions: {
          durable: true,
        },
      },
    });

    await this.client.connect();
    this.logger.log('✅ RabbitMQ connected successfully');
  }

  async onModuleDestroy() {
    await this.client.close();
    this.logger.log('RabbitMQ connection closed');
  }

  async emit(pattern: string, data: any): Promise<void> {
    try {
      const event = {
        pattern,
        data,
        timestamp: new Date(),
      };

      this.client.emit(pattern, event);
      this.logger.log(`📤 Event emitted: ${pattern}`);
    } catch (error) {
      this.logger.error(`Failed to emit event: ${pattern}`, error);
      throw error;
    }
  }

  async send<TResult = any, TInput = any>(
    pattern: string,
    data: TInput,
  ): Promise<TResult> {
    try {
      this.logger.log(`📨 Sending message: ${pattern}`);
      return await this.client.send<TResult, TInput>(pattern, data).toPromise();
    } catch (error) {
      this.logger.error(`Failed to send message: ${pattern}`, error);
      throw error;
    }
  }
}
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create HTTP application
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  });

  // Connect microservice for RabbitMQ
  const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
  const queuePrefix = process.env.RABBITMQ_QUEUE_PREFIX || 'legal_';

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: `${queuePrefix}core_service`,
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  console.log('🎧 Core Service microservice is listening...');

  const port = process.env.PORT || 3002;
  await app.listen(port);
  
  console.log(`🚀 Core Service running on: http://localhost:${port}`);
}
bootstrap();
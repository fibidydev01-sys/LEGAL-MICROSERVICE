import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  [key: string]: any;

  async onModuleInit() {
    if (this.$connect) {
      await this.$connect();
    }
  }

  async onModuleDestroy() {
    if (this.$disconnect) {
      await this.$disconnect();
    }
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    const models = Reflect.ownKeys(this).filter(
      (key) => 
        typeof key === 'string' && 
        key[0] !== '_' && 
        key[0] !== '$' &&
        key !== 'constructor'
    );

    return Promise.all(
      models.map((modelKey) => {
        const model = (this as any)[modelKey];
        if (model && typeof model.deleteMany === 'function') {
          return model.deleteMany();
        }
        return Promise.resolve();
      }),
    );
  }
}
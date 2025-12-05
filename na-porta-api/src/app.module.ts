import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { Order } from './orders/entities/order.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mongodb',
        host: config.get<string>('MONGO_HOST'),
        port: config.get<number>('MONGO_PORT'),
        database: config.get<string>('MONGO_DB'),
        entities: [User, Order],
        synchronize: true,
      }),
    }),
    UsersModule,
    OrdersModule,
    AuthModule,
  ],
})
export class AppModule { }

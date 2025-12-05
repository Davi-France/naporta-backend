import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { UsersModule } from '../users/users.module';
import { GoService } from '../integrations/go.service';
import { IntegrationsModule } from '../integrations/integrations.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), UsersModule, IntegrationsModule],
  providers: [OrdersService, GoService],
  controllers: [OrdersController],
})
export class OrdersModule { }

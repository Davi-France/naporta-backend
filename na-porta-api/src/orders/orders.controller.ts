import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { GoService } from '../integrations/go.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly goService: GoService,
  ) { }

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  findAll(
    @Query('number') number?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.ordersService.findAll({
      number,
      status,
      startDate,
      endDate,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<CreateOrderDto>,
  ) {
    return this.ordersService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @Post('calculate-order/:id')
  async calculateFromOrder(@Param('id') id: string) {
    const order = await this.ordersService.findById(id);

    const itemsForCalculation = order.items.map(item => ({
      ...item,
      quantity: 1,
    }));

    return this.goService.calculateOrder(itemsForCalculation);
  }
}

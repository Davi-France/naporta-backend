import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import type { OrderFilter } from './interface/order-interface';

function isValidObjectId(id: string) {
  // Deve ter 24 caracteres hexadecimais
  return /^[a-fA-F0-9]{24}$/.test(id);
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly repo: Repository<Order>,
  ) { }

  async findById(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('id invalido');
    }

    const order = await this.repo.findOne({ where: { _id: new ObjectId(id), deleted: false } });
    if (!order) throw new NotFoundException('Pedido não encontrado');
    return order;
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = this.repo.create({
      ...dto,
      expectedDeliveryDate: new Date(dto.expectedDeliveryDate),
      createdAt: new Date(),
      deleted: false,
    });

    return this.repo.save(order);
  }

  async findAll(filter: OrderFilter) {
    const where: Record<string, unknown> = { deleted: false };

    if (filter.number) {
      where.number = filter.number;
    }

    if (filter.status) {
      where.status = filter.status;
    }

    if (filter.startDate || filter.endDate) {
      where.expectedDeliveryDate = {};

      if (filter.startDate) {
        (where.expectedDeliveryDate as Record<string, unknown>).$gte = new Date(
          filter.startDate,
        );
      }

      if (filter.endDate) {
        (where.expectedDeliveryDate as Record<string, unknown>).$lte = new Date(
          filter.endDate,
        );
      }
    }

    const page = filter.page && filter.page > 0 ? filter.page : 1;
    const limit = filter.limit && filter.limit > 0 ? filter.limit : 20;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.repo.find({
        where,
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      }),
      this.repo.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async update(id: string, partial: Partial<CreateOrderDto>): Promise<Order> {
    const order = await this.findById(id);

    Object.assign(order, partial);

    if (partial.expectedDeliveryDate) {
      order.expectedDeliveryDate = new Date(partial.expectedDeliveryDate);
    }

    return this.repo.save(order);
  }

  async remove(id: string): Promise<Order> {
    const order = await this.findById(id);
    order.deleted = true;
    return this.repo.save(order);
  }
}

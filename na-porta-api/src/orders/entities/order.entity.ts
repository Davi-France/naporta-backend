import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
export class Order {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  number: string;

  @Column()
  expectedDeliveryDate: Date;

  @Column()
  clientName: string;

  @Column()
  clientDocument: string;

  @Column()
  deliveryAddress: string;

  @Column()
  items: { description: string; price: number }[];

  @Column()
  status: string;

  @Column()
  createdAt: Date;

  @Column({ default: false })
  deleted?: boolean;
}

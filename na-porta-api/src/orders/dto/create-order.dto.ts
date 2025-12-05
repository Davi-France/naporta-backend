import { IsNotEmpty, IsArray, IsDateString, ValidateNested, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class ItemDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  number: string;

  @IsNotEmpty()
  @IsDateString()
  expectedDeliveryDate: string;

  @IsNotEmpty()
  clientName: string;

  @IsNotEmpty()
  clientDocument: string;

  @IsNotEmpty()
  deliveryAddress: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];

  @IsNotEmpty()
  @IsString()
  status: string;
}

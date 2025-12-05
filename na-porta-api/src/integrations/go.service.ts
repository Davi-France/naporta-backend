import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoService {
  async calculateOrder(items: { description: string; price: number; quantity: number }[]) {
    const { data } = await axios.post('http://localhost:8081/calculate-order', { items });
    return data;
  }
}
import { Module } from '@nestjs/common';
import { GoService } from './go.service';

@Module({
  providers: [GoService],
  exports: [GoService],
})
export class IntegrationsModule { }

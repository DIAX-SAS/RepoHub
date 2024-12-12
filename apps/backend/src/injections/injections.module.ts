import { Module } from '@nestjs/common';
import { InjectionsController } from './injections.controller';
import { InjectionsService } from './injections.service';

@Module({
  imports: [
  ],
  controllers: [InjectionsController],
  providers: [InjectionsService],
  exports: [InjectionsService],
})
export class InjectionsModule {}

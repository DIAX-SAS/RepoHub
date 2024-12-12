import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { InjectionsModule } from '../injections/injections.module';
import { PlcModule } from '../plc/plc.module';

@Module({
  imports: [InjectionsModule,PlcModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

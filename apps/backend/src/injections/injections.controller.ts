import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { InjectionsService } from './injections.service';
import { Injection } from '@repo-hub/internal';

@Controller('injections')
export class InjectionsController {
  constructor(private readonly injectionsService: InjectionsService) {}

  @Get()
  findInjections() {   
    return this.injectionsService.findInjections();
  }
  @Get(':id')
  findInjection(@Param('id') id: string) {
    return this.injectionsService.findInjection(id);
  }

  @Post()
  createInjection(@Body() injection: Partial<Injection>) {
    return this.injectionsService.createInjection(injection);
  }

  @Patch()
  updateInjection(@Body() injection: Partial<Injection>) {
    const _id = injection._id;
    delete injection["_id"];  
    return this.injectionsService.updateInjection(_id, injection);
  }

  @Delete(':id')
  deleteInjection(@Param('id') id: string) {
    return this.injectionsService.deleteInjection(id);
  }
}

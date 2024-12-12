import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { PlcService } from './plc.service';
import { GetObjectsDto, PlcDto, UpdateVariablesDto } from '@repo-hub/internal';


@Controller('plc')
export class PlcController {
  constructor(private readonly plcService: PlcService) {}

  @Post('data')
  getObjects(@Body() body: GetObjectsDto) {
    return this.plcService.GetObjects(body);
  }

  @Post()
  postObject(@Body() content: PlcDto) {
    return this.plcService.PostObject(content);
  }

  @Patch('object')
  updateObject(@Param('s3_object_key') key: string, @Body() content: PlcDto[]) {   
    return this.plcService.UpdateObject(key, content);
  }

  @Patch('variable')
  updateVariables(@Body() body: UpdateVariablesDto) {  
    return this.plcService.UpdateVariables(
      body.s3_object_key,
      body.nameVariable,
      body.newValue,
      body.namePlc
    );
  }

  @Delete(':s3_object_key')
  removeObject(@Param('s3_object_key') key: string) {
    return this.plcService.RemoveObject(decodeURIComponent(key));
  }
}

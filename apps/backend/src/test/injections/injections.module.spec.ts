import { Test, TestingModule } from '@nestjs/testing';
import { InjectionsModule } from '../../injections/injections.module';
import { InjectionsController } from '../../injections/injections.controller';
import { InjectionsService } from '../../injections/injections.service';

describe('InjectionsModule', () => {
  let module: TestingModule;

  beforeAll(async () => {

    module = await Test.createTestingModule({
      imports: [
        InjectionsModule
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide InjectionsController', () => {
    const controller = module.get<InjectionsController>(InjectionsController);
    expect(controller).toBeDefined();
  });

  it('should provide InjectionsService', () => {
    const service = module.get<InjectionsService>(InjectionsService);
    expect(service).toBeDefined();
  });
});

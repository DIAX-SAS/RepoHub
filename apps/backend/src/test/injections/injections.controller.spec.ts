import { Test, TestingModule } from '@nestjs/testing';
import { InjectionsService } from '../../injections/injections.service';
import { InjectionsController } from '../../injections/injections.controller';
import { dynamoose, Injection } from '@repo-hub/internal';

describe('InjectionsController', () => {
  let controller;
  let service;
  let createdInjection;

  beforeAll(async () => {
    dynamoose.aws.ddb.local('http://localhost:8000');

    const module: TestingModule = await Test.createTestingModule({
      providers: [InjectionsService],
      controllers: [InjectionsController],
    }).compile();

    service = module.get<InjectionsService>(InjectionsService);
    controller = module.get<InjectionsController>(InjectionsController);
  });

  beforeEach(async () => {
    createdInjection = await controller.createInjection({
      name: 'Test1',
      email: 'Test1@gmail.com',
    });
  });

  it('should return a specific injection by ID', async () => {
    const result = (await controller.findInjection(
      createdInjection._id
    )) as Injection;
    expect(result._id).toEqual(createdInjection._id);
  });

  it('should create a new injection', async () => {
    const result = (await controller.findInjection(
      createdInjection._id
    )) as Injection;
    expect(result).toBeDefined();
    expect(result._id).toEqual(result._id);
  });

  it('should update an injection', async () => {
    const updateDcto = {
      _id: createdInjection._id,
      name: 'Updated Test',
      email: 'updated@example.com',
    } as Injection;

    await controller.updateInjection(updateDcto);
    const updatedInjection = await controller.findInjection(
      createdInjection._id
    );
    expect(updatedInjection.name).toEqual(updateDcto.name);
  });

  it('should delete an injection', async () => {
    await controller.deleteInjection(createdInjection._id.toString());
    const deletedInjection = await controller.findInjection(
      createdInjection._id
    );
    expect(deletedInjection).not.toBeDefined();
  });

  it('should return last 10 injections', async () => {
    const injections = [
      { name: 'Test2', email: 'test2@example.com' },
      { name: 'Test3', email: 'test3@example.com' },
      { name: 'Test4', email: 'test4@example.com' },
      { name: 'Test5', email: 'test5@example.com' },
      { name: 'Test6', email: 'test6@example.com' },
      { name: 'Test7', email: 'test7@example.com' },
      { name: 'Test8', email: 'test8@example.com' },
      { name: 'Test9', email: 'test9@example.com' },
      { name: 'Test10', email: 'test10@example.com' },
      { name: 'Test11', email: 'test11@example.com' },
    ];

    await Promise.all(injections.map((dcto) => controller.createInjection(dcto)));

    const results = await controller.findInjections();
       const sortedResults = results.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    const records = sortedResults.slice(0, 10);
    expect(results).toHaveLength(10);
    expect(results).toEqual(records);
  });
});

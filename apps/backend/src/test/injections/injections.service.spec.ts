import { Test, TestingModule } from '@nestjs/testing';
import { InjectionsService } from '../../injections/injections.service';
import { dynamoose, Injection } from '@repo-hub/internal';


describe('InjectionsService', () => {
  let service: InjectionsService;
  let createDcto: Partial<Injection>;
  let createdInjection;
  beforeAll(async () => {
    dynamoose.aws.ddb.local('http://localhost:8000');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InjectionsService,
      ],
    }).compile();

    service = module.get<InjectionsService>(InjectionsService);
  });

  beforeEach(async ()=>{
     createDcto = {
      name: 'Test',
      email: 'test@example.com',
    };
     createdInjection = await service.createInjection(createDcto);
  })

  it('should create a new injection', async () => {

    expect(createdInjection).toHaveProperty('_id');
    expect(createdInjection.name).toEqual(createDcto.name);
    expect(createdInjection.email).toEqual(createDcto.email);
  });

  it('should find an injection by ID', async () => {

    const foundInjection = (await service.findInjection(
      createdInjection._id.toString()
    )) as Injection;

    expect(foundInjection).toBeDefined();
    expect(foundInjection._id.toString()).toEqual(
      createdInjection._id.toString()
    );
  });

  it('should update an injection', async () => {
  

    const updateDcto: Partial<Injection> = {
      name: 'Updated',
      email: 'updated@example.com',
    };
    await service.updateInjection(createdInjection._id, updateDcto);

    const updatedInjection = (await service.findInjection(
      createdInjection._id.toString()
    )) as Injection;

    expect(updatedInjection).toBeDefined();
    expect(updatedInjection._id.toString()).toEqual(
      createdInjection._id.toString()
    );
  });

  it('should delete an injection', async () => {

    const deletedInjection = (await service.deleteInjection(
      createdInjection._id.toString()
    )) as Injection;
    const foundInjection = await service.findInjection(
      createdInjection._id.toString()
    );

    expect(deletedInjection).toBeDefined();
    expect(deletedInjection._id.toString()).toEqual(
      createdInjection._id.toString()
    );   
    expect(foundInjection).not.toBeDefined();
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

    await Promise.all(injections.map((dcto) => service.createInjection(dcto)));
    const results = await service.findInjections();  
    const sortedResults = results.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    const records = sortedResults.slice(0, 10);

    expect(results).toHaveLength(10);
    expect(results).toEqual(records);
  });
});

import { Injection, InjectionModel } from '@repo-hub/internal';
import { HttpException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InjectionsService {
  
  async findInjections(): Promise<Injection[]> {
    const results = await InjectionModel.scan().exec();   
    const sortedResults = results.sort((a, b) => {  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()});   
    const records = sortedResults.slice(0, 10);     
    return records as unknown as Injection[] | null;
  }

  async deleteInjection(id: string): Promise<Injection | null> {
    await this.exist(id)
    const item = await InjectionModel.get({ _id: id });
    await InjectionModel.delete({ _id: id });
    return item as unknown as Injection;
  }

  async exist(id: string) {
    const item = await InjectionModel.get({ _id: id });
    if (item === undefined) {
      throw new HttpException(`The injection with id:(${id}) does not exist.`,400);
    }
  }

  async updateInjection(
    _id: string,
    injection: Partial<Injection>
  ): Promise<Injection | null> {
    await this.exist(_id);
    await this.validate(injection);
    const result = await InjectionModel.update({ _id }, injection, {
      returnValues: 'ALL_NEW',
    });
    return result as unknown as Injection | null;
  }

  async createInjection(createInjectionDto: Partial<Injection>): Promise<Injection> {
    let newId;
    let result;
    do {
      newId = uuidv4();
      result = await InjectionModel.get(newId);
    } while (result !== undefined);

     createInjectionDto['_id'] = newId;
     this.validate(createInjectionDto);
     return InjectionModel.create(createInjectionDto) as unknown as Injection;
    
  }

  validate(injection : Partial<Injection>){
    if(!injection.name || !injection.email)
      throw new HttpException("There are missing properties.",400);
  }
  async findInjection(id: string): Promise<Injection | null> {
    const result = await InjectionModel.get({ _id: id });
    return result as unknown as Injection | null;
  }
}

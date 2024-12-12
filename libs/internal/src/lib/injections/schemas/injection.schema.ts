import * as dynamoose from 'dynamoose';

export { dynamoose };

export const injectionSchema = new dynamoose.Schema(
  {
    _id: {
      type: String,
      hashKey: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export interface Injection {
  _id: string;
  name: string;
  email: string;
  createdAt?: Date; 
  updatedAt?: Date; 
}


export const InjectionModel = dynamoose.model('Injections', injectionSchema);

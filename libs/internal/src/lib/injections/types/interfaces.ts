export interface PLC {
    name: string;
    timestamp: string;
  
    variables: {
      [key: string]: {
        quality: string;
        value: string;
      };
    };
  }

  export interface UpdateVariablesDto {
    nameVariable: string;
    newValue: string;
    namePlc:string;
    s3_object_key:string;
  }
  
 export interface GetObjectsDto {
    initTime: Date;
    endTime: Date;
    config: {
      live: boolean;
      offset: boolean;
      mold: number[];
      worker: number[];
      material: number[];
      order: number[];
      lot: number[];
      machine: number[];
    };
  }
  export interface PLC {
    name: string;
    timestamp: string;
  
    variables: {
      [key: string]: {
        quality: string;
        value: string;
      };
    };
  }
  export interface PlcDto {
    name: string;
    timestamp: string;
  
    variables: {
      [key: string]: {
        quality: string;
        value: string;
      };
    };
  }
  
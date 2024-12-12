import { Injectable } from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { readFile as ReadFile } from 'fs/promises';

import {
  CalculateCycleData,
  CalculateMaterialData,
  CalculateEnergyData,
  CalculateMountingData,
  CalculateFactorsOee,
  CalculateIndicatorsData,
  CalculateStateVariables,
  CalculateTasksData,
  ParseCSVToSimply,
  FetchS3ObjectsWithinDateRange,
  OffsetsSlices,
  FilterSettings,
} from '../utils/functions_data.js';
import { PLC } from '@repo-hub/internal';

const bucketName = 'modbus-plc';
const prefix = 'iot-data/modbus/plc/';

@Injectable()
export class PlcService {
  private s3 = new S3Client({ region: 'us-east-1' });
  // Fetch objects between the time range
  async GetObjects(settings) {
     let objects = await FetchS3ObjectsWithinDateRange(
       settings.initTime,
       settings.endTime,
       bucketName,
       prefix
     );
  //  const csvData = await ReadFile(
  //    `C:\\Users\\equip\\OneDrive\\Escritorio\\Development\\dashboard-data-testing\\data\\2024-11-27T04-12-00Z00-2024-11-27T12-00-00Z00.csv`,
  //    'utf-8'
  //  );
  //  let objects = ParseCSVToSimply(csvData);
  


   if(objects.length === 0){
    return {void:true};
   }
    if (settings.config.offset) {
      OffsetsSlices(objects, false, settings.config.offset);
    }
    
    const stateVariables = CalculateStateVariables(objects,settings.offset)
    if (
      settings.config.machine.length > 0 ||
      settings.config.worker.length > 0 ||
      settings.config.order.length > 0 ||
      settings.config.lot.length > 0 ||
      settings.config.mold.length > 0 ||
      settings.config.material.length > 0
    ) {
      objects = FilterSettings(objects, settings.config);
    }
      return {
        tasksData: CalculateTasksData(objects, true),
        stateVariables: stateVariables,
        indicatorsData: CalculateIndicatorsData(objects, true),
        factorsOee: CalculateFactorsOee(objects, true),
        mountingData: CalculateMountingData(objects, true),
        energyData: CalculateEnergyData(objects, true),
        materialData: CalculateMaterialData(objects, true),
        cycleData: CalculateCycleData(objects, true),
      };

  }
  async PostObject(content: PLC): Promise<any> {
    const key = `${prefix}plc_${Date.now()}.json`;
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: JSON.stringify(content),
    });
    return await this.s3.send(command);
  }
  async UpdateObject(s3_object_key: string, content: PLC[]): Promise<any> {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: `${''}${s3_object_key}`,
      Body: JSON.stringify(content),
    });
    return await this.s3.send(command);
  }
  async UpdateVariables(
    s3_object_key: string,
    nameVariable: string,
    newValue: string,
    namePlc: string
  ): Promise<any> {
    const data = await this.GetObjectByKey(s3_object_key);
    for (const i in data) {
      if (data[i].name == namePlc) {
        data[i].variables[nameVariable].value = newValue;
        return this.UpdateObject(s3_object_key, data);
      }
    }
  }
  async RemoveObject(s3_object_key: string): Promise<any> {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: s3_object_key,
    });
    return await this.s3.send(command);
  }

  private async StreamToString(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      stream.on('error', reject);
    });
  }

  private async GetObjectByKey(s3_object_key: string): Promise<PLC[]> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: s3_object_key,
    });
    const { Body } = await this.s3.send(command);
    const bodyString = await this.StreamToString(Body as Readable);
    return JSON.parse(bodyString);
  }
}

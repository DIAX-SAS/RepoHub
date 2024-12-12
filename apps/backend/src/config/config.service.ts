import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  getString(uri: string) {
    return uri;
  }
}

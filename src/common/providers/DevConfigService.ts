import { Injectable } from '@nestjs/common';

@Injectable()
export class DevConfigService {
  DBHOST = 'localhost';
  getDBHost() {
    return this.DBHOST;
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getFrontend(): string {
    // TODO: render to frontend
    return 'hello world';
  }
}

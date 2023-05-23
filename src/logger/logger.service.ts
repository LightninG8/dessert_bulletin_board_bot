import { Logger as NestLogger } from '@nestjs/common';

export class LoggerService extends NestLogger {
  log(message: string, trace: string) {
    super.log(message, trace);
  }

  warn(message: string, trace: string) {
    super.warn(message, trace);
  }

  error(message: string, trace: string) {
    // write the message to a file, send it to the database or do anything
    super.error(message, trace);
  }
}

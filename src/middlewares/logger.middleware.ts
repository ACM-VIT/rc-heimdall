import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Simple logger middleware to run at every request.
 * @todo attach log streaming service
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  /** logger body */
  use(req: Request, res: Response, next: any) {
    next();
  }
}

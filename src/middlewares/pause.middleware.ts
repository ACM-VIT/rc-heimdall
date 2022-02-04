import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { readFile } from 'fs';

/**
 * Simple logger middleware to run at every request.
 * @todo attach log streaming service
 */
@Injectable()
export class PauseMiddleware implements NestMiddleware {
  // to disable a route if check = true
  async use(req: Request, res: Response, next: NextFunction) {
    // read a txt from a file
    readFile('pause.txt', 'utf8', (err, data) => {
      if (err) {
        return res.status(503).send('error reading pause file');
      } else {
        // if the event is started, then the app will be paused
        if (data === 'true') {
          return res.status(200).send('The app is paused');
        } else {
          next();
        }
      }
    });
  }
}

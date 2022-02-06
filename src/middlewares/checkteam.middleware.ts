// import * as Teams from '../../config/qualifiedteams.json';
// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { NextFunction, Request, Response } from 'express';
// import { readFile } from 'fs';
// import { JwtToken } from 'src/auth/interface/auth.token.interface';

// /**
//  * Simple logger middleware to run at every request.
//  * @todo attach log streaming service
//  */
// @Injectable()
// export class ChevkTeamMiddleware implements NestMiddleware {
//   // to disable a route if check = true
//   async use(req: Request, res: Response, next: NextFunction) {
//     // read a txt from a file
//     const part: JwtToken = req.user.participant;
//     if (!Teams.teamIds.includes(part.team_id.toString())){

//         // if the event is started, then the app will be paused
//         if (parseInt(data) === 1) {
//           return res.status(200).send('The app is paused');
//         } else {
//           next();
//         }
//     });
//   }
// }

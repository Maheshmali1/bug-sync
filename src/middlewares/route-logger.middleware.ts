import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request,NextFunction, Response } from 'express';
import { safeJSONStringify } from '../utils';

@Injectable()
export class RouteLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip, header } = req;
    Logger.log(`Request received: method: ${method}, URL: ${originalUrl}, payload : ${safeJSONStringify(req.body)}`)

    res.on('finish', () => {
      Logger.log(`Request sent: method: ${method}, URL: ${originalUrl}, response status: ${res.statusCode} & response message: ${res.statusMessage}`)
    })

    next();
  }
}
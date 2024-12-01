import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { BlackListToken, blackListTokenDocument } from '../entities';
import { Model } from 'mongoose';

@Injectable()
export class AuthGuard implements  CanActivate {
  constructor(
    @InjectModel(BlackListToken.name) private readonly _blackListModel: Model<blackListTokenDocument>,
    private  readonly _jwtService: JwtService,
    private  readonly _configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request =  context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if(!token) {
      Logger.log(`Authorization token is missing`);
      throw new UnauthorizedException(`Authorization token is missing`);
    }

    const isBlackListed = await this.isTokenBlackListed(token);
    if(isBlackListed) {
      Logger.log(`Token is blacklisted, not allowing further operations`);
      throw new UnauthorizedException(`Token is blacklisted`);
    }

    try {
      const authSecret = await this._configService.get('AUTH_SECRET');
      const tokenPayload = await this._jwtService.verifyAsync(token, {
        secret: authSecret
      });

      Logger.log(`User : ${tokenPayload.userId} trying to access : ${request.originalUrl}`);
      request['user'] = tokenPayload;
      request['auth_token'] = token;
      return true;
    } catch (error) {
      Logger.log(`Error while verifying authorization token`);
      throw new UnauthorizedException();
    }


  }

  private extractTokenFromHeader(request:Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async isTokenBlackListed(token: string){
      const foundToken = await this._blackListModel.findOne({access_token : token});

      return !!foundToken;
  }
}
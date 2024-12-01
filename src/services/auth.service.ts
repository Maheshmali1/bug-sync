import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDTO, UserDTO } from '../dtos';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../utils';
import { BlackListToken, blackListTokenDocument, User, userDocument } from '../entities';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(BlackListToken.name) private readonly _blackListTokenModel: Model<blackListTokenDocument>,
    private readonly _userService: UserService,
    private readonly _jwtService: JwtService) {}

  async signUp(user: UserDTO) {
    const createdUser = await this._userService.createUser(user);

    return await  this.generateTokens(createdUser);
  }

  async signIn(user : AuthDTO) {
      const userFound = await this._userService.getUserByEmail(user.email);

      if(! (await  comparePassword(userFound.password,user.password))) {
          throw new UnauthorizedException('Invalid password for given username')
      }

      return await this.generateTokens(userFound)
  }

  async signOut(userId: string, token: string) {
        return await this._blackListTokenModel.create({userId, access_token: token});
  }

  private async generateTokens(user: userDocument) {
    const payload = { userId: user._id, role: user.role };
    return {
      accessToken: await this._jwtService.signAsync(payload, { expiresIn : '15m'}),
      refreshToken: await this._jwtService.signAsync(payload, { expiresIn: '1d'})
    };
  }

}
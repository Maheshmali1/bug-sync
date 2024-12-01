import { Body, Controller, Delete, HttpException, HttpStatus, Logger, Post, UseGuards,Request } from '@nestjs/common';
import { AuthDTO, UserDTO } from '../dtos';
import { AuthService } from '../services';
import { AuthGuard } from '../guards';
import { USER_ROLES } from '../constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('signup')
  async signup(@Body() user: UserDTO) {
    try {
      Logger.log(`signup request received`, { email: user.email });
      const result = await this._authService.signUp(user);

      Logger.log(`Successfully signed up`, { email: user.email });
      return result;
    } catch (error) {
      Logger.error(`Error while signing up user`,error, { email: user.email });

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error while signing up user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('signin')
  async signIn(@Body() user: AuthDTO) {
    try {
      Logger.log(`Login request received`, { email: user.email });

      const result = await this._authService.signIn(user);

      Logger.log(`User signed in successfully`, { email: user.email });
      return result;
    } catch (error) {
      Logger.error(`Error while signing in user`,error, { email: user.email });

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error while signing in user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete('signout')
  async signOut(@Request() { user, auth_token }: { user: {userId: string; role: USER_ROLES}, auth_token: string}) {
    try {
      Logger.log(`SignOut request received`, { userId: user.userId });

      await this._authService.signOut(user.userId, auth_token);
      Logger.log(`User signed out successfully`, { userId: user.userId });
    } catch (error) {
      Logger.error(`Error while signing out user`, error,{ userId: user.userId });

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error while signing out user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
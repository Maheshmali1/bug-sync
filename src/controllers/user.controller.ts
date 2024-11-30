import { Controller, Post } from '@nestjs/common';
import { UserService } from '../services';

@Controller('users')
export class  UserController {
  constructor(private readonly _userService: UserService) {
  }

  @Post()
  async createUser(){}
}
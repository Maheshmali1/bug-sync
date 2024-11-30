import {
  Body,
  ClassSerializerInterceptor,
  Controller, Delete, Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger, Param, Patch,
  Post, UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../services';
import { updateUserDTO, UserDTO, UserListResponseDTO, UserResponseDTO } from '../dtos';
import { safeJSONStringify } from '../utils';
import { IsMongoId } from 'class-validator';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class  UserController {
  constructor(private readonly _userService: UserService) {
  }

  @Get()
  async getUsers(): Promise<UserListResponseDTO> {
    try {
      Logger.log('Get users requested');
      const result = await this._userService.getAllUsers();
      Logger.log(`Successfully fetched all users`);
      return new UserListResponseDTO(result as unknown as UserResponseDTO[]);
    } catch (err) {
      Logger.error(`
      Error while fetching users`, err);
      throw new HttpException('Error while fetching users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string) : Promise<UserResponseDTO> {
    try {
      Logger.log(`Get user by id requested for id`,{id});
      const result = await this._userService.getUserById(id);

      Logger.log(`Successfully fetched user by id`, {id});
      return new UserResponseDTO(result as unknown as UserResponseDTO);
    } catch (err) {
      Logger.error(`
      Error while fetching user by id`, err);
      throw new HttpException('Error while fetching user by id', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Post()
  async createUser(@Body() userDTO : UserDTO) : Promise<UserResponseDTO>{
    try {
       Logger.log(`Create user requested ${safeJSONStringify(userDTO)}`);
       const result  = await  this._userService.createUser(userDTO);

       Logger.log(`Successfully created user`, {id: result._id});
       return new UserResponseDTO(result as unknown as UserResponseDTO);
    } catch (err) {
      Logger.error(`
      Error while creating user`,err);
      throw new HttpException("Error while creating user", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/:id')
  async updateUserById(@Param('id') id: string, @Body() user : updateUserDTO ) : Promise<UserResponseDTO>{
    try {
       Logger.log(`Update user by id requested for id`,{id});
       const result  = await  this._userService.updateUserById(id, user);

       Logger.log(`Successfully updated user by id`, {id});
       return new UserResponseDTO(result as unknown as UserResponseDTO);
    } catch (err) {
      Logger.error(`
      Error while updating user by id`, err);
      throw new HttpException("Error while updating user by id", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) : Promise<void>{
    try {
       Logger.log(`Delete user by id requested for id`,{id});
       await  this._userService.deleteUserById(id);
       Logger.log(`Successfully deleted user by id`, {id});
    } catch (err) {
      Logger.error(`
      Error while deleting user by id`, err);
      throw new HttpException("Error while deleting user by id", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
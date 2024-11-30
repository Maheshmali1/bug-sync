import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDTO, UserResponseDTO } from '../dtos';
import { InjectModel } from '@nestjs/mongoose';
import { User, userDocument } from '../entities';
import { Model, Types } from 'mongoose';
import { USER_ROLES } from '../constants';
import { hashPassword } from '../utils';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly _userModel: Model<userDocument>) {
  }

  async createUser(user: UserDTO) {

    const hashedPass = await hashPassword(user.password, )
    const createdUser =  await this._userModel.create({...user, password:hashedPass});

    return createdUser.toObject();
  }

  async getAllUsers() : Promise<User[]> {
    return this._userModel.find({is_delete:false}).lean().exec();
  }

    async getUserById(id: string) : Promise<User> {
    const user = await this._userModel.findById(id).lean().exec();

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async updateUserById(id: string, user: Partial<UserDTO>) : Promise<User> {
    const updatedUser = await this._userModel.findByIdAndUpdate(id, user, {new: true}).lean().exec();

    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return updatedUser;
  }

  async deleteUserById(id: string) : Promise<void> {
    const result = await this._userModel.findOneAndUpdate({_id: new Types.ObjectId(id), is_delete: false}, {is_delete: true}, {new: true}).exec();

    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
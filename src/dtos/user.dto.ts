import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import { APP_DOMAINS } from '../constants';
import { Types } from 'mongoose';
import { hashPassword } from '../utils';
import { PartialType } from '@nestjs/mapped-types';


export class UserDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Exclude({toPlainOnly: true})
  password: string;

  constructor(value: Partial<UserDTO>) {
    Object.assign(this, value);
  }
}

export class updateUserDTO extends PartialType(UserDTO){
  @IsOptional()
  @IsEnum(APP_DOMAINS, {each:true})
  skills: APP_DOMAINS[]
}

export class UserResponseDTO extends UserDTO {
  @Expose({name: "id" })
  @Transform((params) => params.obj._id?.toString())
  _id: Types.ObjectId;

  @Expose()
  role: string;

  @Exclude()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  skills: APP_DOMAINS[];

  @Exclude()
  is_delete: boolean;

  @Exclude()
  __v : string;

  constructor(value: Partial<UserResponseDTO>){
      super(value);
      Object.assign(this, value);
  }
}

export class UserListResponseDTO {
  constructor(userList: Partial<UserResponseDTO>[])  {
    return userList.map((user) => {
      return new UserResponseDTO(user);
    })
  }
}
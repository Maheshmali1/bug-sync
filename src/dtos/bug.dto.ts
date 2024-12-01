import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { APP_DOMAINS, BUG_STATUS } from '../constants';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { Comment } from '../entities';

export class BugDTO {
  @IsNotEmpty()
  @IsString()
  title:string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(APP_DOMAINS)
  domain: APP_DOMAINS;
  
  @IsNotEmpty()
  @Transform((params) => new Date( parseInt(params.value)), {
    toClassOnly: true
  })
  due_date: String;

  constructor(bug: Partial<BugDTO>) {
    Object.assign(this, bug);
  }
}

export class CommentDTO {
  @Expose()
  @Transform((params) => params.value?.toString())
  user_id: Types.ObjectId;

  @Expose()
  description: string;

  @Expose()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export class BugResponseDTO extends BugDTO {

  @Expose({name: 'id'})
  @Transform((params) => params.obj._id?.toString())
  _id: Types.ObjectId;

  @Expose()
  @Transform((params) => params.value?.toString())
  assigned_to: Types.ObjectId;

  @Expose()
  @Transform((params) => params.value?.toString())
  reporter_id: Types.ObjectId

  @Expose()
  comments: Comment[];

  @Expose()
  status: BUG_STATUS;

  @Exclude()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  __v:string;

  @Exclude()
  is_delete: boolean;

  constructor(bug: Partial<BugResponseDTO>) {
    super(bug);
    Object.assign(this, bug);
  }
}

export class BugListResponseDTO {
  constructor(bugs: Partial<BugResponseDTO[]>) {
    return bugs.map(bug => new BugResponseDTO(bug))
  }
}
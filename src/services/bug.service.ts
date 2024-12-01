import { Injectable } from '@nestjs/common';
import { BugDTO } from '../dtos';
import { InjectModel } from '@nestjs/mongoose';
import { Bug, BugDocument } from '../entities';
import { Model, Types } from 'mongoose';
import { BUG_STATUS } from '../constants';

@Injectable()
export class BugService {
  constructor(@InjectModel(Bug.name) private readonly _bugModel: Model<BugDocument>) {
  }
  
  async createBug(userId: string, bug: BugDTO) {

    const modifiedBug = {
      ...bug,
      reporter_id: new Types.ObjectId(userId),
      assignee_id: null,
      status: BUG_STATUS.OPEN,
    }
    console.log(`hey mahesh data`,modifiedBug)

    const createdBug = await this._bugModel.create(modifiedBug);

    return createdBug.toObject();
  }

  async getAllBugs(): Promise<Bug[]> {
    return this._bugModel.find({is_delete: false}).lean().exec();
  }
}
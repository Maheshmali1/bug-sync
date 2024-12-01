import {
  Body,
  ClassSerializerInterceptor,
  Controller, Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Request, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BugService } from '../services';
import { BugDTO, BugListResponseDTO, BugResponseDTO } from '../dtos';
import { IReqUser } from '../interfaces';
import { AuthGuard } from '../guards';

@Controller('bugs')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
export class BugController {
  constructor(private readonly _bugService: BugService) {
  }

  @Post()
  async createBug( @Request() {user} : IReqUser, @Body() bug: BugDTO) {
    try {
      Logger.log(`Create Bug request received`, {userId: user.userId});

      const result = await this._bugService.createBug(user.userId,bug);
      Logger.log(`Bug created successfully`, {userId: user.userId});
      return new BugResponseDTO(result as unknown as BugResponseDTO);
    } catch (error) {
      Logger.error(`Error while creating bug`, error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Error while creating bug', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getAllBugs(@Request() {user} : IReqUser) {
    try {
      Logger.log(`Get all bugs request received`, {userId: user.userId});

      const bugs = await this._bugService.getAllBugs();
      Logger.log(`Bugs fetched successfully`, {userId: user.userId});
      return new BugListResponseDTO(bugs as unknown as BugResponseDTO[]);
    } catch (error) {
      Logger.error(`Error while fetching all bugs`, error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Error while fetching all bugs', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
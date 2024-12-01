import { USER_ROLES } from '../constants';

export interface IReqUser {
  user : {
    userId: string;
    role: USER_ROLES
  }
}


import * as bcrypt from 'bcryptjs';
import { Logger } from '@nestjs/common';

export function safeJSONStringify (obj: any ) {
   try {
      return JSON.stringify(obj);
   } catch (e) {
     Logger.log(`error while converting JSON string`);
     return obj;
   }
}




export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};


export async function comparePassword(originalPassword: string, password: string) {
  return await  bcrypt.compare(password, originalPassword);
}
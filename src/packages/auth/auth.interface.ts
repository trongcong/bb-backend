import { Request } from 'express';
import { User } from '@packages/users/users.interface';

export interface DataStoredInToken {
  _id: string;
  created_at: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}

import { TokenData } from '@packages/auth/auth.interface';

export interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  roles: string;
  notification: boolean;
  avatar: string;
  phone_number: string;
  website: string;
  address: string;
  is_verified: boolean;
  created_at: number;
  updated_at: number;
  last_pass_change_at: number;
}

export type UserReturn = Omit<User, 'password'>;

export interface LoginReturn {
  cookie: string;
  findUser: UserReturn;
  tokenData: TokenData;
}

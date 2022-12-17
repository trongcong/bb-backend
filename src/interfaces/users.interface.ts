import { TokenData } from '@interfaces/auth.interface';

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

export interface UserReturn {
  cookie: string;
  findUser: Omit<User, 'password'>;
  tokenData: TokenData;
}

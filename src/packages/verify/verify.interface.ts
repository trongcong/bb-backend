export interface VerifyToken {
  _id: string;
  user_id: string;
  token: string;
  createdAt: number;
}
export interface VerifyTokenReturn {
  user_id: string;
  is_verified: boolean;
  email: string;
}

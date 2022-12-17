import { NextFunction, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { RequestWithUser } from '@packages/auth/auth.interface';
import userModel from '@packages/users/users.model';
import { User } from '@packages/users/users.interface';
import { isEmpty } from '@utils/util';

const verifiedMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userData: User = req.user;
    if (isEmpty(userData)) {
      next(new HttpException(400, 'userData is empty'));
    } else {
      const user: User = await userModel.findById(userData._id, 'is_verified');
      if (!user) {
        next(new HttpException(401, 'Authentication failed. User not exists.'));
      } else if (!user.is_verified) {
        next(new HttpException(400, 'User not verify. Please verify user.'));
      } else {
        next();
      }
    }
  } catch (error) {
    next(new HttpException(400, 'User not verify. Please verify user.'));
  }
};

export default verifiedMiddleware;

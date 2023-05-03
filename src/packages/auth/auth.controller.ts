import { NextFunction, Request, Response } from 'express';
import { CreateUserDto, LoginUserDto, UserEmailDto } from '@packages/users/users.dto';
import { RequestWithUser } from '@packages/auth/auth.interface';
import { User, UserReturn } from '@packages/users/users.interface';
import AuthService from '@packages/auth/auth.service';

class AuthController {
  public authService = new AuthService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: UserReturn = await this.authService.register(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };
  public resetUserPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: UserEmailDto = req.body;
      const user: UserReturn = await this.authService.resetPassword(userData);

      res.status(201).json({ data: user, message: 'Reset password success. Please check your email!' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: LoginUserDto = req.body;
      const { cookie, findUser, tokenData } = await this.authService.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: { token:tokenData.token, userData: findUser }, message: 'Login success' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const logOutUserData = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;

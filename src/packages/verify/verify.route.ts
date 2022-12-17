import { Router } from 'express';
import VerifyController from '@packages/verify/verify.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { ConfirmVerifyDto, SendTokenVerifyDto } from '@packages/verify/verify.dto';
import authMiddleware from '@middlewares/auth.middleware';

class VerifyRoute implements Routes {
  public path = '/verify';
  public router = Router();
  public verifyController = new VerifyController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(`${this.path}`, [authMiddleware]);
    this.router.post(`${this.path}`, [validationMiddleware(ConfirmVerifyDto, 'body'), this.verifyController.confirmationVerify]);
    this.router.post(`${this.path}/resend-token`, [validationMiddleware(SendTokenVerifyDto, 'body'), this.verifyController.sendTokenVerify]);
  }
}

export default VerifyRoute;

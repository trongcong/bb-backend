import { Router } from 'express';
import VerifyController from '@packages/verify/verify.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { ConfirmVerifyDto, SendTokenVerifyDto } from '@packages/verify/verify.dto';

class VerifyRoute implements Routes {
  public path = '/verify';
  public router = Router();
  public verifyController = new VerifyController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      validationMiddleware(ConfirmVerifyDto, 'body'),
      this.verifyController.confirmationVerify.bind(this.verifyController).bind(this.verifyController),
    );
    this.router.post(
      `${this.path}/resend-token`,
      validationMiddleware(SendTokenVerifyDto, 'body'),
      this.verifyController.sendTokenVerify.bind(this.verifyController),
    );
  }
}

export default VerifyRoute;

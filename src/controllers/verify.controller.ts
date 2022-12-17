import { NextFunction, Request, Response } from 'express';
import VerifyService from '@services/verify.service';
import { ConfirmVerifyDto, SendTokenVerifyDto } from '@dtos/verify.dto';
import { VerifyTokenReturn } from '@interfaces/verify.interface';

class VerifyController {
  public verifyService = new VerifyService();

  public async confirmationVerify(req: Request, res: Response, next: NextFunction) {
    try {
      const verifyData: ConfirmVerifyDto = req.body;
      const confirmationVerifyData: VerifyTokenReturn = await this.verifyService.confirmationVerify(verifyData);

      res.status(200).json({ data: confirmationVerifyData, message: 'The account has been verified.' });
    } catch (error) {
      next(error);
    }
  }

  public async sendTokenVerify(req: Request, res: Response, next: NextFunction) {
    try {
      const sendTokenData: SendTokenVerifyDto = req.body;
      const confirmationVerifyData = await this.verifyService.sendTokenVerify(sendTokenData);

      res.status(200).json({
        data: confirmationVerifyData,
        message: 'A verification email has been sent to your email.',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default VerifyController;

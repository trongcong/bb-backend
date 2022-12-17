import { ConfirmVerifyDto, SendTokenVerifyDto } from '@dtos/verify.dto';
import { HttpException } from '@exceptions/HttpException';
import { VerifyToken, VerifyTokenReturn } from '@interfaces/verify.interface';
import { isEmpty } from '@utils/util';
import { sendMail } from '@utils/helpers/sendMail';
import crypto from 'crypto';
import userModel from '@models/users.model';
import verifyModel from '@models/verify.model';
import { User } from '@interfaces/users.interface';

class VerifyService {
  public verify = verifyModel;
  public users = userModel;

  public async actionSendMailToken(user: User, email: string): Promise<void> {
    const { token } = await this.verify.create({ user_id: user._id, token: crypto.randomBytes(16).toString('hex') });
    return await sendMail({ email: email, confirm: { token: token } });
  }

  public async confirmationVerify(verifyData: ConfirmVerifyDto): Promise<VerifyTokenReturn> {
    if (isEmpty(verifyData)) throw new HttpException(400, 'verifyData is empty');

    const { email, token } = verifyData;
    const tokenData: VerifyToken = await this.verify.findOne({ token: token });
    if (!tokenData) throw new HttpException(400, `We were unable to find a valid token. Your token have expired.`);

    const user: User = await this.users.findOne({ _id: tokenData.user_id, email: email.toLowerCase() });
    if (user.is_verified) throw new HttpException(401, 'This account has already been verified. Please log in.');

    await this.users.updateOne({ _id: user._id }, { is_verified: true });
    return { user_id: user._id, email: email, is_verified: true };
  }

  public async sendTokenVerify(sendTokenData: SendTokenVerifyDto): Promise<void> {
    if (isEmpty(sendTokenData)) throw new HttpException(400, 'sendTokenData is empty');
    const { email } = sendTokenData;

    const user: User = await this.users.findOne({ email: email.toLowerCase() });
    if (user.is_verified) throw new HttpException(401, 'This account has already been verified. Please log in.');

    return await this.actionSendMailToken(user, email);
  }
}

export default VerifyService;

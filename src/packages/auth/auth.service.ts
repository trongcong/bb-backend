import { compare, hash, hashSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { CreateUserDto, LoginUserDto, UserEmailDto } from '@packages/users/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@packages/auth/auth.interface';
import { LoginReturn, User, UserReturn } from '@packages/users/users.interface';
import userModel from '@packages/users/users.model';
import { getUserReturn, isEmpty } from '@utils/util';
import VerifyService from '@packages/verify/verify.service';
import crypto from 'crypto';
import { sendMail } from '@utils/helpers/sendMail';

class AuthService {
  public users = userModel;
  private verifyService = new VerifyService();

  public async register(userData: CreateUserDto): Promise<UserReturn> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const { email, password } = userData;
    const findUser: User = await this.users.findOne({ email: email });
    if (findUser) throw new HttpException(409, `This email ${email} already exists`);

    const hashedPassword = await hash(password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });
    const user: UserReturn = getUserReturn(createUserData);

    await this.verifyService.actionSendMailToken(createUserData, email);
    return user;
  }

  public async resetPassword(userData: UserEmailDto): Promise<UserReturn> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const { email } = userData;
    const findUser: User = await this.users.findOne({ email: email });
    if (!findUser) throw new HttpException(400, 'User not found');

    const new_password = crypto.randomBytes(8).toString('hex');
    const updateData: Pick<User, 'password' | 'last_pass_change_at'> = {
      password: hashSync(new_password, 10),
      last_pass_change_at: Date.now(),
    };
    const updatedUserData: User = await this.users.findByIdAndUpdate(findUser._id, updateData);
    const user: UserReturn = getUserReturn(updatedUserData);

    await sendMail({ confirm: { token: new_password }, email: email, type: 'reset-pass' });
    return user;
  }

  public async login(userData: LoginUserDto): Promise<LoginReturn> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const { email, password, remember } = userData;
    const findUser: User = await this.users.findOne({ email: email });
    if (!findUser) throw new HttpException(409, `This email "${email}" was not found`);

    const isPasswordMatching: boolean = await compare(password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = this.createToken(findUser, remember);
    const cookie = this.createCookie(tokenData);
    const user: UserReturn = getUserReturn(findUser);

    return { cookie, findUser: user, tokenData };
  }

  public async logout(userData: User): Promise<UserReturn> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    return getUserReturn(findUser);
  }

  public createToken(user: User, remember: boolean): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id, created_at: Date.now() };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = remember ? 60 * 60 * 24 * 7 : 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;

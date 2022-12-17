import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { CreateUserDto, LoginUserDto } from '@packages/users/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@packages/auth/auth.interface';
import { User, UserReturn } from '@packages/users/users.interface';
import userModel from '@packages/users/users.model';
import { isEmpty } from '@utils/util';
import VerifyService from '@packages/verify/verify.service';

class AuthService {
  public users = userModel;
  private verifyService = new VerifyService();

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const { email, password } = userData;
    const findUser: User = await this.users.findOne({ email: email });
    if (findUser) throw new HttpException(409, `This email ${email} already exists`);

    const hashedPassword = await hash(password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });

    await this.verifyService.actionSendMailToken(createUserData, email);
    return createUserData;
  }

  public async login(userData: LoginUserDto): Promise<UserReturn> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findOne({ email: userData.email }, { __v: 0, last_pass_change_at: 0 });
    if (!findUser) throw new HttpException(409, `This email "${userData.email}" was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser, tokenData };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;

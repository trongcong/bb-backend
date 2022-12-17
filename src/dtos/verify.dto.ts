import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmVerifyDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public token: string;
}

export class SendTokenVerifyDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;
}

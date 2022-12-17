import { IsBoolean, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { isMatch } from '@utils/match.decorator';

export class UserEmailDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;
}

export class UserDto extends UserEmailDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  public password: string;
}

export class LoginUserDto extends UserDto {
  @IsBoolean()
  public remember: boolean;
}

export class CreateUserDto extends UserDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @MinLength(4)
  @isMatch('password')
  public confirm_pass: string;

  @IsBoolean()
  public agreement: boolean;
}

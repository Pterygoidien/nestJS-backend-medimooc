import { IsEmail, IsString, IsNotEmpty, MinLength } from "class-validator";

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsNotEmpty()
    password: string;
}
export default RegisterDto;
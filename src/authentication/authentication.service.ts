import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import RegisterDto from "./dto/register.dto";
import PostgresErrorCode from "../database/postgresErrorCode.enum";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../features/user/user.service";

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService

    ) { }

    public async register(registrationData: RegisterDto) {
        const { email, password } = registrationData;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const createdUser = await this.userService.createUser({
                email,
                password: hashedPassword,
            });
            return createdUser;
        } catch (error) {
            if (error.code === PostgresErrorCode.UniqueViolation) {
                throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
            } else {
                throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    public async getAuthenticatedUser(email: string, plainTextPassword: string) {
        try {
            const user = await this.userService.findByEmail(email);
            await this.verifyPassword(plainTextPassword, user.password);
            return user;
        } catch (error) {
            throw new BadRequestException('Wrong credentials provided');
        }
    }

    private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword);
        if (!isPasswordMatching) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST)
        }
    }
    public getCookieWithJwtAccessToken(userId: string) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload,
            {
                secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
                expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
            }
        );
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;

    }

    public getCookieWithJwtRefreshToken(userId: string) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload,
            {
                secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
                expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`
            }
        );
        const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;
        return {
            cookie,
            token
        };
    }

    public getCookieForLogOut() {
        return ['Authentication=; HttpOnly; Path=/; Max-Age=0', 'Refresh=; HttpOnly; Path=/; Max-Age=0'];
    }
}

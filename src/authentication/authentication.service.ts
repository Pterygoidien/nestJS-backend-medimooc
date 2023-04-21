import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt';
import { BadRequestException } from "@nestjs/common";

import RegisterDto from "./dto/register.dto";
import PostgresErrorCode from "src/database/postgresErrorCode.enum";

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userService: UserService,
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
                throw new BadRequestException('Email already in use');
            } else {
                throw error;
            }
        }
    }
}

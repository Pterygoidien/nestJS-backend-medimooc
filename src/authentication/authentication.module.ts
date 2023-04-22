import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthenticationService } from "./authentication.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { AuthenticationController } from "./authentication.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UserModule } from "../features/user/user.module";

@Module({
    imports: [
        UserModule,
        PassportModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: `${configService.get<string>('JWT_EXPIRATION_TIME')}s` }
            }),
        }),
    ],
    controllers: [AuthenticationController],
    providers: [AuthenticationService, LocalStrategy, JwtStrategy],
})

export class AuthenticationModule { }
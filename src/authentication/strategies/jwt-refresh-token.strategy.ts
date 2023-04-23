import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/features/user/user.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh-token'
) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request?.cookies?.Refresh;
            }]),
            secretOrKey: configService.get('jwt.refreshTokenSecret'),
            passReqToCallback: true,
        });
    }

    async validate(request: Request, payload: TokenPayload) {
        const refreshToken = request.cookies?.Refresh;
        return this.userService.getUserIfRefreshTokenMatches(refreshToken, payload.userId);
    }
}
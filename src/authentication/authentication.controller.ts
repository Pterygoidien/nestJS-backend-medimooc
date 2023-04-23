import { Body, Get, Controller, Post, UseGuards, Request, HttpCode, Res, Req, UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { Response } from "express";
import { AuthenticationService } from "./authentication.service";
import RegisterDto from "./dto/register.dto";
import RequestWithUser from "./interface/requestWithUser.interface";
import { LocalAuthenticationGuard } from "./guard/local-authentication.guard";
import JwtAuthenticationGuard from "./guard/jwt-authentication.guard";
import { UserService } from "src/features/user/user.service";
import { JwtRefreshGuard } from "./guard/jwt-refresh.guard";

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly userService: UserService
    ) { }

    @Post('register')
    async register(@Body() registrationData: RegisterDto) {
        return this.authenticationService.register(registrationData);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('login')
    async login(@Request() req: RequestWithUser) {
        const { user } = req;
        const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id);
        const {
            cookie: refreshTokenCookie,
            token: refreshToken,
        } = this.authenticationService.getCookieWithJwtRefreshToken(user.id);

        await this.userService.setCurrentRefreshToken(refreshToken, user.id);

        req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
        return user;
    }

    @HttpCode(200)
    @Post('logout')
    async logout(@Req() request: RequestWithUser, @Res() response: Response) {
        await this.userService.removeRefreshToken(request.user.id);
        response.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
        return response.sendStatus(200);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get()
    authenticate(@Request() req: RequestWithUser) {
        const user = req.user;
        return user;
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    async refresh(@Request() req: RequestWithUser) {
        const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(req.user.id);
        req.res.setHeader('Set-Cookie', accessTokenCookie);
        return req.user;
    }
}

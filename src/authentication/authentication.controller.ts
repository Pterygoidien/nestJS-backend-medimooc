import { Body, Get, Controller, Post, UseGuards, Request, HttpCode, Res, Req } from "@nestjs/common";
import { Response } from "express";
import { AuthenticationService } from "./authentication.service";
import RegisterDto from "./dto/register.dto";
import RequestWithUser from "./interface/requestWithUser.interface";
import { LocalAuthenticationGuard } from "./strategies/localAuthentication.guard";
import JwtAuthenticationGuard from "./strategies/jwtAuthentication.guard";

@Controller('auth')
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService
    ) { }

    @Post('register')
    async register(@Body() registrationData: RegisterDto) {
        return this.authenticationService.register(registrationData);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('login')
    async login(@Request() req: RequestWithUser, @Res() res: Response) {
        const { user } = req;
        const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
        res.setHeader('Set-Cookie', cookie);
        user.password = undefined;
        return res.send(user);
    }

    @HttpCode(200)
    @Post('logout')
    async logout(@Req() request: RequestWithUser, @Res() response: Response) {
        response.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
        return response.sendStatus(200);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get()
    authenticate(@Request() req: RequestWithUser) {
        const user = req.user;
        user.password = undefined;
        return user;
    }
}

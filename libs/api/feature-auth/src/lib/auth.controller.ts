import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import { CurrentUser, Public } from "./decorators";
import { RefreshTokenGuard } from "./guards";

@Controller("auth")
export class AuthController {
  constructor(private service: AuthService) {}

  @Public()
  @Post("signup")
  signup(@Res({ passthrough: true }) response: Response, @Body() dto: AuthDto) {
    return this.service.signup(response, dto);
  }

  @Public()
  @Post("signin")
  @HttpCode(HttpStatus.OK)
  signin(@Res({ passthrough: true }) response: Response, @Body() dto: AuthDto) {
    return this.service.signin(response, dto);
  }

  @Post("signout")
  @HttpCode(HttpStatus.OK)
  signout(@Res({ passthrough: true }) response: Response, @CurrentUser("username") username: string) {
    return this.service.signout(response, username);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser("username") username: string,
    @CurrentUser("refreshToken") refreshToken: string
  ) {
    return this.service.refreshToken(response, username, refreshToken);
  }

  @Get("me")
  @HttpCode(HttpStatus.OK)
  me(@CurrentUser("username") username: string) {
    return this.service.me(username);
  }
}

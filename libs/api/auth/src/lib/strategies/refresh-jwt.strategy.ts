import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { JwtFromRequestFunction, Strategy } from "passport-jwt";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, "refresh-jwt") {
  constructor() {
    super({
      jwtFromRequest: refreshTokenCookieExtractor,
      secretOrKey: "REFRESH_JWT",
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: any) {
    return { ...payload, refreshToken: request.cookies["refresh_token"] };
  }
}

export const refreshTokenCookieExtractor = (request: Request): JwtFromRequestFunction => {
  let token = null;
  if (request && request.cookies) token = request.cookies["refresh_token"];
  return token;
};

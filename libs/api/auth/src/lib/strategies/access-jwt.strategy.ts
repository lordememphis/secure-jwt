import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, "access-jwt") {
  constructor() {
    super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: "ACCESS_JWT" });
  }

  validate(payload: any) {
    return payload;
  }
}

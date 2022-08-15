import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import * as argon from "argon2";
import { Response } from "express";
import { Model, UpdateWriteOpResult } from "mongoose";
import { filter, forkJoin, from, map, Observable, of, switchMap, tap } from "rxjs";
import { AuthDto } from "./auth.dto";
import { User, UserDocument } from "./user.schema";

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private user: Model<UserDocument>, private jwt: JwtService) {}

  signup(response: Response, dto: AuthDto) {
    return from(argon.hash(dto.password)).pipe(
      tap((hash) => (dto.password = hash)),
      switchMap(() => from(this.user.create({ ...dto, refreshToken: null }))),
      switchMap((user) => this.tokens(response, user)),
      map(([access_token, _]) => ({ access_token }))
    );
  }

  signin(response: Response, dto: AuthDto) {
    return from(this.user.findOne({ username: dto.username }, { username: true, password: true })).pipe(
      map((user) => {
        if (!user) throw new NotFoundException("User not found");
        return user;
      }),
      switchMap((user) => forkJoin([of(user), from(argon.verify(user.password, dto.password))])),
      map(([user, verified]) => {
        if (!verified) throw new ForbiddenException("Access denied");
        return user;
      }),
      switchMap((user) => forkJoin([of(user), this.tokens(response, user)])),
      switchMap(([user, [access_token, refresh_token]]) =>
        forkJoin([of(access_token), this.updateRefreshToken(user, refresh_token)])
      ),
      map(([access_token, verified]) => {
        if (!verified) throw new ForbiddenException("Access denied");
        return { access_token };
      })
    );
  }

  signout(response: Response, username: string) {
    return from(this.user.updateOne({ username }, { refreshToken: null })).pipe(
      map((update: UpdateWriteOpResult) => !!update.modifiedCount),
      filter((signedOut) => !!signedOut),
      tap(() => response.clearCookie("refresh_token"))
    );
  }

  refreshToken(response: Response, username: string, refreshToken: string) {
    return from(this.user.findOne({ username }, { username: true, refreshToken: true })).pipe(
      map((user) => {
        if (!user || !user.refreshToken) throw new ForbiddenException("Access denied");
        return user;
      }),
      switchMap((user) => forkJoin([of(user), from(argon.verify(user.refreshToken, refreshToken))])),
      map(([user, verified]) => {
        if (!verified) throw new ForbiddenException("Access denied");
        return user;
      }),
      switchMap((user) => forkJoin([of(user), this.tokens(response, user)])),
      switchMap(([user, [access_token, refresh_token]]) =>
        forkJoin([of([access_token, refresh_token]), this.updateRefreshToken(user, refresh_token)])
      ),
      map(([[access_token, _], verified]) => {
        if (!verified) throw new ForbiddenException("Access denied");
        return { access_token };
      })
    );
  }

  me(username: string) {
    return from(this.user.findOne({ username })).pipe(
      map((user) => {
        if (!user) throw new NotFoundException("User not found");
        return user;
      })
    );
  }

  private tokens(response: Response, user: UserDocument) {
    const payload = { sub: user._id, username: user.username };
    return forkJoin([
      this.jwt.signAsync(payload, { secret: "ACCESS_JWT", expiresIn: "15m" }),
      this.jwt.signAsync(payload, { secret: "REFRESH_JWT", expiresIn: "7d" }),
    ]).pipe(
      tap(([_, refresh_token]) =>
        response.cookie("refresh_token", `${refresh_token}`, {
          httpOnly: true,
          secure: true,
        })
      )
    );
  }

  private updateRefreshToken(user: UserDocument, refreshToken: string): Observable<boolean> {
    return from(argon.hash(refreshToken)).pipe(
      switchMap((hashedRefreshToken) =>
        this.user.updateOne({ username: user.username }, { refreshToken: hashedRefreshToken })
      ),
      map((update: UpdateWriteOpResult) => !!update.modifiedCount)
    );
  }
}

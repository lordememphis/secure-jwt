import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "@secure-jwt/api/prisma";
import * as argon from "argon2";
import { Response } from "express";
import { filter, forkJoin, from, map, Observable, of, switchMap, tap } from "rxjs";
import { AuthDto } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  signup(response: Response, dto: AuthDto) {
    return from(argon.hash(dto.password)).pipe(
      tap((hash) => (dto.password = hash)),
      switchMap(() => from(this.prisma.user.create({ data: dto }))),
      switchMap((user) => this.tokens(response, user)),
      map(([access_token, _]) => ({ access_token }))
    );
  }

  signin(response: Response, dto: AuthDto) {
    return from(this.prisma.user.findFirst({ where: { username: dto.username } })).pipe(
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
    return from(this.prisma.user.update({ where: { username }, data: { refreshToken: null } })).pipe(
      filter((user) => !!user),
      tap(() => response.clearCookie("refresh_token"))
    );
  }

  refreshToken(response: Response, username: string, refreshToken: string) {
    return from(this.prisma.user.findFirst({ where: { username } })).pipe(
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
    return from(this.prisma.user.findFirst({ where: { username } })).pipe(
      map((user) => {
        if (!user) throw new NotFoundException("User not found");
        return user;
      })
    );
  }

  private tokens(response: Response, user: User) {
    const payload = { sub: user.id, username: user.username };
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

  private updateRefreshToken(user: User, refreshToken: string): Observable<boolean> {
    return from(argon.hash(refreshToken)).pipe(
      switchMap((hashedRefreshToken) =>
        this.prisma.user.update({ where: { username: user.username }, data: { refreshToken: hashedRefreshToken } })
      ),
      map((user) => !!user)
    );
  }
}

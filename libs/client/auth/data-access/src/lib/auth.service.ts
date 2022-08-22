import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "@prisma/client";
import { AuthDto, AuthResponse } from "@secure-jwt/api-interfaces";
import { tap } from "rxjs";
import { AuthInterceptor } from "./auth.interceptor";

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  signup(dto: AuthDto) {
    return this.http.post("/api/auth/signup", dto);
  }

  signin(dto: AuthDto) {
    return this.http
      .post<AuthResponse>("/api/auth/signin", dto)
      .pipe(tap((tokens) => (AuthInterceptor.access_token = tokens.access_token)));
  }

  signout() {
    return this.http.post<boolean>("/api/auth/signout", null).pipe(
      tap((signedOut) => {
        if (signedOut) AuthInterceptor.access_token = null;
      })
    );
  }

  refreshToken() {
    return this.http.post<AuthResponse>("/api/auth/refresh", null).pipe(
      tap((tokens) => {
        if (tokens) AuthInterceptor.access_token = tokens.access_token;
        else this.router.navigate(["/auth"]);
      })
    );
  }

  me() {
    return this.http.get<User>("api/auth/me");
  }
}

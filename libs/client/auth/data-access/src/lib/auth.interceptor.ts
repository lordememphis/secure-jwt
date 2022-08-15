import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable, Provider } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  static access_token: string | null = null;
  private refresh = false;

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (AuthInterceptor.access_token)
      request = request.clone({ setHeaders: { Authorization: `Bearer ${AuthInterceptor.access_token}` } });

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.refresh) {
          this.refresh = true;
          return this.authService.refreshToken().pipe(
            switchMap((tokens) => {
              AuthInterceptor.access_token = tokens.access_token;
              return next.handle(
                request.clone({ setHeaders: { Authorization: `Bearer ${AuthInterceptor.access_token}` } })
              );
            })
          );
        }
        this.refresh = false;
        return throwError(() => {
          this.router.navigate(["/auth"]);
          return error;
        });
      })
    );
  }
}

export const AuthInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};

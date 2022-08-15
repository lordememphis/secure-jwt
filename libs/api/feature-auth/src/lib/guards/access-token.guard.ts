import { ExecutionContext, Injectable, Provider } from "@nestjs/common";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class AccessTokenGuard extends AuthGuard("access-jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride("isPublic", [context.getHandler(), context.getClass()]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}

export const AccessTokenGuardProvider: Provider = { provide: APP_GUARD, useClass: AccessTokenGuard };

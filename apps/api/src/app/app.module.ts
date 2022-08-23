import { Module } from "@nestjs/common";
import { AccessTokenGuardProvider, AuthModule } from "@secure-jwt/api/auth";
import { PrismaModule } from "@secure-jwt/api/prisma";

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [AccessTokenGuardProvider],
})
export class AppModule {}

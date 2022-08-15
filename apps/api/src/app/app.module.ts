import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AccessTokenGuardProvider, AuthModule } from "@secure-jwt/api/feature-auth";
import { environment } from "../environments/environment";

@Module({
  imports: [AuthModule, MongooseModule.forRoot(environment.DATABASE)],
  providers: [AccessTokenGuardProvider],
})
export class AppModule {}

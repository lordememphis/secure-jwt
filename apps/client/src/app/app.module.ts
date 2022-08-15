import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { AuthInterceptorProvider } from "@secure-jwt/client/auth/data-access";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: "",
        loadChildren: async () => (await import("@secure-jwt/client/feature-shell")).ClientFeatureShellModule,
      },
      {
        path: "auth",
        loadChildren: async () => (await import("@secure-jwt/client/auth/feature-auth")).ClientAuthFeatureAuthModule,
      },
    ]),
  ],
  providers: [AuthInterceptorProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}

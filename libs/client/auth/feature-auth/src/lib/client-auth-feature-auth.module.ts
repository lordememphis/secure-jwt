import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ClientAuthDataAccessModule } from "@secure-jwt/client/auth/data-access";
import { CoreCarbonModule } from "@secure-jwt/client/core/carbon";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: "", redirectTo: "signin", pathMatch: "full" },
      { path: "signup", component: RegisterComponent },
      { path: "signin", component: LoginComponent },
    ]),
    CoreCarbonModule,
    ReactiveFormsModule,
    ClientAuthDataAccessModule,
  ],
  declarations: [RegisterComponent, LoginComponent],
})
export class ClientAuthFeatureAuthModule {}

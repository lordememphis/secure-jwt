import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CoreCarbonModule } from "@secure-jwt/client/core/carbon";
import { HeaderComponent } from "./header/header.component";
import { LayoutComponent } from "./layout/layout.component";
import routes from "./routes";

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), CoreCarbonModule],
  declarations: [HeaderComponent, LayoutComponent],
})
export class ClientFeatureShellModule {}

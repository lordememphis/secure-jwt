import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";

@NgModule({
  imports: [CommonModule, RouterModule.forChild([{ path: "", component: DashboardComponent }])],
  declarations: [DashboardComponent],
})
export class ClientFeatureDashboardModule {}

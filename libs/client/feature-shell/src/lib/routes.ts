import { Routes } from "@angular/router";
import { AuthGuard } from "@secure-jwt/client/auth/data-access";
import { LayoutComponent } from "./layout/layout.component";

export default [
  {
    path: "",
    canActivate: [AuthGuard],
    component: LayoutComponent,
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      {
        path: "dashboard",
        loadChildren: async () => (await import("@secure-jwt/client/feature-dashboard")).ClientFeatureDashboardModule,
      },
    ],
  },
] as Routes;

import { Component } from "@angular/core";
import { AuthService } from "@secure-jwt/client/auth/data-access";

@Component({
  selector: "secure-jwt-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent {
  user$ = this.auth.me();

  constructor(private auth: AuthService) {}
}

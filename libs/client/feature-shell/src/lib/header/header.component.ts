import { Component, HostBinding } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@secure-jwt/client/auth/data-access";

@Component({
  selector: "secure-jwt-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  @HostBinding("class.cds--header") headerClass = true;

  constructor(private auth: AuthService, private router: Router) {}

  signout() {
    this.auth.signout().subscribe({
      next: (signedOut) => {
        if (signedOut) this.router.navigate(["/auth"]);
      },
    });
  }

  refreshToken() {
    this.auth.refreshToken().subscribe();
  }
}

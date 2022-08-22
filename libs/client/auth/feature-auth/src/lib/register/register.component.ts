import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthDto } from "@secure-jwt/api-interfaces";
import { AuthService } from "@secure-jwt/client/auth/data-access";

@Component({
  selector: "secure-jwt-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
  form = this.fb.group({ username: "", password: "" });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  createAccount() {
    if (this.form.valid)
      this.auth.signup(this.form.value as AuthDto).subscribe({ next: () => this.router.navigate(["/auth", "signin"]) });
  }
}

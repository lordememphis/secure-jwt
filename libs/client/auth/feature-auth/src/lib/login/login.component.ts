import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthDto, AuthService } from "@secure-jwt/client/auth/data-access";

@Component({
  selector: "secure-jwt-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  form = this.fb.group({
    username: "",
    password: "",
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  login() {
    this.auth.signin(this.form.value as AuthDto).subscribe({ next: () => this.router.navigate(["/"]) });
  }
}

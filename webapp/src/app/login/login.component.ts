import {Component, ViewEncapsulation} from '@angular/core';
import {AmplifyService} from "aws-amplify-angular";
import {Router} from "@angular/router";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private amplifyService: AmplifyService, private router: Router) {
    this.amplifyService.authStateChange$
      .subscribe(authState => {
        if (authState.state === 'signedIn') {
          this.router.navigate(['/']);
        }
      })
  }
}

import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AmplifyService} from "aws-amplify-angular";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private amplifyService: AmplifyService, private router: Router) {}

  canActivate() {
    return this.amplifyService.auth().currentAuthenticatedUser()
      .then(user => true)
      .catch(err => {
        this.router.navigate(['/login']);
        return false
      })

  }
}

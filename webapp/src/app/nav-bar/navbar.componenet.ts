import {Component, OnInit} from '@angular/core';
import {AmplifyService} from 'aws-amplify-angular';
import {Observable} from "rxjs";

@Component({
  selector: 'nav-bar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponenet {

  links = [
    {url: '/topics', text: 'Topics Graph'},
    {url: '/documents', text: 'Documents Graph'}
  ];

  isLoggedIn: boolean;

  constructor(private amplifyService: AmplifyService) {
    this.amplifyService.authStateChange$
      .subscribe(authState => {
        this.isLoggedIn = authState.state === 'signedIn';
      });
  }


}

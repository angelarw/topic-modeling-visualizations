import {Component} from '@angular/core';
import {AmplifyService} from 'aws-amplify-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(private amplifyService: AmplifyService) {
  }

}

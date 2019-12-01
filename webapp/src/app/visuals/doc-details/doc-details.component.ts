import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material";
import {Storage} from "aws-amplify";
import {Papa} from 'ngx-papaparse';
import {HttpClient} from "@angular/common/http";
import awsconfig from '../../../amplify-config';


@Component({
  selector: 'doc-details',
  templateUrl: 'doc-details.component.html',
  styleUrls: ['./doc-details.component.scss']
})


export class DocDetailsComponent {

  name: string;
  text: string;

  constructor(private papa: Papa, private httpClient: HttpClient,
              @Inject(MAT_DIALOG_DATA) data) {
    this.name = data.name;
    Storage.get(this.name, {
      bucket: awsconfig.Storage.documentBucket,
      download: true,
      region: awsconfig.Storage.documentBucketRegion,
      customPrefix: {
        public: awsconfig.Storage.documentPrefix
      }
    }).then((data: any) => {
      console.log(data);
      this.text = data.Body.toString().replace(/\n/g, "<br />");

    });

  }
}

import {Injectable} from '@angular/core';
import {Auth} from "aws-amplify";
import {HttpClient} from "@angular/common/http";

import Amplify, {API} from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor(private httpClient: HttpClient) {
  }

  async getTopicTerms() {
    let neptuneAPIName = 'NeptuneAPI';
    let path = '/topics';
    let params = {
      headers: {Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`},
      response: true
    };
    return API.get(neptuneAPIName, path, params).then(
      (data: any) => {
        console.log(data);
        return data.data;
      });

  }

  async getTopDocuments(entities: string[], limit: number = 15) {
    let neptuneAPIName = 'NeptuneAPI';
    let path = '/docs';
    let params = {
      headers: {Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`},
      response: true,
      queryStringParameters: {
        queryType: "TopDocumentsByEntities",
        entities: entities,
        limit: limit.toString(),
      }
    };

    console.log(params);

    return API.get(neptuneAPIName, path, params).then(
      (data: any) => {
        console.log(data);
        return this.httpClient.get(data.data.s3url).toPromise();
      });

  }
}

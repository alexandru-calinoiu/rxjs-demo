import { Observable } from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";

import * as gql from 'nanogql';

import { HttpClient, json } from 'aurelia-fetch-client';

interface GraphqlResponse {
  data: Array<Domain>
}

interface Domain {
  name: string
}

export class App {
  message = 'Hello World!';

  attached(): void {
    const query = gql`
      {
        domain {
          name
        }
      }
    `
    const client = new HttpClient();

    client.configure(config => {
      config
        .withBaseUrl('http://localhost:5001/graphql')
        .withDefaults({
          headers: {
            'Accept': 'application/json'
          }
        })
        .withInterceptor({
          request(request) {
            console.log(`Requesting ${request.method} ${request.url}`);
            return request;
          },
          response(response) {
            console.log(`Received ${response.status} ${response.url}`);
            return response;
          }
        });
    });

    console.log(json(query()))

    Observable
      .fromPromise(client.fetch('', { method: 'post', body: json(query()) }))
      .flatMap(response => Observable.fromPromise(response.json()))
      .map(responseData => responseData.data.domain as Array<Domain>)
      .subscribe(data => this.message = `${data[0].name}, ${data[1].name}`)
  }
}

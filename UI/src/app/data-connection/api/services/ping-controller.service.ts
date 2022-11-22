/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpContext } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { PingResponse } from '../models/ping-response';

@Injectable({
  providedIn: 'root',
})
export class PingControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation pingControllerPing
   */
  static readonly PingControllerPingPath = '/ping';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `ping()` instead.
   *
   * This method doesn't expect any request body.
   */
  ping$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<PingResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PingControllerService.PingControllerPingPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PingResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `ping$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  ping(params?: {
    context?: HttpContext
  }
): Observable<PingResponse> {

    return this.ping$Response(params).pipe(
      map((r: StrictHttpResponse<PingResponse>) => r.body as PingResponse)
    );
  }

}

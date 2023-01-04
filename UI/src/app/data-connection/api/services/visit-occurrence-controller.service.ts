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

import { NewvisitOccurrence } from '../models/newvisit-occurrence';
import { Count as LoopbackCount } from '../models/loopback/count';
import { VisitOccurrence } from '../models/visit-occurrence';
import { VisitOccurrencePartial } from '../models/visit-occurrence-partial';
import { VisitOccurrenceWithRelations } from '../models/visit-occurrence-with-relations';

@Injectable({
  providedIn: 'root',
})
export class VisitOccurrenceControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation visitOccurrenceControllerCount
   */
  static readonly VisitOccurrenceControllerCountPath = '/visit_occurrence/count';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `count()` instead.
   *
   * This method doesn't expect any request body.
   */
  count$Response(params?: {
    where?: any;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<LoopbackCount>> {

    const rb = new RequestBuilder(this.rootUrl, VisitOccurrenceControllerService.VisitOccurrenceControllerCountPath, 'get');
    if (params) {
      rb.query('where', params.where, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<LoopbackCount>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `count$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  count(params?: {
    where?: any;
    context?: HttpContext
  }
): Observable<LoopbackCount> {

    return this.count$Response(params).pipe(
      map((r: StrictHttpResponse<LoopbackCount>) => r.body as LoopbackCount)
    );
  }

  /**
   * Path part for operation visitOccurrenceControllerFindById
   */
  static readonly VisitOccurrenceControllerFindByIdPath = '/visit_occurrence/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findById()` instead.
   *
   * This method doesn't expect any request body.
   */
  findById$Response(params: {
    id: {
};
    filter?: any;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<VisitOccurrenceWithRelations>> {

    const rb = new RequestBuilder(this.rootUrl, VisitOccurrenceControllerService.VisitOccurrenceControllerFindByIdPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
      rb.query('filter', params.filter, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<VisitOccurrenceWithRelations>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findById(params: {
    id: {
};
    filter?: any;
    context?: HttpContext
  }
): Observable<VisitOccurrenceWithRelations> {

    return this.findById$Response(params).pipe(
      map((r: StrictHttpResponse<VisitOccurrenceWithRelations>) => r.body as VisitOccurrenceWithRelations)
    );
  }

  /**
   * Path part for operation visitOccurrenceControllerReplaceById
   */
  static readonly VisitOccurrenceControllerReplaceByIdPath = '/visit_occurrence/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `replaceById()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  replaceById$Response(params: {
    id: {
};
    context?: HttpContext
    body?: VisitOccurrence
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, VisitOccurrenceControllerService.VisitOccurrenceControllerReplaceByIdPath, 'put');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `replaceById$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  replaceById(params: {
    id: {
};
    context?: HttpContext
    body?: VisitOccurrence
  }
): Observable<void> {

    return this.replaceById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation visitOccurrenceControllerDeleteById
   */
  static readonly VisitOccurrenceControllerDeleteByIdPath = '/visit_occurrence/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteById()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteById$Response(params: {
    id: {
};
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, VisitOccurrenceControllerService.VisitOccurrenceControllerDeleteByIdPath, 'delete');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `deleteById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteById(params: {
    id: {
};
    context?: HttpContext
  }
): Observable<void> {

    return this.deleteById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation visitOccurrenceControllerUpdateById
   */
  static readonly VisitOccurrenceControllerUpdateByIdPath = '/visit_occurrence/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateById()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateById$Response(params: {
    id: {
};
    context?: HttpContext
    body?: VisitOccurrencePartial
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, VisitOccurrenceControllerService.VisitOccurrenceControllerUpdateByIdPath, 'patch');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateById$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateById(params: {
    id: {
};
    context?: HttpContext
    body?: VisitOccurrencePartial
  }
): Observable<void> {

    return this.updateById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation visitOccurrenceControllerFind
   */
  static readonly VisitOccurrenceControllerFindPath = '/visit_occurrence';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `find()` instead.
   *
   * This method doesn't expect any request body.
   */
  find$Response(params?: {
    filter?: any;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<VisitOccurrenceWithRelations>>> {

    const rb = new RequestBuilder(this.rootUrl, VisitOccurrenceControllerService.VisitOccurrenceControllerFindPath, 'get');
    if (params) {
      rb.query('filter', params.filter, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<VisitOccurrenceWithRelations>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `find$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  find(params?: {
    filter?: any;
    context?: HttpContext
  }
): Observable<Array<VisitOccurrenceWithRelations>> {

    return this.find$Response(params).pipe(
      map((r: StrictHttpResponse<Array<VisitOccurrenceWithRelations>>) => r.body as Array<VisitOccurrenceWithRelations>)
    );
  }

  /**
   * Path part for operation visitOccurrenceControllerCreate
   */
  static readonly VisitOccurrenceControllerCreatePath = '/visit_occurrence';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `create()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create$Response(params?: {
    context?: HttpContext
    body?: NewvisitOccurrence
  }
): Observable<StrictHttpResponse<VisitOccurrence>> {

    const rb = new RequestBuilder(this.rootUrl, VisitOccurrenceControllerService.VisitOccurrenceControllerCreatePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<VisitOccurrence>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `create$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create(params?: {
    context?: HttpContext
    body?: NewvisitOccurrence
  }
): Observable<VisitOccurrence> {

    return this.create$Response(params).pipe(
      map((r: StrictHttpResponse<VisitOccurrence>) => r.body as VisitOccurrence)
    );
  }

  /**
   * Path part for operation visitOccurrenceControllerUpdateAll
   */
  static readonly VisitOccurrenceControllerUpdateAllPath = '/visit_occurrence';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateAll()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateAll$Response(params?: {
    where?: any;
    context?: HttpContext
    body?: VisitOccurrencePartial
  }
): Observable<StrictHttpResponse<LoopbackCount>> {

    const rb = new RequestBuilder(this.rootUrl, VisitOccurrenceControllerService.VisitOccurrenceControllerUpdateAllPath, 'patch');
    if (params) {
      rb.query('where', params.where, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<LoopbackCount>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateAll$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateAll(params?: {
    where?: any;
    context?: HttpContext
    body?: VisitOccurrencePartial
  }
): Observable<LoopbackCount> {

    return this.updateAll$Response(params).pipe(
      map((r: StrictHttpResponse<LoopbackCount>) => r.body as LoopbackCount)
    );
  }

}

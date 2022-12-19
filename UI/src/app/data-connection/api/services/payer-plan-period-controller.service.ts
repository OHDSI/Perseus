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

import { NewpayerPlanPeriod } from '../models/newpayer-plan-period';
import { Count as LoopbackCount } from '../models/loopback/count';
import { PayerPlanPeriod } from '../models/payer-plan-period';
import { PayerPlanPeriodPartial } from '../models/payer-plan-period-partial';
import { PayerPlanPeriodWithRelations } from '../models/payer-plan-period-with-relations';

@Injectable({
  providedIn: 'root',
})
export class PayerPlanPeriodControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation payerPlanPeriodControllerCount
   */
  static readonly PayerPlanPeriodControllerCountPath = '/payer_plan_period/count';

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

    const rb = new RequestBuilder(this.rootUrl, PayerPlanPeriodControllerService.PayerPlanPeriodControllerCountPath, 'get');
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
   * Path part for operation payerPlanPeriodControllerFindById
   */
  static readonly PayerPlanPeriodControllerFindByIdPath = '/payer_plan_period/{id}';

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
): Observable<StrictHttpResponse<PayerPlanPeriodWithRelations>> {

    const rb = new RequestBuilder(this.rootUrl, PayerPlanPeriodControllerService.PayerPlanPeriodControllerFindByIdPath, 'get');
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
        return r as StrictHttpResponse<PayerPlanPeriodWithRelations>;
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
): Observable<PayerPlanPeriodWithRelations> {

    return this.findById$Response(params).pipe(
      map((r: StrictHttpResponse<PayerPlanPeriodWithRelations>) => r.body as PayerPlanPeriodWithRelations)
    );
  }

  /**
   * Path part for operation payerPlanPeriodControllerReplaceById
   */
  static readonly PayerPlanPeriodControllerReplaceByIdPath = '/payer_plan_period/{id}';

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
    body?: PayerPlanPeriod
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, PayerPlanPeriodControllerService.PayerPlanPeriodControllerReplaceByIdPath, 'put');
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
    body?: PayerPlanPeriod
  }
): Observable<void> {

    return this.replaceById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation payerPlanPeriodControllerDeleteById
   */
  static readonly PayerPlanPeriodControllerDeleteByIdPath = '/payer_plan_period/{id}';

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

    const rb = new RequestBuilder(this.rootUrl, PayerPlanPeriodControllerService.PayerPlanPeriodControllerDeleteByIdPath, 'delete');
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
   * Path part for operation payerPlanPeriodControllerUpdateById
   */
  static readonly PayerPlanPeriodControllerUpdateByIdPath = '/payer_plan_period/{id}';

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
    body?: PayerPlanPeriodPartial
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, PayerPlanPeriodControllerService.PayerPlanPeriodControllerUpdateByIdPath, 'patch');
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
    body?: PayerPlanPeriodPartial
  }
): Observable<void> {

    return this.updateById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation payerPlanPeriodControllerFind
   */
  static readonly PayerPlanPeriodControllerFindPath = '/payer_plan_period';

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
): Observable<StrictHttpResponse<Array<PayerPlanPeriodWithRelations>>> {

    const rb = new RequestBuilder(this.rootUrl, PayerPlanPeriodControllerService.PayerPlanPeriodControllerFindPath, 'get');
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
        return r as StrictHttpResponse<Array<PayerPlanPeriodWithRelations>>;
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
): Observable<Array<PayerPlanPeriodWithRelations>> {

    return this.find$Response(params).pipe(
      map((r: StrictHttpResponse<Array<PayerPlanPeriodWithRelations>>) => r.body as Array<PayerPlanPeriodWithRelations>)
    );
  }

  /**
   * Path part for operation payerPlanPeriodControllerCreate
   */
  static readonly PayerPlanPeriodControllerCreatePath = '/payer_plan_period';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `create()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create$Response(params?: {
    context?: HttpContext
    body?: NewpayerPlanPeriod
  }
): Observable<StrictHttpResponse<PayerPlanPeriod>> {

    const rb = new RequestBuilder(this.rootUrl, PayerPlanPeriodControllerService.PayerPlanPeriodControllerCreatePath, 'post');
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
        return r as StrictHttpResponse<PayerPlanPeriod>;
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
    body?: NewpayerPlanPeriod
  }
): Observable<PayerPlanPeriod> {

    return this.create$Response(params).pipe(
      map((r: StrictHttpResponse<PayerPlanPeriod>) => r.body as PayerPlanPeriod)
    );
  }

  /**
   * Path part for operation payerPlanPeriodControllerUpdateAll
   */
  static readonly PayerPlanPeriodControllerUpdateAllPath = '/payer_plan_period';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateAll()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateAll$Response(params?: {
    where?: any;
    context?: HttpContext
    body?: PayerPlanPeriodPartial
  }
): Observable<StrictHttpResponse<LoopbackCount>> {

    const rb = new RequestBuilder(this.rootUrl, PayerPlanPeriodControllerService.PayerPlanPeriodControllerUpdateAllPath, 'patch');
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
    body?: PayerPlanPeriodPartial
  }
): Observable<LoopbackCount> {

    return this.updateAll$Response(params).pipe(
      map((r: StrictHttpResponse<LoopbackCount>) => r.body as LoopbackCount)
    );
  }

}

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Sublocation } from './sublocation.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class SublocationService {

    private resourceUrl = 'api/sublocations';
    private resourceSearchUrl = 'api/_search/sublocations';

    constructor(private http: Http) { }

    create(sublocation: Sublocation): Observable<Sublocation> {
        const copy = this.convert(sublocation);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(sublocation: Sublocation): Observable<Sublocation> {
        const copy = this.convert(sublocation);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Sublocation> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(sublocation: Sublocation): Sublocation {
        const copy: Sublocation = Object.assign({}, sublocation);
        return copy;
    }
}

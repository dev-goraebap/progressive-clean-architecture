import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { environment } from "src/shared/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class LinkPreviewApi {

    constructor(
        private readonly http: HttpClient
    ) {}

    getMetaData(url: string): Observable<Object> {
        const serviceUrl = 'https://api.linkpreview.net';
        const params = new HttpParams().set('q', url);
        const headers = new HttpHeaders().set('X-Linkpreview-Api-Key', environment.linkPreviewApiKey);

        return this.http.get(serviceUrl, { params: params, headers: headers });
    }
}
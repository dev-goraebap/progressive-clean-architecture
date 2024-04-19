import { Injectable } from "@angular/core";

import PocketBase from 'pocketbase';

@Injectable({
    providedIn: 'root'
})
export class PocketBaseClient {

    private _instance?: PocketBase;

    constructor() {}

    get instance() {
        if (!this._instance) {
            throw new Error('PocketBaseClient is not initialized 😅');
        }
        return this._instance;
    }

    initialize() {
        console.info('Initializing PocketBaseClient... ⚗️');
        this._instance = new PocketBase('http://127.0.0.1:8090');
    }
}
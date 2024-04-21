import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type ModalState = {
    opened: boolean;
    component: any;
    data: any;
}

@Injectable({
    providedIn: 'root'
})
export class ModalController {

    private readonly _state = new BehaviorSubject<ModalState>({
        opened: false,
        component: null,
        data: null
    });

    get state$() {
        return this._state.asObservable();
    }

    open(component: any, data: any) {
        this._state.next({
            opened: true,
            component,
            data
        });
    }

    close() {
        this._state.next({
            opened: false,
            component: null,
            data: null
        });
    }
}
import { Injectable } from "@angular/core";

import { BehaviorSubject, catchError, from, switchMap } from "rxjs";
import { pocketBaseClient } from "src/shared";
import { CategoryState } from "./category.type";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private readonly pocketbase = pocketBaseClient();

    private readonly state = new BehaviorSubject<CategoryState>({
        loaded: false,
        items: [],
        perPage: 30,
        page: 1,
        totalItems: 0,
        totalPages: 0,
        error: null,
    });

    getCategories() {
        const promise = this.pocketbase.collection('categories').getList();
        return from(promise).pipe(
            switchMap((result: any) => {
                this.state.next({
                    ...result,
                    loaded: true,
                    error: null
                });
                
                return this.state.asObservable();
            }),
            catchError((error) => {
                this.state.next({
                   ...this.state.value,
                    loaded: true,
                    error: error.message
                });

                return this.state.asObservable();
            })
        );
    }
}
import { DestroyRef, Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BehaviorSubject, from, tap } from "rxjs";

import { Supabase } from "src/shared";
import { CategoryEntity, CategoryState } from "./category.type";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private readonly _state$ = new BehaviorSubject<CategoryState>({
        loaded: false,
        count: 0,
        categories: [],
        error: null
    });

    constructor(
        private readonly supabase: Supabase,
        private readonly destroyRef: DestroyRef
    ) { }

    get state$() {
        if (!this._state$.value.loaded) {
            this.getAll();
        }
        
        return this._state$.asObservable();
    }

    private getAll() {
        return from(
            this.supabase.client
                .from('categories')
                .select('id, name')
                .order('created_at')
        ).pipe(
            tap((res: any) => {
                const data = res.data as CategoryEntity[];
                this._state$.next({
                    loaded: true,
                    count: data.length,
                    categories: data,
                    error: null
                })
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();
    }
}
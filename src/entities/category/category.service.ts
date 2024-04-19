import { Injectable, inject, signal } from "@angular/core";

import { CategoryApi } from "./category.api";
import { CategoryState } from "./category.type";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private readonly categoryApi: CategoryApi = inject(CategoryApi);

    private readonly _state = signal<CategoryState>({
        loaded: false,
        count: 0,
        categories: [],
        error: null
    });

    get state$() {        
        return this._state;
    }

    private async getAll() {
        const result = await this.categoryApi.getCategories();
        
        // this._state.set({
        //     loaded: true,
        //     count: result.totalItems,
        //     categories: result.items as any[],
        //     error: null
        // });
    }
}
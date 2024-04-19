import { Injectable, inject } from "@angular/core";
import { PocketBaseClient } from "src/shared";

@Injectable({
    providedIn: 'root'
})
export class CategoryApi {

    private readonly pb: PocketBaseClient = inject(PocketBaseClient);

    async getCategories() {
        return await this.pb.instance.collection('categories').getList();
    }
}
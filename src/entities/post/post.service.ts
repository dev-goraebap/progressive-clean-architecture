import { Injectable } from "@angular/core";

import { Supabase } from "src/shared";
import { AddPostDTO } from "./post.type";

@Injectable({
    providedIn: 'root'
})
export class PostService {

    constructor(
        private readonly supabase: Supabase
    ) { }

    async add({ categoryIds, ...dto }: AddPostDTO) {
        console.log('add post');

        const { data, error: postError } = await this.supabase.client
            .from('posts')
            .insert(dto)
            .select('id');

        const createdPostId = (data as any[])[0].id;
        
        const ids = categoryIds.map((categoryId) => ({
            post_id: createdPostId,
            category_id: categoryId
        }));

        console.log(ids);

        const { error } = await this.supabase.client
            .from('post_categories')
            .insert(ids);
        console.log(error);

        return (data as any[])[0].id;
    }
}
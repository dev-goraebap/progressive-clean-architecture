import { Injectable } from "@angular/core";

import { Supabase } from "src/shared";
import { AddPostDTO } from "./post.type";

@Injectable({
    providedIn: 'root'
})
export class PostService {

    constructor(
        private readonly supabase: Supabase
    ) {}

    async add(dto: AddPostDTO) {
        console.log('add post');

        const { data, error } = await this.supabase.client
            .from('posts')
            .insert(dto)
            .select();
        
        console.log(error);
        console.log(data);
    }
}
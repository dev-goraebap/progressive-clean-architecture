import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

import { BehaviorSubject, Observable, tap } from "rxjs";
import { AddPostDTO, PostState } from "./post.type";

@Injectable({
    providedIn: 'root'
})
export class PostService {

    private readonly http = inject(HttpClient);

    private readonly state = new BehaviorSubject<PostState>({
        loaded: false,
        items: [],
        perPage: 30,
        page: 1,
        totalItems: 0,
        totalPages: 0,
        error: null,
    });

    getPosts() {
        return this.http.get<any>('api/get-posts').pipe(
            tap(res => {
                console.log(res);
                this.state.next({
                   ...this.state.value,
                    loaded: true,
                    items: res.results,
                    error: null,
                });
            })
        );
    }

    addPost({ categoryIds, ...dto }: AddPostDTO) {
        return this.http.post<void>('api/add-post', { categoryIds,...dto }).pipe(
            tap(() => {
                this.getPosts();
            })
        );
    }
}
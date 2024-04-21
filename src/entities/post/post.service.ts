import { Injectable } from "@angular/core";

import { pocketBaseClient } from "src/shared";

import { BehaviorSubject, Observable, from, switchMap } from "rxjs";
import { AddPostDTO, PostState } from "./post.type";

@Injectable({
    providedIn: 'root'
})
export class PostService {

    private readonly pocketbase = pocketBaseClient();

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
        const promise = this.pocketbase.collection('posts').getList();

        return from(promise).pipe(
            switchMap((result: any) => {
                this.state.next({
                    ...result,
                    loaded: true,
                    error: null
                });
                
                return this.state.asObservable();
            }),
        );
    }

    addPost({ categoryIds, ...dto }: AddPostDTO): Observable<any> {
        const promise = this.pocketbase.collection('posts').create(dto);

        return from(promise).pipe(
            switchMap(result => {
                return Promise.all(
                    categoryIds.map(categoryId => 
                        this.pocketbase.collection('post_category').create({
                        post_id: result.id,
                        category_id: categoryId
                    }, { $autoCancel: false }))
                );
            })
        );
    }
}
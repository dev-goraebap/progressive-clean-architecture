import { Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { tap } from "rxjs";

import { PostCard, PostService, PostState } from "src/entities";
import { fadeInOut } from "src/shared";

@Component({
    selector: 'post-list-widget',
    standalone: true,
    imports: [
        PostCard,
    ],
    animations: [
        fadeInOut
    ],
    template: `
    <div @fadeInOut class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        @for (item of postState?.items; track $index) {
            <post-card [item]="item"/>
        }
    </div>
    `
})
export class PostListWidget {

    postState?: PostState;

    private readonly postService = inject(PostService);

    private readonly destroyRef = inject(DestroyRef);

    constructor() {
        this.postService.getPosts().pipe(
            tap(state => this.postState = state),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();
    }
}
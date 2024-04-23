import { AfterViewInit, Component, inject } from "@angular/core";

import { tap } from "rxjs";

import { PostCard, PostService, PostState } from "src/entities";
import { fadeInOut } from "src/shared";

@Component({
    selector: 'post-list-widget',
    standalone: true,
    imports: [
        PostCard,
    ],
    styles: [
        `
        :host {
            width: 100%;
            height: 100%;
        }
        .container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); /* 컬럼 크기를 자동으로 조절 */
            grid-auto-flow: column; /* 아이템을 컬럼 방향으로 쌓음 */
            grid-gap: 10px; /* 그리드 사이 간격 */
        }
        `
    ],
    animations: [
        fadeInOut
    ],
    template: `
    <div class="border border-red-500 w-full sm:w-full md:w-[1000px] flex justify-center">
        @for (item of postState?.items; track $index) {
            <img [src]="item.thumbnail" class="w-[200px]"/>
        }
    </div>
    `
})
export class PostListWidget implements AfterViewInit {

    postState?: PostState;
    
    private readonly postService = inject(PostService);

    constructor() {
        this.postService.getPosts().pipe(
            tap(state => this.postState = state)
        ).subscribe();
    }

    ngAfterViewInit() {

    }
}
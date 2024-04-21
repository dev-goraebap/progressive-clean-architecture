import { IMAGE_CONFIG } from "@angular/common";
import { Component, inject } from "@angular/core";
import { tap } from "rxjs";
import { PostService, PostState } from "src/entities";
import { ModalController } from "src/shared";

import { AddPostFormWidget } from "src/widgets";

@Component({
    selector: 'feed-page',
    standalone: true,
    imports: [
        AddPostFormWidget
    ],
    providers: [
        {
            provide: IMAGE_CONFIG,
            useValue: {
                disableImageSizeWarning: true,
                disableImageLazyLoadWarning: true
            }
        },
    ],
    template: `
    <div class="p-4">
        <h2>피드 페이지</h2>
        <br/>
        <button (click)="onOpenModal()">게시물 생성</button>

        <div class="border flex flex-wrap w-full gap-4 p-4">
            @for (item of postState?.items; track item.id) {
                <div class="p-4 w-[200px] flex flex-col gap-1">
                    <a [href]="item.url" target="_blank" class="w-full overflow-hidden rounded-xl">
                        <img [src]="item.thumbnail" [alt]="item.description" loading="lazy" class="w-full">
                    </a>
                    <a [href]="item.url" target="_blank" class="w-full">
                        <p class="text-sm font-bold">{{ item.title }}</p>
                        <p class="text-xs">{{ item.description }}</p>
                    </a>
                </div>
            }
        </div>
    </div>
    `
})
export class FeedPage {

    postState?: PostState;

    private readonly modalCtrl = inject(ModalController);

    private readonly postService = inject(PostService);

    constructor() {
        this.postService.getPosts().pipe(
            tap(state => this.postState = state)
        ).subscribe();
    }

    onOpenModal() {
        this.modalCtrl.open(AddPostFormWidget, {
            title: '게시물 생성',
            description: '게시물을 생성합니다.'
        });
    }
}
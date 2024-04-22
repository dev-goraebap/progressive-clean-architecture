import { IMAGE_CONFIG } from "@angular/common";
import { AfterViewInit, Component, ElementRef, ViewChild, inject } from "@angular/core";

import imagesLoaded from "imagesloaded";
import Masonry from "masonry-layout";

import { tap } from "rxjs";

import { PostCard, PostService, PostState } from "src/entities";
import { fadeInOut } from "src/shared";

@Component({
    selector: 'post-list-widget',
    standalone: true,
    imports: [
        PostCard
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
    animations: [
        fadeInOut
    ],
    template: `
    <div @fadeInOut #masonryView class="w-full md:w-[800px]">
        @for (item of postState?.items; track item.id) {
            <post-card [item]="item" />
        }
    </div>
    `
})
export class PostListWidget implements AfterViewInit {

    @ViewChild('masonryView') masonryView!: ElementRef<HTMLDivElement>;

    postState?: PostState;

    private readonly postService = inject(PostService);

    constructor() {
        this.postService.getPosts().pipe(
            tap(state => this.postState = state)
        ).subscribe();
    }

    ngAfterViewInit() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (!mutation.addedNodes.length) {
                    return;
                }

                observer.disconnect();

                imagesLoaded(this.masonryView.nativeElement, () => {
                    new Masonry(this.masonryView.nativeElement, {
                        itemSelector: '.masonry-item',
                    });
                });
            });
        });

        observer.observe(this.masonryView.nativeElement, {
            childList: true
        });
    }
}
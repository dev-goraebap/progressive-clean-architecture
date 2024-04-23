import { NgOptimizedImage } from "@angular/common";
import { Component, Input } from "@angular/core";

import { PostModel } from "./post.type";

@Component({
    selector: 'post-card',
    standalone: true,
    imports: [
        NgOptimizedImage,
    ],
    template: `
    <div class="flex flex-col gap-1 p-2">
        <a [href]="item.url" target="_blank" class="w-full overflow-hidden rounded-xl border">
            <img [ngSrc]="item.thumbnail" [alt]="item.description" loading="lazy" [width]="200" [height]="200" />
        </a>
        <a [href]="item.url" target="_blank" class="w-full">
            <p class="text-sm font-bold">{{ item.title }}</p>
            <p class="text-xs break-all">{{ item.description }}</p>
        </a>
    </div>
    `
})
export class PostCard {
    @Input() item!: PostModel;
}
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
    <div class="relative w-full flex flex-col gap-2">
        <div class="w-full h-[100px] border
        flex justify-center items-center 
        overflow-hidden rounded-xl">
            <img [src]="item.thumbnail" loading="lazy" class="min-h-[100px]"/>
        </div>

        <div class="w-full">
            <p class="text-sm font-bold truncate" [title]="item.title">{{ item.title }}</p>
            <p class="text-sm truncate" [title]="item.description">{{ item.description }}</p>
        </div>
    </div>
    `
})
export class PostCard {
    @Input() item!: PostModel;
}
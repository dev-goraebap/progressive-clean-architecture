import { Component, Input } from "@angular/core";
import { PostModel } from "./post.type";

@Component({
    selector: 'post-card',
    standalone: true,
    template: `
    <div class="masonry-item flex flex-col gap-1 p-2 box-border w-1/2 sm:w-1/3 md:w-1/4">
        <a [href]="item.url" target="_blank" class="w-full overflow-hidden rounded-xl border">
            <img [src]="item.thumbnail" [alt]="item.description" loading="lazy" class="w-full">
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
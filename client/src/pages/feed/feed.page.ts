import { Component } from "@angular/core";

import { PostListWidget } from "src/widgets";

@Component({
    selector: 'feed-page',
    standalone: true,
    imports: [
        PostListWidget
    ],
    template: `
    <div class="w-full flex justify-center">
        <post-list-widget />
    </div>
    `
})
export class FeedPage { }